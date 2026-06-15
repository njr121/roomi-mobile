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

### Claude 직접 수정 기록

- `docs/log/study-log.md` — 목차(Table of Contents) 추가
- `docs/log/study-log.md` — 코드 작성 완료 섹션 4곳에 "직접 써봤나? ✅" 마커 추가
  - lib/env.ts, lib/auth.ts, route.ts, types/index.ts (declare module)

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
