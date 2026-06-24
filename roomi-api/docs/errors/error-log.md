# roomi-api 에러 로그

> 에러 발생 시 아래에 섹션 추가

---

## 2026-06-10 | Prisma 버전 미지정으로 7.x 설치 → config 구조 불일치

### 에러 메시지

```
Error code: P1012
The datasource property `directUrl` is no longer supported in schema files.
Move connection URLs to `prisma.config.ts`.
```

### 원인

`npm install prisma --save-dev` 버전 미지정 → Prisma 7.8.0 설치됨 (스펙: 6.x)

Prisma 7에서 datasource 구조가 변경됨:
- `schema.prisma`에서 URL 설정 불가 → `prisma.config.ts`로 이동
- `directUrl` 타입 정의 미완성으로 TypeScript 오류 발생

### 해결

Prisma 6.x로 다운그레이드

```bash
npm install prisma@6 --save-dev
npm install @prisma/client@6
```

`prisma.config.ts` 삭제 후 `schema.prisma`에 URL 설정 복원:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_URL_UNPOOLED")
}
```

### 교훈

패키지 설치 시 반드시 버전 명시. `latest` 설치는 breaking change를 동반할 수 있음.

---

## 2026-06-10 | Prisma db pull P1000 — 인증 실패 (Authentication failed)

### 에러 메시지

```
Error: P1000
Authentication failed against database server,
the provided database credentials for `(not available)` are not valid.
```

### 원인

`(not available)` = 연결 문자열에서 아이디/비밀번호 파싱 실패.
호스트 주소는 정상 연결됐으나 계정 정보만 인식 불가.
`.env`의 연결 문자열 형식 오류 또는 복사 과정의 문자 손상 추정.

### 해결

Neon 대시보드 → Connect → Prisma 선택 → .env 탭에서 연결 문자열 전체 재복사.
`.env` 파일 전체 내용 교체.

추가로 `schema.prisma`의 `directUrl = env("DATABASE_URL_UNPOOLED")` 제거.
Prisma 6(≥ 5.10)에서는 pooled URL 하나로 마이그레이션까지 처리 가능하므로 불필요.

### 결과

2026-06-11 `npx prisma db pull` 재실행 → 연결 성공 (P4001 = DB empty, 정상)

---

## 2026-06-12 | TS2353 — schema.prisma에 없는 필드를 Prisma upsert에서 사용

### 에러 메시지

```
lib/auth.ts:34:11 - error TS2353: Object literal may only specify known properties,
and 'provider' does not exist in type '...'

34           provider: account?.provider ?? "",
             ~~~~~~~~
