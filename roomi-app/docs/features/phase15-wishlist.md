# Phase 15 — 찜하기

> 구현 전 이 파일을 먼저 읽는다.
> 무엇을 만들지 정의만 한다. 실제 코드는 여기 없다.

---

## 전제

Phase 14까지 완료. 이 문서는 숙소를 찜 목록에 추가/제거하고, 찜한 목록을 모아보는 화면을 정의한다. 인증이 필요한 기능.

---

## 사전 확인 — 백엔드 API

```
POST /api/wishlists { accommodationId } (인증 필요)
  → 성공: { success: true, data: { id, userId, accommodationId, createdAt } }
  → 이미 찜한 경우: 409 (WISHLIST_ALREADY_EXISTS)

GET /api/wishlists (인증 필요)
  → { success: true, data: [ { id, accommodationId, createdAt, accommodation: {...전체 필드} } ] } — 한 겹 배열, 최신순

DELETE /api/wishlists/:accommodationId (인증 필요)
  → accommodationId 기준으로 삭제(wishlist의 id가 아님 — URL 파라미터 이름 주의)
  → 없으면 404
```

---

## 작업 순서

### 1. `types/index.ts` — `Wishlist` 타입 추가

**정의**: `{ id, accommodationId, createdAt, accommodation: Accommodation }`

### 2. `lib/api.ts` — `getWishlists()`, `addWishlist(accommodationId)`, `removeWishlist(accommodationId)` 추가

### 3. `hooks/useWishlists.ts` — 훅 추가(신규)

**정의**: `useQuery({ queryKey: ["wishlists"], queryFn: getWishlists })`

### 4. `components/WishlistButton.tsx` — 하트 토글 버튼(신규)

**정의**: `accommodationId`를 props로 받음. `useWishlists()` 데이터에서 그 숙소가 찜 목록에 있는지 확인(`some`)해서 하트를 채움/비움으로 표시. 탭하면 상태에 따라 `addWishlist` 또는 `removeWishlist`를 `useMutation`으로 호출, 성공 시 `["wishlists"]` 무효화

**확인할 것**: 비로그인 상태에서 탭하면 401 에러가 나는데, 로그인 화면으로 안내하는 처리 필요

### 5. `components/AccommodationCard.tsx` — `WishlistButton` 추가

**정의**: 카드 우상단에 오버레이로 배치

### 6. `app/accommodation/[id].tsx` — `WishlistButton` 추가

**정의**: 숙소명 옆에 배치

### 7. `app/(tabs)/wishlist.tsx` — 찜 목록 화면(신규, 탭 추가)

**정의**: `useWishlists()` 목록을 `FlatList`로 표시(숙소명, 가격, 변동률, 탭하면 상세로 이동). 비로그인 상태면 안내 문구(내 예약 화면과 동일 패턴)

### 8. `app/(tabs)/_layout.tsx` — 탭 추가

**정의**: 기존 Home, 내 예약 옆에 "찜 목록" 탭 추가

---

## 완료 기준

```bash
npx tsc --noEmit   # 오류 0개
```

홈/상세 화면에서 하트 클릭 → 찜 목록 탭에 반영 → 다시 클릭해서 제거 → 목록에서 사라짐까지 확인.
