# Phase 4 — Accommodation API (숙소 목록 · 상세)

## 담당 도메인

숙소 목록 조회 (필터·정렬·페이지네이션) + 숙소 상세 조회 (객실 포함)

---

## 전담 파일 경계

```
roomi-api/
└── app/api/accommodations/
    ├── route.ts              → GET /api/accommodations (목록)
    └── [id]/
        └── route.ts          → GET /api/accommodations/:id (상세)
```

기존 파일 수정 없음. 신규 파일 2개만 생성.

---

## 구현 우선순위

1. `route.ts` — 목록 API (핵심 비즈니스 로직)
2. `[id]/route.ts` — 상세 API

---

## 도메인 핵심 규칙

### 공통
- 인증 불필요 — 비로그인 사용자도 조회 가능 (공개 API)
- 응답은 반드시 `apiSuccess()` / `apiError()` 포맷 사용

### 목록 API (GET /api/accommodations)

쿼리 파라미터:

| 파라미터 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `page` | number | 1 | 페이지 번호 |
| `limit` | number | 10 | 페이지당 숙소 수 |
| `type` | string | 없음 | hotel / motel / pension / resort |
| `sort` | string | priceChangeRate | 정렬 기준 |

정렬:
- `sort=priceChangeRate` → `priceChangeRate` 오름차순 (상승률 낮은 순) ← 핵심 차별화
- 기본값도 `priceChangeRate` 오름차순

페이지네이션 응답에 포함할 것:
- `data` — 숙소 배열
- `pagination` — `{ page, limit, total, totalPages }`

### 상세 API (GET /api/accommodations/:id)

- 숙소 정보 + 해당 숙소의 객실 목록(`rooms`) 포함
- 존재하지 않는 id → `404 NOT_FOUND`

---

## 구현 순서

1. `app/api/accommodations/route.ts`
   - Zod로 쿼리 파라미터 검증 스키마 정의
   - `prisma.accommodation.findMany()` — where, orderBy, take, skip
   - `prisma.accommodation.count()` — 전체 수 (totalPages 계산)
   - `apiSuccess()` 로 응답

2. `app/api/accommodations/[id]/route.ts`
   - `prisma.accommodation.findUnique()` — `include: { rooms: true }`
   - 없으면 `apiError(ErrorCode.NOT_FOUND, ...)`
   - `apiSuccess()` 로 응답

3. `npx tsc --noEmit` — 타입 오류 0개 확인

---

## 의존 관계

- `lib/prisma.ts` — DB 조회
- `lib/api-response.ts` — `apiSuccess`, `apiError`
- `lib/errors.ts` — `ErrorCode.NOT_FOUND`
- `lib/env.ts` — 직접 사용 없음 (prisma가 내부적으로 사용)
- `types/index.ts` — `AccommodationType` 타입 (필터 검증에 사용)

---

## 새로 배울 개념

- URL 쿼리 파라미터 읽기 (`request.nextUrl.searchParams`)
- Prisma `findMany` 옵션 — `where`, `orderBy`, `take`, `skip`
- 페이지네이션 계산 (`skip = (page - 1) * limit`)
- `findUnique` + `include` (관계 데이터 함께 조회)
- Zod로 쿼리 파라미터 타입 변환 (`z.coerce.number()`)

---

## 금지 사항

- `process.env` 직접 접근 금지
- `requireAuth()` 사용 금지 (이 API는 인증 불필요)
- 총 금액 계산 로직 여기 넣지 않음 (예약 API에서 처리)
- `any` 타입 사용 금지
