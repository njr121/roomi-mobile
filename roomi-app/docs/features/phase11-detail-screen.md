# Phase 11 — 숙소 상세 화면

> 구현 전 이 파일을 먼저 읽는다.
> 무엇을 만들지 정의만 한다. 실제 코드는 여기 없다.

---

## 전제

Phase 10에서 홈 화면이 실제 백엔드 데이터로 동작하는 것까지 완료. 이 문서는 홈 화면의 카드를 탭하면 보여줄 숙소 상세 화면을 정의한다. 인증이 필요 없는 화면(로그인 여부와 무관하게 누구나 조회 가능).

---

## 사전 확인 — 백엔드 상세 API 구조 (목록 API와 다른 점)

`GET /api/accommodations/:id` 응답은 목록 API와 감싸는 구조가 다르다.

```
목록 API:  { success: true, data: { data: [...], pagination: {...} } }   ← 두 겹
상세 API:  { success: true, data: { ...accommodation, rooms: [...] } }    ← 한 겹
```

상세 응답에는 `rooms`(객실 배열)가 포함되고, 목록 응답에는 없다. `lib/api.ts`에 함수를 추가할 때 이 차이를 반영해야 한다 (목록처럼 `json.data.data`로 꺼내면 안 되고, 상세는 `json.data`가 바로 숙소 객체).

## 사전 확인 — 발견된 기존 버그

`components/AccommodationCard.tsx`가 `accommodation.thumbnail`을 쓰는데, 백엔드 Accommodation 모델에는 `thumbnail` 필드가 없다(`images: string[]` 필드만 있음, 시드 데이터 기준 항상 빈 배열). Phase 9에서 mock 데이터에만 있던 필드를 그대로 쓰다가, Phase 10에서 실제 데이터로 바뀌면서 조용히 깨진 상태(에러는 안 나고 이미지가 안 보일 뿐). 이번 Phase에서 타입을 바로잡으면서 같이 고친다.

---

## 작업 순서

### 1. `types/index.ts` — 타입 보강

**목적**: 백엔드 Accommodation 모델 전체 필드(`location`, `description`, `rating`, `images`)를 반영하고, 상세 화면에서만 필요한 `rooms`는 별도 타입으로 분리

**위치**: `roomi-app/types/index.ts` (기존 파일 수정)

**정의**:
- `Accommodation` 타입에서 `thumbnail` 제거, `location`(string), `description`(string), `rating`(number), `images`(string[]) 추가
- `Room` 타입 신규 추가: `id`, `name`, `type`, `price`, `maxGuests`
- `AccommodationDetail` 타입 신규 추가: `Accommodation & { rooms: Room[] }`

**확인할 것**: `Accommodation` 타입이 바뀌면 `AccommodationCard.tsx`가 타입 에러를 낼 것 — 다음 단계에서 같이 수정

**성공 기준**: 컴파일 오류 없이 타입 export (단, 2단계 완료 전까지는 `AccommodationCard.tsx`에서 임시로 에러 발생 가능, 정상)

---

### 2. `components/AccommodationCard.tsx` — 필드 수정 (버그 수정)

**목적**: 존재하지 않는 `thumbnail` 대신 실제 필드 사용

**위치**: `roomi-app/components/AccommodationCard.tsx` (기존 파일 수정)

**정의**: `accommodation.thumbnail` → `accommodation.images[0]` 으로 변경. 다만 시드 데이터의 `images`가 항상 빈 배열이라 실제로는 안 보일 수 있음 — 빈 배열일 때는 이미지 자체를 렌더링하지 않거나 플레이스홀더 처리 (구체적 방식은 작성 시 결정)

**확인할 것**: `images` 배열이 빈 경우(`images.length === 0`) 에러 없이 처리되는지

**성공 기준**: `tsc --noEmit` 오류 0개, 기존 홈 화면이 그대로 정상 표시됨

---

### 3. `lib/api.ts` — `getAccommodationDetail(id)` 함수 추가

**목적**: 상세 화면이 호출할 API 함수 추가 (기존 `getAccommodations` 옆에 추가)

**위치**: `roomi-app/lib/api.ts` (기존 파일 수정)

**정의**: `id`를 매개변수로 받아 `GET /api/accommodations/:id` 호출, 응답이 한 겹 구조이므로 `json.data`를 바로 반환 (목록 함수와 다른 점 — 사전 확인 섹션 참고)

**확인할 것**: 반환 타입이 `Promise<AccommodationDetail>`로 명확히 지정되는지

**성공 기준**: 함수 단독으로 타입 에러 없음

---

### 4. `hooks/useAccommodationDetail.ts` — 훅 추가

**목적**: 상세 화면에서 쓸 데이터 훅

**위치**: `roomi-app/hooks/useAccommodationDetail.ts` (신규 생성)

**정의**: `id`를 매개변수로 받는 함수. `useQuery`의 `queryKey`는 `["accommodation", id]`(목록의 `["accommodations"]`와 겹치지 않게, `id`별로 캐시 분리), `queryFn`은 3단계에서 만든 함수에 `id`를 넘겨 호출

**확인할 것**: `id`가 바뀌면(다른 숙소를 보면) `queryKey`도 바뀌어서 새로 요청하는지

**성공 기준**: `{ data, isLoading, isError }` 반환

---

### 5. `app/accommodation/[id].tsx` — 상세 화면 라우트 (신규)

**목적**: Expo Router 동적 라우트로 상세 화면 작성

**위치**: `roomi-app/app/accommodation/[id].tsx` (신규 생성, `app/` 바로 아래 새 폴더 — 탭이 아닌 별도 스택 화면이라 `(tabs)` 밖에 위치)

**정의**: URL 파라미터로 받은 `id`로 4단계 훅 호출. 로딩/에러 분기는 홈 화면과 동일한 패턴. 정상이면 아래 항목 표시:
- 이름, 위치(`location`)
- 평소가(취소선) + 현재가 + `PriceChangeBadge`(기존 컴포넌트 재사용)
- 설명(`description`)
- 평점(`rating`)
- 객실 목록(`rooms`) — 객실명, 타입, 가격, 최대 인원을 항목별로 나열 (선택·예약 기능은 다음 Phase)

**확인할 것**: URL 파라미터 `id`를 Expo Router에서 어떻게 꺼내는지(`useLocalSearchParams`)

**성공 기준**: 홈 화면에서 받은 `id`로 정확한 숙소 1건의 상세 정보가 표시됨

---

### 6. `app/(tabs)/index.tsx` — 카드 탭 시 이동 연결

**목적**: 홈 화면 카드를 탭하면 5단계에서 만든 상세 화면으로 이동

**위치**: `roomi-app/app/(tabs)/index.tsx` (기존 파일 수정)

**정의**: `FlatList`의 `renderItem`에서 `AccommodationCard`를 감싸는 터치 가능한 래퍼(`Link` 또는 `Pressable` + `router.push`) 추가, 경로는 `/accommodation/[id]`

**확인할 것**: 탭 영역이 최소 44px 이상인지(프로젝트 터치 규칙)

**성공 기준**: 카드 탭 시 정확한 숙소의 상세 화면으로 이동

---

## 완료 기준

```bash
npx tsc --noEmit   # 오류 0개
npx expo start     # 정상 구동
```

홈 화면에서 카드 탭 → 상세 화면 진입 → 올바른 숙소 정보(객실 목록 포함) 표시 → 뒤로가기로 홈 복귀까지 확인. 에러 없으면 커밋.