```

### 원인

`lib/auth.ts`의 `prisma.user.upsert` create 블록에 `provider` 필드를 사용했으나,
`schema.prisma`의 User 모델에 `provider` 컬럼이 정의되어 있지 않음.

Prisma는 `schema.prisma`를 기반으로 TypeScript 타입을 자동 생성하므로,
schema에 없는 필드를 코드에서 사용하면 TypeScript가 컴파일 시점에 오류를 냄.

### 해결

1. `schema.prisma` User 모델에 `provider String?` 추가
2. `lib/auth.ts` 34번 줄 수정: `?? ""` → `?? null`
3. `npx prisma migrate dev --name add-provider-to-user` 실행
4. `npx tsc --noEmit` 재실행 → 오류 0개 확인

### 교훈

schema.prisma와 소스 코드는 항상 동기화되어야 합니다.
새 필드를 코드에서 쓰기 전에 schema에 먼저 추가해야 합니다.
TypeScript가 컴파일 시 잡아주기 때문에 런타임 전에 발견할 수 있습니다.

## 2026-06-22 | curl로 한글 쿼리 테스트 시 400 Bad Request(서버 로그에도 안 남음)

### 증상

Phase 7(검색 가용성 필터) 구현 후 `curl "http://localhost:3000/api/accommodations?region=서울"`로 테스트하는데 매번 400이 나고, dev 서버(`npm run dev`) 로그에는 이 요청이 전혀 안 찍힘.

### 원인

HTTP 요청 라인은 아스키 문자만 허용하는데, `curl`이 한글을 URL 인코딩 없이 그대로 보내서 Node의 HTTP 파서가 우리 라우트 핸들러에 도달하기 전에 자체적으로 요청을 거부함(그래서 우리 쪽 로그엔 안 남음). 코드 버그가 아니었음.

### 해결

```bash
curl -G "http://localhost:3000/api/accommodations" --data-urlencode "region=서울"
```

### 교훈

서버 로그에 요청 자체가 없으면 우리 코드 이전 단계(HTTP 파싱)에서 막혔다는 신호 — `curl`로 한글/특수문자 테스트할 때는 항상 `--data-urlencode`를 쓴다.

---

## 2026-06-22 | `Booking.status`가 일부 행에 대문자(`"CANCELLED"`)로 저장돼 있음

### 증상

가용성 필터(`status: { not: "cancelled" }`)가 취소된 예약을 제대로 무시하는지 수동 검증하다가, 일부 예약 행의 `status` 값이 소문자(`"cancelled"`)가 아니라 대문자(`"CANCELLED"`)로 저장돼 있는 걸 발견.

### 원인

`status` 필드가 Prisma `enum`이 아니라 그냥 `String`이라서, 어떤 값이든 자유롭게 들어갈 수 있음. 과거 수동 테스트 중 다른 표기로 입력된 행이 남아있었던 것으로 추정.

### 해결

이번엔 데이터를 직접 고치지 않고(테스트 데이터라 영향 적음), 코드 로직(`status: { not: "cancelled" }`)이 대소문자를 구분한다는 걸 인지하고 넘어감. 향후 `status`를 `enum Status { confirmed cancelled }`로 제한하는 게 개선 후보로 기술 부채에 등록.

### 교훈

자유 입력 가능한 `String` 필드에 "정해진 후보값만 와야 하는" 데이터(상태값 등)를 저장하면, 표기 불일치가 조용히 쌓일 수 있다. 처음부터 Prisma `enum`으로 제한하면 이런 문제 자체가 원천 차단된다.

---

## 2026-06-22 | `backfill-images.ts` 실행 후 이미지가 전부 깨짐 (picsum.photos 장애)

### 증상

`prisma/backfill-images.ts`로 `picsum.photos` URL을 `images` 필드에 채웠는데, 프론트에서 이미지가 하나도 안 뜨고 브라우저에서 직접 그 URL을 열어도 "Connection timed out, Error code 522"가 나옴.

### 원인

코드/스크립트 문제가 아니라 `picsum.photos` 서비스 자체의 장애(Cloudflare가 origin 서버 응답 없음을 알리는 522 에러).

### 해결

스크립트의 URL 생성 부분을 `placehold.co`로 교체해서 재실행. 이후 프론트에서 이 필드 자체를 더 이상 안 쓰고 로컬 이미지(`lib/typeImages.ts`)로 전환하면서 의존성 제거.

### 교훈

스크립트가 의존하는 외부 서비스가 갑자기 다 실패하면, 스크립트 코드를 의심하기 전에 `curl -sI`로 그 서비스 자체가 살아있는지 먼저 확인한다.

---

## 2026-06-23 | 동시 요청 시 같은 객실·날짜로 예약 2건 생성됨 (`POST /api/bookings`)

### 증상

같은 객실·같은 날짜로 거의 동시에 두 번 예약을 시도하면, 둘 다 성공해서 중복 예약이 생성될 수 있었음.

### 원인

기존 코드는 "겹치는 예약이 있는지 조회 → 없으면 생성"을 별도의 두 단계로 처리했음. 두 요청이 거의 동시에 들어오면, 둘 다 "조회" 단계에서 아직 상대방의 예약이 DB에 없는 걸 보고 통과한 뒤, 둘 다 "생성" 단계로 넘어가서 결국 둘 다 생성됨(전형적인 TOCTOU — Time-Of-Check to Time-Of-Use race condition).

### 해결

조회와 생성을 하나의 `prisma.$transaction()`으로 묶고, 격리 수준을 `Serializable`로 지정. Postgres가 동시에 실행되는 두 트랜잭션이 서로의 결과에 영향을 줄 수 있다고 판단하면 한쪽을 강제로 실패시키는데(에러 코드 `P2034`), 그 에러를 같은 409 충돌 응답으로 처리하도록 catch문 추가. 동시 요청 2개를 직접 보내서 하나는 200, 하나는 409로 막히는 것을 확인.

### 교훈

"먼저 조회해서 조건 확인 → 그 다음 쓰기"라는 패턴은 두 단계 사이에 다른 요청이 끼어들 수 있는 한 항상 레이스 컨디션 위험이 있다. 동시성이 문제 되는 쓰기 작업(예약, 재고 차감 등)은 조회+쓰기를 한 트랜잭션으로 묶어야 한다.

---
