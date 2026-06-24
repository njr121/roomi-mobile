# Phase 6 — 찜하기 API

## 담당 도메인

`roomi-api` — feat/api 브랜치

---

## 전담 파일 경계

```
roomi-api/
└── app/api/
    └── wishlists/
        ├── route.ts                        → POST (추가) / GET (내 목록)
        └── [accommodationId]/
            └── route.ts                    → DELETE (삭제)
```

---

## 구현 우선순위

1. POST /api/wishlists — 찜 추가
2. DELETE /api/wishlists/:accommodationId — 찜 삭제
3. GET /api/wishlists — 내 찜 목록

---

## 도메인 핵심 규칙

- 모든 엔드포인트 인증 필수 (`requireAuth()`)
- 같은 숙소를 중복 찜 불가 — `@@unique([userId, accommodationId])`
  - 중복 추가 시 `409 CONFLICT` 반환 (에러로 처리)
- 삭제 시 본인 찜만 삭제 가능 — `where: { userId, accommodationId }` 두 조건 항상 같이
- GET 목록은 숙소 정보 포함해서 반환 (`include: { accommodation: true }`)

---

## 엔드포인트 정의

### POST /api/wishlists

- 인증: 필수
- 바디: `{ accommodationId: string }`
- 동작: 찜 레코드 생성
- 중복 시: `409 WISHLIST_ALREADY_EXISTS`
- 성공 시: `201` + 생성된 찜 레코드

### DELETE /api/wishlists/:accommodationId

- 인증: 필수
- 경로 파라미터: `accommodationId`
- 동작: `where: { userId, accommodationId }` 조건으로 삭제
- 없으면: `404 NOT_FOUND`
- 성공 시: `200` + 삭제된 레코드

### GET /api/wishlists

- 인증: 필수
- 동작: 내 찜 목록 전체 조회 + 숙소 정보 포함
- 정렬: `createdAt desc` (최근 찜한 것부터)
- 성공 시: `200` + 배열

---

## 구현 순서

1. `app/api/wishlists/route.ts` 생성
   - POST: Zod 바디 검증 → 중복 확인 → `wishlist.create`
   - GET: `wishlist.findMany` + `include: { accommodation: true }` + `orderBy: createdAt desc`

2. `app/api/wishlists/[accommodationId]/route.ts` 생성
   - DELETE: 경로 파라미터 추출 → `wishlist.findFirst` 존재 확인 → `wishlist.delete`

3. `npx tsc --noEmit` 오류 0개 확인

---

## 의존 관계

- `lib/auth.ts` — `requireAuth()` 사용
- `lib/prisma.ts` — PrismaClient 싱글톤
- `lib/api-response.ts` — `apiSuccess`, `apiError`
- `lib/errors.ts` — `ErrorCode` 상수
- `types/index.ts` — 기존 타입 재사용

---

## 에러 코드 추가 필요

`lib/errors.ts`에 아래 상수 추가:

```typescript
WISHLIST_ALREADY_EXISTS: "WISHLIST_ALREADY_EXISTS",
```

---

## 금지 사항

- 찜 수정(PATCH) 없음 — 찜은 추가와 삭제만 존재
- 페이지네이션 없음 — 찜 목록은 전체 반환 (포트폴리오 수준에서 생략)
- `prisma.wishlist.deleteMany` 금지 — 단건 삭제만 허용 (다른 사용자 데이터 보호)
