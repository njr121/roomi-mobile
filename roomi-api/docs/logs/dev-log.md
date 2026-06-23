# roomi-api 작업 로그

> 작업 내용은 날짜별 섹션으로 추가

---

## 2026-06-10 | Phase 1 — DB 설계 및 공통 모듈 세팅

### 완료

- [x] Prisma 6.x 설치 (`prisma@6 --save-dev`, `@prisma/client@6`, `dotenv`)
- [x] `npx prisma init` 실행 (`prisma/schema.prisma`, `.env` 생성)
- [x] Neon DB `.env` 설정 (`DATABASE_URL` pooled + `DATABASE_URL_UNPOOLED` direct)
- [x] Prisma 7.x → 6.x 다운그레이드 (버전 불일치 에러 해결 → `error-log.md` 참고)
  - `prisma.config.ts` 삭제 (Prisma 7 전용 파일)
  - `schema.prisma` Prisma 6 형식으로 교체 (`prisma-client-js`, `url`, `directUrl`)

### 내일 이어서 할 것

1. Neon 대시보드 → Connect → Prisma → .env 탭 → 연결 문자열 전체 재복사 → `.env` 교체
2. `npx prisma db pull` 연결 테스트 재시도
3. `prisma/schema.prisma` 모델 작성 (PRD v7 기준)
4. `lib/` 공통 파일 생성 (prisma.ts, env.ts, errors.ts, api-response.ts)
5. 시드 데이터 작성 (숙소 48개)

---

## 2026-06-11 | Phase 1 계속 — Neon 연결 확인 및 스키마 작성

### 완료

- [x] Neon DB 연결 확인 (`npx prisma db pull`)
- [x] `schema.prisma` 모델 5개 작성 완료 (PRD v7 섹션 10.2 기준)
  - User, Accommodation, Room, Booking, Wishlist
  - 역참조 필드, onDelete: Cascade, @@index, @@unique 포함

### 기술 결정 사항

- Prisma 6(≥ 5.10) 기준 `directUrl` 불필요 → `DATABASE_URL` 단일 사용
- ID 생성: PRD의 `gen_random_uuid()` 대신 Prisma 기본값 `cuid()` 사용 (기능 동일)

- [x] `npx prisma migrate dev --name init` 실행 → **성공**
  - `prisma/migrations/20260611054358_init/migration.sql` 생성
  - Neon DB에 테이블 5개 생성 완료 (User, Accommodation, Room, Booking, Wishlist)
  - Prisma Client v6.19.3 자동 생성

### Phase 1 완료 ✅

| 항목 | 상태 |
|---|---|
| Prisma 6.x 설치 | ✅ |
| Neon DB 연결 | ✅ |
| schema.prisma 모델 5개 작성 | ✅ |
| migrate dev 실행 → DB 테이블 생성 | ✅ |

- [x] `feat/api` 브랜치 커밋 및 push 완료
  - 커밋: `chore(schema): Prisma 스키마 작성 및 Neon DB 마이그레이션 완료`
  - push → `origin/feat/api`

