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

### 다음 할 것

1. PR #2 생성 — `feat/api → develop` 머지 (Phase 2 커밋 2개)
2. Phase 3 시작 — `roomi-api/docs/features/phase3-auth.md` 확인 후 Auth 구현
