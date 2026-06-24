# Phase 18 — 홈 화면 레이아웃 재구성 (야놀자 참고)

> 완료된 Phase. 참고용 기록.
> 분류 정정(2026-06-23): 레이아웃(UI) 작업과 무한스크롤 전환(실제 로직)이 한 문서에 섞여있음 — 과거 기록이라 재분리 안 하고 표시만 남김.

---

## 전제

Phase 17까지 완료. 사용자가 제시한 야놀자 앱 참고 화면을 기준으로, 홈 화면 레이아웃을 GNB(로고+검색)·카테고리 아이콘·추천 캐로셀·정렬·목록 구조로 재구성한다. 배너/장바구니는 실제 컨텐츠가 없어 제외. 검색·필터·정렬 자체의 동작(Phase 16에서 만든 로직)은 변경 없음 — 배치 방식만 바꾼다.

---

## 레이아웃 구조

```
[Roomi 로고]  [검색창 모양 버튼 — 탭하면 검색 모달]   ← GNB
[전체] [호텔] [모텔] [펜션] [리조트]                    ← 카테고리 아이콘 행(가로)
[변동률 낮은순] [가격 낮은순]                           ← 정렬(기존 SortSelector 유지)
─────────────────────────────
베스트 딜 (가로 스크롤 캐로셀, 현재 목록 상위 5개)
─────────────────────────────
전체 목록 (세로 리스트, 기존과 동일) + 페이지네이션
```

---

## 작업 순서

### 1. `components/AccommodationCard.tsx` — `variant` prop 추가

**정의**: `variant?: "list" | "carousel"` (기본 `"list"`). `"list"`는 기존 스타일(`mx-4 mb-4`, 폭 전체), `"carousel"`은 고정 폭(`w-60 mr-3`)으로 가로 스크롤에 맞게 좁힌다. 내부 가격·배지 표시는 동일

### 2. `components/AccommodationCarousel.tsx` — 신규

**정의**: `{ data: Accommodation[] }` props. "베스트 딜" 제목 + 가로 `FlatList`(`horizontal`), 각 항목은 `AccommodationCard variant="carousel"`. 탭하면 상세로 이동(기존과 동일하게 `Link`로 감싸기), 하트 버튼도 동일하게 배치

### 3. `components/CategoryIcons.tsx` — 신규(`FilterSheet.tsx` 대체)

**정의**: 전체/호텔/모텔/펜션/리조트 5개를 가로 `Pressable` 행으로 배치(이모지 아이콘 + 라벨). 탭하면 즉시 `onSelect(type)` 호출 — 모달 없이 바로 필터 적용. 선택된 항목은 테두리/배경으로 표시(기존 `FilterSheet`의 선택 표시 방식 재사용)

**삭제**: `components/FilterSheet.tsx` — 이 컴포넌트로 대체되어 더 이상 안 씀

### 4. `components/SearchBar.tsx` — 변경 없음(재사용 방식만 변경)

**정의**: 컴포넌트 자체는 그대로 두고, `app/(tabs)/index.tsx`에서 항상 화면에 펼쳐두는 대신 **모달 안에 넣어서** GNB의 검색 버튼을 탭했을 때만 표시

### 5. `app/(tabs)/index.tsx` — 재구성

**정의**:
- GNB: `Text`("Roomi", 로고 스타일) + 검색 버튼(`Pressable`, placeholder "어디로 가시나요?") → 탭하면 `isSearchOpen` 상태로 `Modal` 열고 안에 `SearchBar` 렌더링, `onSearch` 완료 시 모달 닫기
- 카테고리 아이콘 행: `CategoryIcons` (기존 `FilterSheet` 트리거 버튼 제거)
- 정렬: `SortSelector` 그대로 유지
- 캐로셀: `data.data`의 앞 5개(`.slice(0, 5)`)를 `AccommodationCarousel`에 전달 — 별도 API 호출 없음(현재 목록이 기본적으로 변동률 낮은순 정렬이라 자연스럽게 "베스트 딜"이 됨)
- 본문 목록: 기존 `FlatList` 그대로 유지(캐로셀과 중복 표시되어도 무방 — 실제 앱들도 흔한 패턴)

---

## 완료 기준

```bash
npx tsc --noEmit   # 오류 0개
```

---

## 추가 — 1차 구현 후 사용자 피드백 반영

1차 구현 직후 화면을 보고 받은 추가 요청 4건:

