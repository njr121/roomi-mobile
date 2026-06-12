# Phase 2 — 공통 모듈 작업 정의

> 구현 전 이 파일을 먼저 읽는다.
> 각 파일이 무엇을 해야 하는지 정의만 한다. 실제 코드는 여기 없다.

---

## 작업 순서

1. `lib/prisma.ts`
2. `lib/env.ts`
3. `lib/errors.ts`
4. `lib/api-response.ts`
5. `types/index.ts`
6. `prisma/seed.ts`

---

## 1. lib/prisma.ts — PrismaClient 싱글톤

**목적**: PrismaClient를 앱 전체에서 하나만 생성해서 재사용

**이 파일이 없으면**: Next.js 핫리로드 시 PrismaClient가 계속 새로 만들어져 DB 연결 초과 발생

**내보내야 할 것**: `export default prisma` (PrismaClient 인스턴스)

**성공 기준**: 어디서 import해도 같은 인스턴스를 반환함

---

## 2. lib/env.ts — 환경변수 Zod 검증

**목적**: 앱 시작 시 필수 환경변수가 존재하는지 확인. 없으면 즉시 에러 발생시켜 런타임 오류 방지

**이 파일이 없으면**: 환경변수 누락 시 API 호출할 때까지 에러를 모름. 디버깅 어려워짐

**검증해야 할 환경변수**:
- `DATABASE_URL` — Neon DB 연결 문자열
- `NEXTAUTH_SECRET` — NextAuth 서명 키
- `NEXTAUTH_URL` — 앱 URL
- `GOOGLE_CLIENT_ID` — Google OAuth
- `GOOGLE_CLIENT_SECRET` — Google OAuth
- `KAKAO_CLIENT_ID` — 카카오 OAuth
- `KAKAO_CLIENT_SECRET` — 카카오 OAuth
- `NAVER_CLIENT_ID` — 네이버 OAuth
- `NAVER_CLIENT_SECRET` — 네이버 OAuth
- `EMAIL_SERVER_HOST` — 이메일 SMTP (이메일 인증 구현 시)
- `EMAIL_SERVER_PORT` — 이메일 SMTP 포트
- `EMAIL_SERVER_USER` — 이메일 계정
- `EMAIL_SERVER_PASSWORD` — 이메일 비밀번호
- `EMAIL_FROM` — 발신자 주소

> 구현하는 provider에 해당하는 환경변수만 추가한다. 우선순위: Google → 카카오 → 네이버 → 이메일

**내보내야 할 것**: `export const env` (검증된 환경변수 객체)

**절대 금지**: 다른 파일에서 `process.env.XXX` 직접 접근 → 반드시 `import { env } from '@/lib/env'` 사용

---

## 3. lib/errors.ts — 에러 코드 상수 정의

**목적**: API 응답에서 에러 코드를 문자열 대신 상수로 관리. 오타 방지 + 일관성 유지

**이 파일이 없으면**: 에러 메시지가 파일마다 달라짐. `"NOT_FOUND"`, `"not_found"`, `"notFound"` 혼재

**정의해야 할 에러 코드**:
- `UNAUTHORIZED` — 로그인 필요
- `FORBIDDEN` — 권한 없음
- `NOT_FOUND` — 리소스 없음
- `VALIDATION_ERROR` — 입력값 검증 실패
- `INTERNAL_ERROR` — 서버 내부 오류
- `CONFLICT` — 중복 데이터 (예: 이미 찜한 숙소)

**내보내야 할 것**: `export const ErrorCode` (객체 또는 enum)

---

## 4. lib/api-response.ts — 응답 포맷 유틸

**목적**: 모든 API 응답 형식을 통일. 프론트에서 항상 같은 구조로 받을 수 있게

**이 파일이 없으면**: API마다 응답 구조가 달라 프론트 처리가 복잡해짐

**응답 포맷**:
```json
// 성공
{ "success": true, "data": { ... } }

// 실패
{ "success": false, "error": { "code": "NOT_FOUND", "message": "숙소를 찾을 수 없습니다" } }
```

**내보내야 할 것**:
- `apiSuccess(data)` → 성공 응답 생성
- `apiError(code, message, status)` → 에러 응답 생성

---

## 5. types/index.ts — TypeScript 공통 타입

**목적**: 프론트·백 양쪽에서 쓰는 타입을 한 곳에 정의

**정의해야 할 타입** (PRD v7 섹션 13 기준):
- `ApiResponse<T>` — 공통 응답 타입
- `ApiError` — 에러 응답 타입
- `AccommodationType` — 숙소 타입 (hotel | motel | pension | resort)
- `BookingStatus` — 예약 상태 (confirmed | cancelled)
- `PaginationMeta` — 페이지네이션 메타 (page, limit, total, totalPages)

---

## 6. prisma/seed.ts — 숙소 시드 데이터

**목적**: 개발·테스트용 샘플 데이터 48개를 DB에 삽입

**이 파일이 없으면**: API 만들어도 데이터가 없어 테스트 불가

**데이터 구성** (PRD 기준):
- 숙소 48개: hotel 12, motel 12, pension 12, resort 12
- 각 숙소당 객실 2~3개
- `priceChangeRate`: 성수기 가격 변동률 (-5% ~ +80% 범위)
- 이미지는 placeholder URL 사용

**실행 명령**: `npx prisma db seed`

---

## 완료 기준

모든 파일 작성 후:
```bash
npx tsc --noEmit  # TypeScript 오류 0개
```

에러 없으면 커밋 → push → PR 진행
