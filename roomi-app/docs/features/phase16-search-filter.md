# Phase 16 — 검색·필터·정렬·페이지네이션

> 구현 전 이 파일을 먼저 읽는다.
> 무엇을 만들지 정의만 한다. 실제 코드는 여기 없다.

---

## 전제

Phase 15까지 완료(핵심 플로우 전체 동작). 이 문서는 홈 화면에 검색(지역·날짜·인원)·필터(숙박 종류)·정렬(변동률/가격)·페이지네이션을 추가하는 작업을 정의한다. 인증 불필요(비로그인도 검색 가능, PRD US-02).

---

## 사전 확인 — 백엔드 API (Phase 7에서 이미 완료)

```
GET /api/accommodations?page&limit&type&sort&region&checkIn&checkOut&guests
  → 전부 선택 파라미터, 안 보내면 기존 동작(전체 목록, 1페이지)
  → type: hotel | motel | pension | resort
  → sort: priceChangeRate(기본값) | currentPrice 등 Accommodation 필드명
  → region: location 부분 일치
  → checkIn/checkOut: 같이 보내야 함, checkIn < checkOut 필수, 가용성 필터(겹치는 예약 있는 객실 제외)
  → guests: 해당 인원 수용 가능한 객실이 있는 숙소만
  → 응답: { success: true, data: { data: Accommodation[], pagination: { page, limit, total, totalPages } } }
```

---

## 작업 순서

### 1. `types/index.ts` — 타입 2개 추가

**`AccommodationFilters`**: `{ page?, type?, sort?, region?, checkIn?, checkOut?, guests? }` — 전부 optional

**`PaginatedAccommodations`**: `{ data: Accommodation[], pagination: { page: number, limit: number, total: number, totalPages: number } }`

### 2. `lib/api.ts` — `getAccommodations` 수정

**변경 전**: 파라미터 없음, `Accommodation[]` 반환(`json.data.data`만 꺼내고 `pagination`은 버림)

**변경 후**: `getAccommodations(filters: AccommodationFilters)`로 변경. `URLSearchParams`로 쿼리스트링 빌드(값이 있는 것만 추가), `PaginatedAccommodations` 전체(`json.data`)를 반환

**주의**: `URLSearchParams`는 한글을 자동으로 인코딩해주므로 별도 인코딩 처리 불필요(Phase 7 검증 때 겪은 `curl` 인코딩 문제와 동일한 원리 — `fetch`/`URLSearchParams`는 자동으로 해줌)

### 3. `hooks/useAccommodations.ts` — `filters` 인자 추가

**정의**: `useAccommodations(filters: AccommodationFilters)` → `useQuery({ queryKey: ["accommodations", filters], queryFn: () => getAccommodations(filters) })`

**확인할 것**: `queryKey`에 `filters` 객체를 그대로 넣으면, 필터가 바뀔 때마다 TanStack Query가 자동으로 새 쿼리로 인식해서 재요청함(캐싱 키가 달라지므로)

### 4. `components/SearchBar.tsx` — 신규

**정의**: 지역 텍스트 입력 + 체크인/체크아웃 날짜 선택(버튼 탭하면 모달로 `Calendar` 띄움 — `app/booking/[roomId].tsx`의 캘린더 패턴 재사용) + 인원수 입력 + "검색" 버튼. 검색 버튼을 누르면 부모(`index.tsx`)에 입력값을 전달(콜백 props)

**확인할 것**: 날짜를 하나만 선택하고 검색 누르면 백엔드가 `VALIDATION_ERROR`를 줌 — 프론트에서도 "체크인/체크아웃 둘 다 선택해주세요" 같은 안내가 필요한지는 구현 중 판단

### 5. `components/FilterSheet.tsx` — 신규

**정의**: 하단 시트(Modal)로 숙박 종류 4개(`hotel`/`motel`/`pension`/`resort` — `Accommodation.type` 실제 유니온 기준, PRD의 "게스트하우스" 대신 `resort`로 이미 구현돼 있음, 기존 불일치) 중 선택. 선택 시 부모에 `type` 값 전달, "전체"(선택 해제) 옵션도 포함

### 6. `components/SortSelector.tsx` — 신규

**정의**: "변동률 낮은순"(기본, `sort=priceChangeRate`) / "가격 낮은순"(`sort=currentPrice`) 토글. 둘 중 하나만 선택 가능

### 7. `components/Pagination.tsx` — 신규

**정의**: `{ page, totalPages, onPrev, onNext }` props. 이전/다음 버튼, 현재 페이지 텍스트 표시(`{page} / {totalPages}`). `page <= 1`이면 이전 비활성, `page >= totalPages`면 다음 비활성

### 8. `app/(tabs)/index.tsx` — 조합

**정의**: `filters` 상태(`useState<AccommodationFilters>`)를 보유. `SearchBar`/`FilterSheet`/`SortSelector`가 각각 `filters`의 일부를 갱신(필터가 바뀌면 `page`는 1로 리셋). `useAccommodations(filters)`로 목록 조회. `FlatList` 아래 `Pagination` 배치, `pagination.totalPages`는 응답에서 받아옴

---

## 완료 기준

```bash
npx tsc --noEmit   # 오류 0개
```

지역 검색 → 결과 필터링 확인, 날짜 검색 → 가용성 필터 확인, 숙박 종류 필터 → 결과 변경 확인, 정렬 토글 → 순서 변경 확인, 페이지네이션 → 다음/이전 페이지 이동 확인, 필터 변경 시 1페이지로 리셋되는지 확인.
