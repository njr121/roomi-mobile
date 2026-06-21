# Phase 13 — 예약(객실 선택 → 예약 생성)

> 구현 전 이 파일을 먼저 읽는다.
> 무엇을 만들지 정의만 한다. 실제 코드는 여기 없다.

---

## 전제

Phase 12에서 인증(로그인)이 완료됐다. 이 문서는 숙소 상세 화면의 객실 목록에서 객실을 선택해 예약을 생성하는 화면을 정의한다. 인증이 필요한 화면 — 비로그인 상태면 로그인 화면으로 보낸다.

---

## 사전 확인 — 백엔드 예약 생성 API

`POST /api/bookings` (인증 필요)

```
body: { roomId: string, checkIn: ISO datetime 문자열, checkOut: ISO datetime 문자열, guests: number }
응답: { success: true, data: { id, userId, roomId, checkIn, checkOut, guests, totalPrice, status, createdAt } }
```

- `checkIn`/`checkOut`은 `z.string().datetime()` — 단순 `"2026-07-01"` 같은 날짜만으론 안 되고 `new Date(...).toISOString()`으로 변환한 전체 ISO 문자열이어야 함
- 날짜 겹침(중복 예약), `checkOut <= checkIn`은 서버에서 막아주므로 프론트는 그 에러 메시지를 그대로 보여주면 됨
- `totalPrice`는 서버가 계산(클라이언트가 보낸 금액을 안 믿음) — 프론트는 화면에 보여줄 미리보기용으로만 자체 계산

---

## 작업 순서

### 1. `types/index.ts` — `Booking` 타입 추가

**정의**: `id`, `roomId`, `checkIn`, `checkOut`, `guests`, `totalPrice`, `status`(string), `createdAt`

### 2. `lib/api.ts` — `createBooking()` 추가

**정의**: `{ roomId, checkIn, checkOut, guests }`를 받아 `POST /api/bookings` 호출(인증 토큰 자동 첨부), 실패 시 서버 에러 메시지 그대로 throw

**확인할 것**: 비로그인 상태로 호출하면 401이 그대로 전달되는지

### 3. `app/accommodation/[id].tsx` — 객실별 "예약하기" 버튼 추가

**정의**: 기존 객실 목록(`Text`만 나열)을 터치 가능한 항목으로 바꾸고, 탭하면 `/booking/[roomId]`로 이동하며 객실명·가격·최대인원을 쿼리 파라미터로 같이 넘김(별도 객실 단건 조회 API가 없어서 상세 화면이 이미 가진 데이터를 그대로 전달)

### 4. `app/booking/[roomId].tsx` — 예약 생성 화면(신규)

**정의**: React Hook Form + Zod로 체크인/체크아웃 날짜(`YYYY-MM-DD` 문자열 입력), 인원수 입력 폼. 제출 시 날짜 문자열을 ISO로 변환 후 `createBooking()` 호출. 비로그인 상태면 진입 즉시 `/login`으로 보냄

**확인할 것**:
- 체크아웃이 체크인보다 빠르면 제출 전에 프론트에서도 한 번 막기(Zod `refine`)
- 예약 성공 시 결과 안내(현재는 내 예약 화면이 없으므로 성공 메시지 후 홈으로 이동, Phase 14에서 내 예약 화면 생기면 그쪽으로 연결 변경)

**성공 기준**: 실제 예약이 DB에 생성되고, 같은 객실·겹치는 날짜로 다시 예약 시도하면 서버가 409로 막는 것까지 확인

---

## 완료 기준

```bash
npx tsc --noEmit   # 오류 0개
```

상세 화면에서 객실 선택 → 날짜·인원 입력 → 제출 → 예약 생성 확인(에러 케이스: 중복 날짜 시 409 메시지 표시)까지 확인.
