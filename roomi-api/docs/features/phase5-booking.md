# Phase 5 — Booking API (예약 생성·조회·취소)

## 담당 도메인

예약 생성 + 내 예약 목록 + 예약 상세 + 예약 취소

---

## 전담 파일 경계

```
roomi-api/
└── app/api/bookings/
    ├── route.ts              → GET 내 예약 목록 / POST 예약 생성
    └── [id]/
        ├── route.ts          → GET 예약 상세
        └── cancel/
            └── route.ts      → PATCH 예약 취소
```

기존 파일 수정 없음. 신규 파일 3개 생성.

---

## 구현 우선순위

1. `route.ts` — POST 예약 생성 (핵심)
2. `route.ts` — GET 내 예약 목록
3. `[id]/route.ts` — GET 예약 상세
4. `[id]/cancel/route.ts` — PATCH 예약 취소

---

## 도메인 핵심 규칙

### 공통
- 모든 예약 API는 인증 필수 → `requireAuth()` 사용
- 본인 예약만 조회·취소 가능 (IDOR 방지) → `where: { id, userId }` 반드시 포함

### POST /api/bookings — 예약 생성

요청 바디:
| 필드 | 타입 | 설명 |
|---|---|---|
| `roomId` | string | 예약할 객실 ID |
| `checkIn` | string | 체크인 날짜 (ISO 형식) |
| `checkOut` | string | 체크아웃 날짜 (ISO 형식) |

서버에서 처리할 것:
- `roomId`로 Room 조회 → 없으면 404
- checkIn < checkOut 검증 → 아니면 400
- 중복 예약 확인 — 같은 방, 날짜 겹치면 409 CONFLICT
- 총 금액 서버 계산: `room.price × 박수` (클라이언트 값 사용 금지)
- `prisma.booking.create` 실행

### GET /api/bookings — 내 예약 목록

- 본인 예약만 조회: `where: { userId }`
- 숙소·객실 정보 포함: `include: { room: { include: { accommodation: true } } }`
- 최신순 정렬: `orderBy: { createdAt: "desc" }`

### GET /api/bookings/:id — 예약 상세

- 본인 예약만 조회: `where: { id, userId }`
- 없거나 남의 예약이면 404
- 숙소·객실 정보 포함

### PATCH /api/bookings/:id/cancel — 예약 취소

- 본인 예약만 취소: `where: { id, userId }` 확인 후
- `status: "CANCELLED"`로 변경 (삭제 아님)
- 이미 취소된 예약이면 400

---

## 구현 순서

1. `app/api/bookings/route.ts`
   - POST: Zod 바디 검증 → requireAuth → Room 조회 → 중복 확인 → 금액 계산 → create
   - GET: requireAuth → findMany (userId 필터) → include rooms+accommodation

2. `app/api/bookings/[id]/route.ts`
   - GET: requireAuth → findUnique (id + userId) → 없으면 404

3. `app/api/bookings/[id]/cancel/route.ts`
   - PATCH: requireAuth → findUnique 확인 → status 업데이트

4. `npx tsc --noEmit` — 타입 오류 0개 확인

---

## 의존 관계

- `lib/auth.ts` — `requireAuth()` 인증 확인
- `lib/prisma.ts` — DB 조회
- `lib/api-response.ts` — `apiSuccess`, `apiError`
- `lib/errors.ts` — `ErrorCode.NOT_FOUND`, `UNAUTHORIZED`, `CONFLICT`, `VALIDATION_ERROR`

---

## 새로 배울 개념

- `request.json()` — POST 바디 읽기 (쿼리 파라미터와 다른 방식)
- Zod로 날짜 문자열 검증 (`z.string().datetime()`)
- 중복 예약 확인 — Prisma `findFirst`로 날짜 겹침 조건 쿼리
- `prisma.booking.update` — 특정 필드만 업데이트
- 날짜 계산 — 박수 = (checkOut - checkIn) / 1일(ms)
- 중첩 include — `include: { room: { include: { accommodation: true } } }`

---

## 금지 사항

- `process.env` 직접 접근 금지
- `requireAuth()` 없는 API 금지
- 클라이언트에서 받은 총 금액 그대로 저장 금지 → 반드시 서버에서 계산
- `where: { id }` 단독 사용 금지 → 반드시 `userId` 포함 (IDOR 방지)
- 예약 취소 시 실제 삭제 금지 → status 변경으로 처리