- [x] GitHub PR 생성 및 `feat/api → develop` 머지 완료 (PR #1)

### 다음 할 것 — Phase 2 공통 모듈

1. `lib/prisma.ts` — PrismaClient 싱글톤
2. `lib/env.ts` — Zod 환경변수 검증
3. `lib/errors.ts` — ErrorCode 상수 정의
4. `lib/api-response.ts` — 응답 포맷 유틸
5. `types/index.ts` — TypeScript 공통 타입
6. `prisma/seed.ts` — 숙소 시드 데이터 48개

---

## 2026-06-11 | Phase 2 — 공통 모듈 작업

### 완료

- [x] `lib/prisma.ts` — PrismaClient 싱글톤 (globalThis 패턴)
- [x] `lib/env.ts` — Zod safeParse 환경변수 검증
- [x] `lib/errors.ts` — ErrorCode 상수 + ErrorCodeType 타입
- [x] `lib/api-response.ts` — apiSuccess / apiError 유틸
- [x] `types/index.ts` — ApiResponse, ApiError, AccommodationType, BookingStatus, PaginationMeta
- [x] `npx tsc --noEmit` 오류 0개 확인

### 기술 결정 사항

- `env.ts`: `parse()` 대신 `safeParse()` 사용 — 에러 메시지를 직접 포맷해서 출력하기 위해
- `prisma.ts`: `globalThis` 사용 (`global` 대신) — Edge Runtime 호환성
- `types/index.ts`: `interface` 대신 `type`으로 통일

- [x] 커밋 및 push 완료
  - 커밋: `feat(common): 공통 모듈 구현 (prisma, env, errors, api-response, types)`
  - 커밋 해시: `58baefa`
  - push → `origin/feat/api`

### 다음 할 것

- [x] `prisma/seed.ts` — 숙소 시드 데이터 48개 작성 및 실행 완료
  - hotel 12 / motel 12 / pension 12 / resort 12 = 48개
  - 각 숙소당 객실 2개 = 96개
  - `npx prisma db seed` 성공
- [x] 커밋 `0d426d8` push 완료
  - `feat(common): 시드 데이터 48개 추가 및 package.json seed 스크립트 설정`

### Phase 2 완료 ✅

---

## 2026-06-12 | 세팅 정비 — Claude Code 설정 완료

### 완료

- [x] `roomi-api/.claude/settings.json` — 차단 규칙 5개 확정
  - `Write(.env*)`, `Write(prisma/migrations/*)`, `Write(**/node_modules/**)`
  - `Write(package-lock.json)`, `Write(.github/workflows/*)`
- [x] `roomi-api/.claude/settings.local.json` — `../roomi-app/**` 도메인 차단 확인
- [x] `CLAUDE.md` — "Claude Code 설정 파일" 섹션 추가 (실제 파일 위치·내용 기준)
- [x] 전체 문서 정합성 수정 — Google 단독 → 4-provider 인증으로 확장
  - `CLAUDE.md`, `phase3-auth.md`, `phase2-common-modules.md` 반영
- [x] 파일명 kebab-case 통일 — `dev_log.md` → `dev-log.md`, `error_log.md` → `error-log.md` (git mv)
- [x] `CLAUDE.md` — 문서 작성 규칙, 코드 사이클, 승인 먼저 섹션 추가

### 커밋 이력

- `f9038a7` — `chore(common): 하네스 차단 규칙 설정 및 Phase 1·2 작업 정의 문서 추가`
- `ea50a78` — `docs(auth): Phase 3 인증 기능 정의 문서 추가 (4-provider)`
- `6bea79c` — `docs(common): 문서 작성 규칙, 코드 사이클, 4-provider 인증 확장`
- `6bfcb86` — `docs(logs): 260612 하네스 정비 및 문서 정합성 수정 기록`

- [x] `git push origin feat/api` — `0d426d8..ca90516` push 완료

### 다음 할 것

1. PR #2 생성 — `feat/api → develop` 머지
2. Phase 3 시작 — `roomi-api/docs/features/phase3-auth.md` 확인 후 Auth 구현

---

## 2026-06-12 | Phase 3 — Auth 구현 시작

### 완료

- [x] PR #2 (`feat/api → develop`) 머지 확인
- [x] `next-auth@5.0.0-beta.31` 설치

### 완료

- [x] `next-auth@5.0.0-beta.31` 설치
- [x] `lib/env.ts` — 카카오·네이버 환경변수 4개 추가 (`KAKAO_CLIENT_ID/SECRET`, `NAVER_CLIENT_ID/SECRET`)
- [x] `lib/auth.ts` — NextAuth 설정 완료
  - Google·카카오·네이버 Provider 3개
  - `session: { strategy: "jwt" }`
  - callbacks 골격 (signIn, jwt, session) — 다음 단계에서 구현

### 진행 중

- [x] `app/api/auth/[...nextauth]/route.ts` — Route Handler 완료
- [x] `types/index.ts` — Session 타입 확장 완료 (declare module "next-auth")
- [x] callbacks.signIn — prisma.user.upsert, return true
- [x] callbacks.jwt — token.id = user.id 저장
- [x] callbacks.session — session.user.id = token.id 주입

### 타입 검사 에러 발생 (2026-06-12)

`npx tsc --noEmit` 실행 결과: 에러 1개

```
lib/auth.ts:34:11 - error TS2353
'provider' does not exist in type '...'
```

원인: `schema.prisma` User 모델에 `provider` 필드 없음 → Prisma 생성 타입과 불일치

### 수정 방향

1. `schema.prisma` User 모델에 `provider String?` 추가
2. `lib/auth.ts` 34번 줄: `?? ""` → `?? null`
3. `npx prisma migrate dev --name add-provider-to-user` 실행
4. `npx tsc --noEmit` 재확인

### 수정 완료

- [x] `schema.prisma` — `provider String?` 추가
- [x] `lib/auth.ts` — `?? ""` → `?? null` 수정
- [x] `npx prisma migrate dev --name add-provider-to-user` 성공
  - 마이그레이션 파일: `prisma/migrations/20260612081109_add_provider_to_user/migration.sql`
  - Neon DB `User` 테이블에 `provider` 컬럼 추가 완료

### requireAuth() 구현 완료

- [x] `lib/auth.ts` — `requireAuth()` 추가 완료
  - import 3개 추가 (`NextResponse`, `apiError`, `ErrorCode`)
  - `Promise<string | NextResponse>` 반환 타입
  - `auth()` 세션 확인 → 미인증 시 401 반환 → userId 반환
- [x] `npx tsc --noEmit` — 오류 0개
- [x] 커밋 `5891c32` — `feat(auth): requireAuth 인증 미들웨어 추가`
- [x] `git push origin feat/api` — `faf4895..5891c32` push 완료

### Phase 3 완료 ✅

| 항목 | 상태 |
|---|---|
| `lib/env.ts` — Kakao·Naver 환경변수 추가 | ✅ |
| `lib/auth.ts` — NextAuth 3 providers + callbacks | ✅ |
| `app/api/auth/[...nextauth]/route.ts` — Route Handler | ✅ |
| `types/index.ts` — Session 타입 확장 | ✅ |
| `prisma/schema.prisma` — provider 컬럼 추가 | ✅ |
| `requireAuth()` — 인증 미들웨어 | ✅ |
| `.env` 실제 키값 입력 | ⏸ 테스트 시 진행 |
| 이메일/비밀번호 4개 route | ⏸ 시간 부족 시 생략 |

### 다음 할 것

1. ~~PR #3 생성~~ → ✅ Squash merge 완료 (2026-06-12)
2. Phase 4 시작 — 숙소 목록 API

---

## 2026-06-15 | Phase 4 — 숙소 목록·상세 API + Husky 설치

### 완료

- [x] `app/api/accommodations/route.ts` — GET 목록 API
  - Zod 쿼리 파라미터 검증 (page, limit, type, sort)
  - `null → undefined` 변환 (`?? undefined` 패턴)
  - `prisma.accommodation.findMany` + `count` — `Promise.all` 동시 실행
  - 페이지네이션 응답 `{ data, pagination: { page, limit, total, totalPages } }`
- [x] `app/api/accommodations/[id]/route.ts` — GET 상세 API
  - `params: Promise<{ id: string }>` 경로 파라미터 추출
  - `prisma.accommodation.findUnique` + `include: { rooms: true }`
  - 없으면 `404 NOT_FOUND`, 있으면 `apiSuccess`
- [x] `npx tsc --noEmit` — 오류 0개 확인
- [x] Husky 설치 (루트) — pre-commit 시 `cd roomi-api && npx tsc --noEmit` 자동 실행
- [x] 커밋 `d2ba923` — `feat(accommodation): 숙소 목록·상세 API 구현`

### 기술 결정 사항

- `Promise.all` 사용 — `findMany`와 `count`를 순차가 아닌 동시 실행으로 성능 개선
- `?? undefined` 패턴 — `searchParams.get()`의 `null` 반환값을 `undefined`로 변환해야 Zod `.default()` 작동
- Husky는 `.git`이 있는 루트에만 설치 (서브폴더 설치 불가)

### Phase 4 완료 ✅

| 항목 | 상태 |
|---|---|
| GET /api/accommodations (목록) | ✅ |
| GET /api/accommodations/:id (상세) | ✅ |
| Husky pre-commit hook | ✅ |

### 다음 할 것

1. `git push origin feat/api`
2. PR #4 생성 (`feat/api → develop`)
3. Phase 5 시작 — 예약 API

---

## 2026-06-15 | Phase 5 — 예약 API

### 완료

- [x] `app/api/bookings/route.ts` — POST 예약 생성 / GET 내 예약 목록
  - `requireAuth()` + `instanceof NextResponse` 타입 가드 패턴 적용
  - Zod 바디 검증 (roomId, checkIn, checkOut, guests)
  - Room 조회 → 날짜 순서 검증 → 중복 예약 `findFirst` → 금액 계산 → `booking.create`
  - 중복 날짜 조건: `checkIn: { lt: checkOut }` + `checkOut: { gt: checkIn }`
  - `Math.round(room.price * nights)` — Int 타입 안전 처리
  - GET: `findMany` + `include: { room: { include: { accommodation: true } } }` + `orderBy: createdAt desc`
- [x] `app/api/bookings/[id]/route.ts` — GET 예약 상세
  - `where: { id, userId: authResult }` — IDOR 방지
  - 중첩 include (room → accommodation)
- [x] `app/api/bookings/[id]/cancel/route.ts` — PATCH 예약 취소
  - 본인 예약 확인 → 이미 취소 여부 확인 → `status: "CANCELLED"` 업데이트
  - 실제 삭제 없음 (status 변경으로 처리)
- [x] `npx tsc --noEmit` — 오류 0개 확인

### 기술 결정 사항

- `requireAuth()` 반환 타입 `string | NextResponse` → `instanceof NextResponse` 체크 후 userId로 좁히는 패턴 확립
- IDOR 방지: `where: { id, userId }` 두 조건 항상 같이 사용
- 예약 취소: DELETE 아닌 PATCH로 status 변경 (취소 이력 보존)

### Phase 5 완료 ✅

| 항목 | 상태 |
|---|---|
| POST /api/bookings (예약 생성) | ✅ |
| GET /api/bookings (내 목록) | ✅ |
| GET /api/bookings/:id (상세) | ✅ |
| PATCH /api/bookings/:id/cancel (취소) | ✅ |

### 다음 할 것

1. `git push origin feat/api`
2. PR #5 생성 (`feat/api → develop`)
3. Phase 6 시작 — 찜하기 API

---

## 2026-06-16 | Phase 6 — 찜하기 API

### 완료

- [x] `docs/features/phase6-wishlist.md` 기능 정의 문서 작성
- [x] `schema.prisma` Wishlist 모델에 `createdAt DateTime @default(now())` 추가
- [x] `npx prisma migrate dev --name add-createdAt-to-wishlist` 성공
  - 마이그레이션 파일: `prisma/migrations/20260616021041_add_created_at_to_wishlist/migration.sql`
- [x] `app/api/wishlists/route.ts` — POST (찜 추가) / GET (내 목록) 완성
  - 중복 확인 → 409 WISHLIST_ALREADY_EXISTS
  - `orderBy: { createdAt: "desc" }` 정렬 포함
- [x] `npx tsc --noEmit` — 오류 0개 확인

### 완료 (추가)

- [x] `app/api/wishlists/[accommodationId]/route.ts` — DELETE (찜 삭제) 완성
  - `findFirst({ where: { userId, accommodationId } })` → null 시 404
  - `delete({ where: { id: wishlist.id } })` → 삭제 후 200 반환
- [x] `npx tsc --noEmit` — 오류 0개 확인

### 기술 결정 사항

- `findFirst` 사용: userId + accommodationId 조합 조건은 `findUnique`로 쓸 수 없음 (unique 필드 단독이 아님)
- 삭제 전 `findFirst` 존재 확인 필수: Prisma `delete`는 대상 없으면 런타임 에러 발생

### Phase 6 완료 ✅

| 항목 | 상태 |
|---|---|
| POST /api/wishlists (찜 추가) | ✅ |
| GET /api/wishlists (내 목록) | ✅ |
| DELETE /api/wishlists/:accommodationId (찜 삭제) | ✅ |
| schema.prisma createdAt 추가 + 마이그레이션 | ✅ |

### 다음 할 것

- PR #6 머지 완료 (`feat/api → develop`) — 2026-06-16
- 다음 Phase 검토

---

## 2026-06-19 | Phase 12 — 모바일 인증 1~2단계

### 완료

- [x] `jose@^6.2.3` 설치 (명시 버전, `latest` 아님)
- [x] `lib/env.ts`에 `MOBILE_JWT_SECRET` 검증 추가
- [x] `app/api/auth/mobile/google/route.ts` 신규 작성
  - `request.json()` → `idToken` 구조분해 → 없으면 400
  - 구글 `tokeninfo` 엔드포인트로 진위 확인 → `.ok` 아니면 401
  - `googleResponse.json()`으로 email/name 추출
  - `prisma.user.upsert`로 회원가입/로그인 동시 처리 (`provider: "google"`)
  - `jose`의 `SignJWT`로 `{ userId: user.id }` 서명, 만료 30일
  - `apiSuccess({ token, user })` 응답
- [x] `npx tsc --noEmit` 오류 0개

### 기술 결정

- `requireAuth()`를 이 라우트 안에서 호출하지 않음 — 이 라우트 자체가 "로그인하기 위해" 부르는 곳이라 아직 토큰이 없는 게 정상이라서 인증 체크 대상이 아님

### 다음

1. `lib/auth.ts`의 `requireAuth()` 확장 — 쿠키 세션 실패 시 `Authorization: Bearer <token>` 헤더도 `jose`로 검증하도록 추가

### Phase 12 3단계 완료 — `requireAuth()` 확장 (2026-06-19)

- [x] 쿠키 세션 있으면 `session.user.id` 즉시 반환 (기존 웹 흐름 그대로 유지)
- [x] 쿠키 세션 없으면 `Authorization: Bearer <token>` 헤더 확인 → `jose`의 `jwtVerify`로 검증 → 통과 시 `payload.userId` 반환
- [x] 검증 실패(헤더 없음/형식 틀림/토큰 위조·만료) 시 기존과 동일한 401 응답
- [x] `npx tsc --noEmit` 오류 0개 확인

**Phase 12 백엔드(1~3단계) 전체 완료** — 다음은 Google Cloud Console 모바일 클라이언트 ID 발급(사용자 직접) → 프론트(`authStore`, `lib/api.ts`, 로그인 화면)

### 다음

1. Google Cloud Console에서 모바일용 OAuth 클라이언트 ID 발급 (사용자 직접)
2. 프론트 4단계 — `store/authStore.ts` → `lib/api.ts` 토큰 첨부 → 로그인 화면

### 보류 확인 — 카카오·네이버 모바일 로그인 (2026-06-19)

PRD 원래 범위는 Google·카카오·네이버 3개 소셜 로그인이다. 현재 상태 정리:

- 웹(쿠키 기반) 로그인은 `lib/auth.ts`의 NextAuth 설정에 3개 provider가 Phase 3부터 이미 다 등록돼 있어 동작함
- 오늘 만든 모바일 전용 토큰 발급 라우트(`/api/auth/mobile/google`)는 Google 1개만 구현 — `phase12-auth.md`에 "Google로 패턴 검증 후 시간 남으면 카카오·네이버 추가"로 이미 명시된 의도적 보류
- 패턴이 검증됐으므로, 카카오·네이버 모바일 라우트는 `/api/auth/mobile/google/route.ts`를 복사해서 provider 이름과 토큰 검증 엔드포인트만 바꾸는 수준의 작업
- 착수 시점은 일정 여유 보고 추후 결정

## 2026-06-22 | Phase 7 — 검색(지역·날짜·인원) 가용성 필터 설계

### 완료

- [x] `docs/features/phase7-search-availability.md` 작성 완료

### 기술 결정

- `GET /api/accommodations`에 `region`/`checkIn`/`checkOut`/`guests` 쿼리 파라미터 추가, 기존 `page`/`limit`/`type`/`sort`는 그대로 유지
- 날짜 검색을 실제 가용성 체크(겹치는 예약 확인)로 구현하기로 결정 — 단순 입력값 전달보다 구현량은 늘지만 사용자가 직접 선택
- Prisma `rooms: { some: { ... } }` 관계 필터로 "조건을 만족하는 객실이 하나라도 있는 숙소"를 표현, `guests`와 날짜 조건은 같은 객실이 동시에 만족해야 함

### 다음

1. `app/api/accommodations/route.ts` 수정
2. `npx tsc --noEmit` 확인
3. 완료 후 `feat/app`으로 전환 — `SearchBar`/`FilterSheet`/`SortSelector`/`Pagination` 프론트 구현

### Phase 7 구현 완료 (2026-06-22)

- [x] `app/api/accommodations/route.ts` 수정 — `QuerySchema`에 `region`/`checkIn`/`checkOut`/`guests` 추가, `.refine()` 2회로 날짜 상호 검증, `roomCondition`을 분리 조립해 `rooms: { some: {...} }`로 가용성 필터 구현
- [x] `npx tsc --noEmit` 오류 0개 확인

### 수동 검증 완료 (2026-06-22)

- `region=서울` → `total: 48`, `region=부산` → `total: 0` (시드 데이터가 전부 서울이라 정상)
- `guests=2` → `total: 48`(모든 숙소가 2인실 보유), `guests=10` → `total: 0`(10인실 없음)
- `checkIn`+`checkOut` 동시 → 정상 결과, `checkIn`만 단독 → `400 VALIDATION_ERROR` 정상

### 에러 1건 해결 — `curl`로 한글 쿼리 테스트 시 `400 Bad Request`(서버 로그에도 안 남음)

`curl "...?region=서울"`처럼 한글을 URL 인코딩 없이 그대로 보내면, HTTP 요청 라인은 아스키 문자만 허용하는 규격이라 Node의 HTTP 파서가 Next.js 라우트 핸들러에 도달하기도 전에 자체적으로 `400`을 반환하고 연결을 끊음(그래서 dev 서버 로그에 요청 자체가 안 찍힘). 코드 버그가 아니라 테스트 명령어 문제 — `curl -G ... --data-urlencode "region=서울"`로 curl이 자동 인코딩하게 하면 해결. 실제 앱은 `fetch`/`axios`가 자동 인코딩하므로 영향 없음

**Phase 7(검색 가용성 필터) 백엔드 전체 완료**

### 다음

1. `feat/app`으로 전환 — `SearchBar`/`FilterSheet`/`SortSelector`/`Pagination` 프론트 구현

---

## 2026-06-22 | 정렬 옵션 누락 보완 — 평점 정렬

### PRD 대조 중 발견

`feat/app`에서 Phase 18(홈 레이아웃) 작업 중 사용자 요청으로 PRD 전체를 다시 대조한 결과, 정렬 옵션이 PRD(3번, API 명세 11.1)는 `priceChangeRate`/`currentPrice`/`rating` 3가지인데 구현은 2가지만 있던 것을 발견

### 수정

- `app/api/accommodations/route.ts`의 `orderBy`를 `{ [sort]: sort === "rating" ? "desc" : "asc" }`로 분기 — 평점은 "높은순"이라 내림차순 필요, 기존 가격·변동률은 그대로 오름차순 유지
- `curl -G ... --data-urlencode "sort=rating"`로 정상 응답 확인(다만 시드 데이터의 `rating`이 전부 4.0으로 동일해서 순서 차이는 화면상 검증 불가 — 데이터 한계, 로직 자체는 정상)

### 이미지 백필 스크립트 추가

- 시드 데이터에 `images`가 전부 빈 배열이라 프론트 카드가 항상 회색 박스였던 문제 발견 → `prisma/backfill-images.ts` 신규(기존 행 보존, `images` 필드만 업데이트), `prisma/seed.ts`도 향후 신규 시드 대비 동기화
- picsum.photos 서비스 장애(Cloudflare 522)로 1차 시도 실패 → `placehold.co`로 교체, 한글 텍스트는 폰트 미지원으로 깨져서 숙박 종류별 색상 블록(텍스트 없음)으로 최종 정리
