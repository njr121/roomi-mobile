# Phase 7 — 검색(지역·날짜·인원) 가용성 필터

## 담당 도메인

숙소 목록 API(`GET /api/accommodations`)에 지역·날짜(체크인/체크아웃)·인원 검색 조건 추가

---

## 전담 파일 경계

```
roomi-api/
└── app/api/accommodations/
    └── route.ts          → 기존 파일 수정 (쿼리 파라미터 추가)
```

신규 파일 없음. 기존 `route.ts` 한 곳만 수정.

---

## 구현 우선순위

1. Zod 쿼리 스키마에 `region`/`checkIn`/`checkOut`/`guests` 추가 + 검증 규칙
2. `where` 절에 지역·가용성 조건 추가

---

## 도메인 핵심 규칙

### 쿼리 파라미터 (기존 `page`/`limit`/`type`/`sort`에 추가)

| 파라미터 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `region` | string | 없음 | `location` 필드 부분 일치 검색 (대소문자 무시) |
| `checkIn` | date string | 없음 | 체크인 날짜 |
| `checkOut` | date string | 없음 | 체크아웃 날짜 |
| `guests` | number | 없음 | 인원 수 |

네 파라미터 전부 선택값 — 안 보내면 기존 동작(전체 목록) 그대로 유지.

### 검증 규칙

- `checkIn`/`checkOut`은 항상 같이 와야 함 — 하나만 오면 `VALIDATION_ERROR`
- `checkIn < checkOut` 필수 — 같거나 역순이면 `VALIDATION_ERROR`
- `guests`는 1 이상의 정수

### 가용성 판정 로직 (핵심)

"검색 조건을 만족하는 숙소"는 다음을 만족하는 **객실이 하나라도 있는** 숙소다.

1. `guests`가 있으면: `room.maxGuests >= guests`
2. `checkIn`/`checkOut`이 있으면: 그 객실에 기간이 겹치는 예약이 없어야 함

겹침 정의 (날짜가 한쪽만 닿는 경우는 겹침 아님):
```
기존예약.checkIn < 요청.checkOut  AND  기존예약.checkOut > 요청.checkIn
```

- 취소된 예약(`status: "cancelled"`)은 겹침 검사에서 제외
- `guests`와 `checkIn`/`checkOut`을 같이 보내면 **같은 객실**이 두 조건을 동시에 만족해야 함 (각각 따로 만족하는 다른 객실은 인정 안 됨)

### Prisma 표현 방식

`accommodation.findMany`의 `where`에 `rooms: { some: { ... } }`로 표현한다. `some` 안에:
- `maxGuests: { gte: guests }` (guests 있을 때)
- `bookings: { none: { status: { not: "cancelled" }, checkIn: { lt: checkOut }, checkOut: { gt: checkIn } } }` (checkIn/checkOut 있을 때)

`region`은 기존 `where`에 `location: { contains: region, mode: "insensitive" }`로 추가 (기존 `type` 조건과 같은 레벨, AND로 합쳐짐).

페이지네이션(`count`)도 동일한 `where`를 그대로 재사용해야 함 — 빠뜨리면 `totalPages`가 실제 결과 수와 안 맞음.

---

## 구현 순서

1. `QuerySchema`에 `region`/`checkIn`/`checkOut`/`guests` 필드 추가
2. `checkIn`/`checkOut` 동시 존재·순서 검증 로직 추가 (Zod `refine` 또는 별도 if문)
3. `where` 객체 조립 — `type`, `region`, `rooms.some` 조건을 조건부로 합치기
4. `findMany`와 `count` 양쪽에 동일한 `where` 적용 확인
5. `npx tsc --noEmit` — 타입 오류 0개 확인

---

## 의존 관계

- `lib/prisma.ts` — DB 조회
- `lib/api-response.ts` — `apiSuccess`, `apiError`
- `lib/errors.ts` — `ErrorCode.VALIDATION_ERROR`
- 기존 `type`/`sort`/`page`/`limit` 로직과 공존 — 그대로 유지, 제거 금지

---

## 새로 배울 개념

- Prisma 관계 필터 `some`/`none` (1:N 관계에서 "조건을 만족하는 자식이 (있다/없다)")
- 날짜 겹침(overlap) 판정 로직
- Zod `refine`으로 필드 간 상호 검증 (한쪽만 오면 에러)

---

## 금지 사항

- `process.env` 직접 접근 금지
- `any` 타입 사용 금지
- 기존 `type`/`sort`/`page`/`limit` 동작 변경 금지 — 추가만 할 것
- `findMany`와 `count`의 `where`가 서로 달라지지 않게 할 것 (변수로 한 번만 만들어서 양쪽에 재사용)