1. **"전체" 카테고리 아이콘 교체** — `☰`(메뉴처럼 보여서 오해 소지) → `🛏️`(전체 숙박 유형을 상징), 아이콘 크기도 `text-xl`→`text-3xl`, 원 배경 `h-12 w-12`→`h-16 w-16`로 확대
2. **검색 모달 닫기 버튼** — 텍스트 "닫기" → `✕` 아이콘
3. **화면 배경이 회색으로 보이는 문제** — `@react-navigation`의 `DefaultTheme.colors.background`가 옅은 회색이라 탭 화면 전체에 깔려 있었음. `app/(tabs)/_layout.tsx`의 `screenOptions.sceneStyle`에 `backgroundColor: '#ffffff'` 추가로 탭 화면 전체 일괄 적용, `app/accommodation/[id].tsx`(탭 밖 Stack 화면)는 개별로 `bg-white` 추가
4. **페이지네이션 → 무한 스크롤** — "이전/다음" 버튼 방식(`Pagination.tsx`)을 모바일 표준 패턴인 스크롤 기반 무한 로딩으로 교체. `useAccommodations` 훅을 `useQuery`에서 `useInfiniteQuery`로 전환(`getNextPageParam`으로 다음 페이지 자동 계산), `index.tsx`는 `FlatList`의 `onEndReached`로 끝에 도달하면 `fetchNextPage()` 호출. `Pagination.tsx`는 더 이상 안 써서 삭제

### 영향받는 파일 (추가)

- `components/CategoryIcons.tsx`, `app/(tabs)/index.tsx`, `app/(tabs)/_layout.tsx`, `app/accommodation/[id].tsx`, `hooks/useAccommodations.ts`
- 삭제: `components/Pagination.tsx`(무한 스크롤로 대체), `components/FilterSheet.tsx`(앞서 `CategoryIcons`로 대체)

### 추가 — 검색 모달 X 버튼 풀폭 포커스 박스 버그, 지역 입력 → 선택 방식 전환

- X 버튼이 부모 `View`(flex column, 기본 `alignItems: stretch`)에 의해 화면 전체 폭으로 늘어나서, 클릭 포커스 시 파란 테두리가 화면 너비만큼 길게 보이는 버그 발견 → `self-start` 추가로 본인 크기만큼만 차지하게 수정
- 지역 입력을 자유 텍스트(`TextInput`)에서 **목록 선택 방식**으로 변경(사용자 요청, "직접 입력은 별로") — `REGIONS`(서울/부산/인천/강원/경주/제주) 하단 시트 목록, `FilterSheet`였던 패턴과 동일한 모달 구조 재사용. 시드 데이터는 현재 서울만 있어서 다른 지역 선택 시 결과 0건은 정상(Phase 7에서 이미 검증됨)

### 완료 — 전체 주요 버튼 그라데이션 적용

- `expo-linear-gradient` 설치(사용자 직접) 확인 후 `components/GradientButton.tsx` 신규(공유 컴포넌트) — `Pressable`로 감싸고 내부에 `LinearGradient`(`style` prop으로 직접 지정, NativeWind className 미사용 — 서드파티 컴포넌트라 className interop 미보장이라 안전하게 우회)
- 색상은 "흰색 섞기" 요청을 문자 그대로(`#3b82f6` → `#ffffff`) 적용하면 그라데이션 끝부분에서 흰 텍스트가 흰 배경에 묻혀 안 보이는 문제가 있어, 대신 `#2563eb`(blue-600) → `#60a5fa`(blue-400)로 조정 — "더 밝아지는" 느낌은 유지하면서 텍스트 대비 확보. 이 조정 이유를 사용자에게 설명함
- 적용 대상(`bg-blue-500` 단색 → `GradientButton`): `login.tsx`(Google 로그인), `mypage.tsx`/`wishlist.tsx`/`my-bookings.tsx`(로그인하기), `booking/[roomId].tsx`(예약하기), `SearchBar.tsx`(검색, 캘린더 확인) — 총 6곳. `PriceChangeBadge.tsx`의 `bg-blue-500`(할인 배지 색상)은 버튼이 아니라 의미 색상이라 제외

GNB 검색 버튼 탭 → 검색 모달 열림 → 검색 후 모달 닫히고 결과 반영 확인. 카테고리 아이콘 탭 → 즉시 필터링 확인(모달 없이). 캐로셀 가로 스크롤 확인, 캐로셀 항목 탭 시 상세 이동 확인.
