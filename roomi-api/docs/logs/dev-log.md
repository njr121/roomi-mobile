# roomi-api 작업 로그

> 작업 내용은 날짜별 섹션으로 추가

---

## 2026-06-10 | Phase 1 — DB 설계 및 공통 모듈 세팅

### 완료

- [x] Prisma 6.x 설치 (`prisma@6 --save-dev`, `@prisma/client@6`, `dotenv`)
- [x] `npx prisma init` 실행 (`prisma/schema.prisma`, `.env` 생성)
- [x] Neon DB `.env` 설정 (`DATABASE_URL` pooled + `DATABASE_URL_UNPOOLED` direct)
- [x] Prisma 7.x → 6.x 다운그레이드 (버전 불일치 에러 해결 → `error_log.md` 참고)
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

### 다음 할 것

- GitHub `feat/api → develop` PR 생성
- Phase 2 공통 모듈 작업 시작
