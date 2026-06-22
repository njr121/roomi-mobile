# Phase 17 — 디자인 통일

> 구현 전 이 파일을 먼저 읽는다.
> 무엇을 만들지 정의만 한다. 실제 코드는 여기 없다.

---

## 전제

Phase 16까지 완료(PRD 핵심 기능 전부 구현). 이 문서는 Phase 9 때 만든 뼈대 그대로 거의 스타일이 없던 `AccommodationCard`/`PriceChangeBadge`/숙소 상세 화면에 실제 디자인을 입히고, 화면마다 흩어진 스타일 불일치를 통일하는 작업을 정의한다. 기능 변경 없음(스타일·구조 정리만).

---

## 발견된 문제

1. `AccommodationCard.tsx`, `PriceChangeBadge.tsx` — 거의 빈 className, 카드 컨테이너·타이포그래피·배지 패딩 없음
2. `app/accommodation/[id].tsx` — 가격 블록이 카드와 동일한 정보인데 별도 스타일 없이 텍스트만 나열
3. 가격(취소선 평소가 + 현재가) + 변동률 배지 레이아웃이 카드·상세·찜목록 3곳에서 동일하게 반복(JSX 중복)
4. `app/login.tsx`, `app/booking/[roomId].tsx` — `disabled:opacity-50`이 웹에서 `Pressable`(`<div>` 렌더링)에 안 먹히는 버그(다른 화면은 이미 수동 분기로 고쳐짐, 이 둘만 누락)
5. 입력창 모서리 불일치 — `SearchBar.tsx`/`booking/[roomId].tsx`의 `TextInput`은 `rounded`(4px), 버튼은 `rounded-lg`(8px)

---

## 작업 순서

### 1. `components/PriceBlock.tsx` — 신규(공유 컴포넌트)

**정의**: `{ normalPrice, currentPrice, priceChangeRate }` props. 취소선 평소가 + 현재가 + `PriceChangeBadge`를 Steam 스타일로 가로 배치(배지 먼저, 가격 나중 — 할인 강조). `AccommodationCard`/`accommodation/[id].tsx`/`wishlist.tsx` 3곳에서 공통 사용

### 2. `components/PriceChangeBadge.tsx` — 스타일 추가

**정의**: 기존 배경색 분기 로직(4단계)은 유지. `rounded-full px-2 py-0.5`, 텍스트는 `text-white text-xs font-semibold` 추가

### 3. `components/AccommodationCard.tsx` — 재작성

**정의**: 카드 컨테이너(`bg-white rounded-lg`, 이미지 비율, 하단 패딩), 숙소명(`font-bold`)·지역(`text-gray-500 text-sm`) + `PriceBlock` 사용

### 4. `app/accommodation/[id].tsx` — 스타일 정리

**정의**: 전체 패딩(`px-4 py-4`), 숙소명(`text-xl font-bold`), `PriceBlock` 사용, 객실 목록 행 스타일은 기존 유지(이미 적용돼 있음)

### 5. `app/(tabs)/wishlist.tsx` — `PriceBlock` 적용

**정의**: 기존 가격+배지 줄 3개를 `PriceBlock` 호출 하나로 교체

### 6. 버그 수정 — `disabled:` 패턴

**대상**: `app/login.tsx`(Google 로그인 버튼), `app/booking/[roomId].tsx`(예약하기 버튼)
**정의**: `my-bookings.tsx`의 `BookingRow` 취소 버튼과 동일한 방식 — `disabled:opacity-50` 제거, `className={조건 ? "..." : "..."}` 직접 분기로 교체

### 7. 토큰 통일 — 입력창 모서리

**대상**: `components/SearchBar.tsx`(지역/인원 `TextInput` 3곳), `app/booking/[roomId].tsx`(인원 `TextInput`)
**정의**: `rounded` → `rounded-lg`로 교체(버튼과 동일 반경)

---

## 완료 기준

```bash
npx tsc --noEmit   # 오류 0개
```

홈 화면 카드, 숙소 상세, 찜 목록 3곳에서 가격 블록이 동일한 스타일로 보이는지 확인. 로그인 버튼·예약하기 버튼이 비활성 상태일 때 실제로 흐려지는지(웹에서) 확인.

---

## 추가 — 마이 탭(로그아웃) 신규 (디자인 통일 작업 중 발견된 기능 누락)

PRD 6.5 마이페이지(US-16, US-17, 로그아웃 포함)가 실제 구현에서는 "내 예약"/"찜 목록" 탭으로 분리되면서 **로그아웃 버튼이 통째로 빠져 있었음**(`authStore.ts`의 `logout()`은 Phase 12부터 존재했으나 호출하는 UI가 없었음). 사용자가 제시한 야놀자 참고 화면(하단 탭 바: 지역/내주변/홈/찜/마이 — 찜과 마이가 별도 탭)을 기준으로, "마이" 탭을 4번째로 신규 추가해서 로그인 상태 표시 + 로그아웃 버튼을 배치하기로 결정.

### 작업 순서

1. `components/ui/icon-symbol.tsx` — `person.fill` → MaterialIcons `person` 매핑 추가
2. `app/(tabs)/mypage.tsx` — 신규. 비로그인 시 다른 탭과 동일한 "로그인이 필요합니다" 패턴, 로그인 시 이름·이메일 표시 + 로그아웃 버튼(확인 `Alert` 후 `logout()` 호출 → `/login`으로 이동)
3. `app/(tabs)/_layout.tsx` — "마이" 탭 추가(아이콘 `person.fill`)

### 완료 기준

```bash
npx tsc --noEmit   # 오류 0개
```

마이 탭에서 로그아웃 → 로그인 화면으로 이동 → 다시 로그인 가능한지 확인.
