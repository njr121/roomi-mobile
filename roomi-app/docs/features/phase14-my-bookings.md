# Phase 14 — 내 예약(목록·취소)

> 구현 전 이 파일을 먼저 읽는다.
> 무엇을 만들지 정의만 한다. 실제 코드는 여기 없다.

---

## 전제

Phase 13에서 예약 생성까지 완료. 이 문서는 본인이 만든 예약을 목록으로 확인하고 취소하는 화면을 정의한다. 인증이 필요한 화면.

기존 `(tabs)/explore.tsx`(Expo 기본 생성, 미사용 placeholder)를 "내 예약" 탭으로 교체한다.

---

## 사전 확인 — 백엔드 API

```
GET /api/bookings (인증 필요)
응답: { success: true, data: [ { id, roomId, checkIn, checkOut, guests, totalPrice, status, createdAt, room: { ...room필드, accommodation: {...accommodation필드} } } ] }
→ 한 겹 배열(목록 API처럼 { data: { data, pagination } } 아님), 최신순(createdAt desc) 정렬

PATCH /api/bookings/:id/cancel (인증 필요)
응답: { success: true, data: { ...취소된 booking } }
→ 이미 취소된 예약 재취소 시 400
```

---

## 작업 순서

### 1. `types/index.ts` — `BookingWithDetails` 타입 추가

**정의**: `Booking & { room: Room & { accommodation: Accommodation } }` — 목록 화면에 숙소명·객실명을 같이 보여줘야 해서 중첩 구조 반영

### 2. `lib/api.ts` — `getBookings()`, `cancelBooking(id)` 추가

**정의**: `getBookings()`는 `GET /api/bookings` 호출, 응답이 배열 그대로이므로 `json.data` 바로 반환. `cancelBooking(id)`는 `PATCH /api/bookings/:id/cancel` 호출

### 3. `hooks/useMyBookings.ts` — 훅 추가(신규)

**정의**: `useQuery({ queryKey: ["bookings"], queryFn: getBookings })`

### 4. `app/(tabs)/my-bookings.tsx` — 신규 (기존 `explore.tsx` 대체)

**정의**:
- 비로그인 상태면 "로그인이 필요합니다" 안내 + 로그인 화면 이동 버튼 표시(자동 리다이렉트 아님 — 탭이라 화면이 계속 떠있어야 함)
- 로그인 상태면 `useMyBookings()`로 목록 표시: 숙소명, 객실명, 체크인~체크아웃, 총 금액, 상태
- 각 항목에 취소 버튼 — `useMutation`으로 `cancelBooking` 호출, 성공 시 `["bookings"]` 쿼리 무효화(`invalidateQueries`)해서 목록 자동 갱신
- 이미 취소된 예약(`status === "CANCELLED"`)은 취소 버튼 비활성화

### 5. `app/(tabs)/_layout.tsx` — 탭 등록 변경

**정의**: `Tabs.Screen name="explore"` → `name="my-bookings"`, 제목 "내 예약", 아이콘 변경

### 6. `app/booking/[roomId].tsx` — 예약 성공 후 이동 경로 변경

**정의**: 기존 `router.replace("/")`(홈)을 `router.replace("/my-bookings")`로 변경 — Phase 13 문서에 적어둔 대로

---

## 완료 기준

```bash
npx tsc --noEmit   # 오류 0개
```

예약 생성 → 내 예약 탭에서 목록에 보임 → 취소 버튼 클릭 → 상태가 취소로 바뀌고 버튼 비활성화 → 같은 예약 재취소 시도 시 에러 메시지 표시까지 확인.
