# Phase 10 — 실제 API 연동

> 구현 전 이 파일을 먼저 읽는다.
> 무엇을 만들지 정의만 한다. 실제 코드는 여기 없다.

---

## 전제

Phase 9에서 mock 데이터로 화면에 카드가 보이는 것까지 완료. 이 문서는 mock 데이터를 `roomi-api`(백엔드, `feat/api` 브랜치)가 실제로 응답하는 데이터로 교체하는 단계.

**선행 조건**: `roomi-api` 서버가 실행 중이어야 한다. 현재 작업 브랜치(`feat/app`)에는 `roomi-api` 소스가 없으므로(다른 브랜치 소관), 별도 위치에 저장소를 한 번 더 체크아웃해서 `feat/api` 브랜치로 서버를 띄워야 한다.

---

## 작업 순서

1. `roomi-api` 서버 실행 준비 (별도 폴더에 체크아웃)
2. `lib/env.ts` — API 주소 환경변수 검증
3. `lib/api.ts` — fetch 래퍼 함수
4. TanStack Query Provider 설정
5. `useAccommodations` 커스텀 훅
6. `app/(tabs)/index.tsx` — mock 데이터를 실제 데이터로 교체

---

## 1. roomi-api 서버 실행 준비

**목적**: 프론트가 호출할 실제 백엔드 서버를 띄움

**위치**: 현재 프로젝트 폴더가 아닌 **별도 폴더**에 저장소를 한 번 더 클론(또는 체크아웃)하여 `feat/api` 브랜치로 전환

**정의**: 그 별도 폴더에서 `roomi-api/.env`에 실제 값이 들어있는지 확인 후 `npm run dev` 실행 (기본 포트 3000)

**확인할 것**: `localhost:3000/api/accommodations`에 브라우저로 접속했을 때 JSON 응답이 오는지

**성공 기준**: 서버가 떠 있고, 위 주소로 데이터가 응답됨

---

## 2. lib/env.ts — API 주소 환경변수 검증

**목적**: 프론트가 백엔드 주소를 어디서 가져올지 명확히 하고, `process.env` 직접 접근을 금지하는 프로젝트 규칙을 지킴

**위치**: `roomi-app/lib/env.ts` (신규 생성)

**정의**: `EXPO_PUBLIC_API_URL` 환경변수를 Zod로 검증해서 export (Expo는 클라이언트에 노출할 환경변수에 `EXPO_PUBLIC_` 접두사가 필요 — 일반 `process.env.API_URL`은 앱 번들에 포함되지 않음)

**확인할 것**: `.env` 파일에 `EXPO_PUBLIC_API_URL=http://localhost:3000` 추가 필요

**성공 기준**: 컴파일 오류 없이 `env.API_URL` 형태로 다른 파일에서 가져다 쓸 수 있음

---

## 3. lib/api.ts — fetch 래퍼 함수

**목적**: 매번 `fetch(...)` + 에러 처리를 반복하지 않도록 공통 함수로 모음

**위치**: `roomi-app/lib/api.ts` (신규 생성)

**정의**: `getAccommodations()` 같은 함수가 `env.API_URL`을 기준으로 `fetch`를 실행하고, 백엔드 응답 포맷(`{ success, data }` 또는 `{ success, error }`)에 맞춰 데이터만 꺼내서 반환

**확인할 것**: 백엔드의 공통 응답 포맷(`roomi-api/lib/api-response.ts` 기준)과 맞는지 — 이미 백엔드 작업 시 정의해둔 포맷을 그대로 신뢰

**성공 기준**: 함수 반환 타입이 `Accommodation[]`로 명확히 지정됨

---

## 4. TanStack Query Provider 설정

**목적**: 앱 전체에서 TanStack Query를 쓸 수 있게 최상단에 Provider를 연결

**위치**: `roomi-app/app/_layout.tsx` (기존 파일 수정)

**정의**: `QueryClient` 인스턴스를 만들고, 기존 `<ThemeProvider>` 등을 `<QueryClientProvider client={queryClient}>`로 감싸기

**확인할 것**: 기존 Provider 구조(ThemeProvider, Stack)를 지우지 않고 바깥에 한 겹 추가하는 것인지

**성공 기준**: 앱이 에러 없이 그대로 구동됨 (이 단계 자체는 화면 변화 없음)

---

## 5. useAccommodations 커스텀 훅

**목적**: "숙소 목록을 가져온다"는 로직을 컴포넌트에서 분리해서 재사용 가능하게 만듦

**위치**: `roomi-app/hooks/useAccommodations.ts` (신규 생성, 기존 `hooks/` 폴더 안)

**정의**: `useQuery`로 `lib/api.ts`의 `getAccommodations`를 호출, `queryKey`와 `queryFn` 지정

**확인할 것**: `queryKey`가 다른 쿼리와 안 겹치는 고유한 값인지 (`["accommodations"]` 같은 배열)

**성공 기준**: 훅이 `{ data, isLoading, isError }` 형태를 반환

---

## 6. app/(tabs)/index.tsx — mock 데이터 교체

**목적**: Phase 9에서 만든 mock 배열을 실제 `useAccommodations` 훅 결과로 교체

**위치**: `roomi-app/app/(tabs)/index.tsx` (기존 파일 수정)

**정의**: mock 배열과 관련 코드 삭제, `useAccommodations()` 호출 결과를 `FlatList`의 `data`에 연결. `isLoading`일 때 로딩 표시, `isError`일 때 에러 메시지 표시 추가

**확인할 것**: 로딩 중 화면이 깜빡이거나 비어있지 않고 "불러오는 중" 같은 안내가 보이는지

**성공 기준**: 실제 백엔드 데이터(시드 데이터 48개)가 화면에 나타남

---

## 완료 기준

```bash
npx tsc --noEmit   # 오류 0개
npx expo start     # 정상 구동
```

mock 데이터 대신 실제 백엔드 데이터(숙소 48개)가 화면에 표시되는지 확인. 로딩 상태와 에러 상태(서버를 잠깐 꺼봐서 테스트)도 한 번씩 확인.

에러 없으면 커밋 → push.
