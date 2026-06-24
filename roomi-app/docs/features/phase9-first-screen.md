# Phase 9 — 첫 화면 (AccommodationCard)

> 완료된 Phase. 참고용 기록.

> 구현 전 이 파일을 먼저 읽는다.
> 무엇을 만들지 정의만 한다. 실제 코드는 여기 없다.

---

## 전제

Phase 7~8에서 Expo 세팅과 NativeWind 연결까지 완료. 이 문서는 실제 화면 컴포넌트를 처음 만드는 단계.

**범위를 좁게 잡는다**: 이번 Phase는 실제 API 연동이 아니라, **목업(mock) 데이터로 화면에 카드가 보이게 하는 것**까지만 다룬다. TanStack Query로 실제 백엔드 데이터를 가져오는 작업은 다음 Phase(데이터 연동)에서 별도로 진행한다. UI 구조와 데이터 연동을 분리해서, 문제가 생겼을 때 원인을 컴포넌트 쪽인지 데이터 쪽인지 빠르게 구분하기 위함.

---

## 작업 순서

1. `types/index.ts` — Accommodation 타입 정의
2. `components/PriceChangeBadge.tsx` — 가격 변동률 뱃지 (작은 컴포넌트 먼저)
3. `components/AccommodationCard.tsx` — 숙소 카드 (PriceChangeBadge 사용)
4. mock 데이터 배열 작성
5. `app/(tabs)/index.tsx`에서 mock 데이터로 카드 목록 렌더링

---

## 1. types/index.ts — Accommodation 타입

**목적**: 숙소 데이터가 어떤 모양인지 TypeScript에게 알려줌 (백엔드 `roomi-api`의 Accommodation 모델과 필드명 일치)

**위치**: `roomi-app/types/index.ts` (신규 생성)

**정의 (포함될 필드)**: `id`, `name`, `type`, `thumbnail`, `normalPrice`(평소가), `currentPrice`(현재가), `priceChangeRate`(변동률, 음수면 할인)

**확인할 것**: 필드명이 백엔드 Accommodation 모델과 동일한지 (나중에 실제 연동 시 변환 코드가 필요 없도록)

**성공 기준**: 컴파일 오류 없이 타입 export

---

## 2. components/PriceChangeBadge.tsx

**목적**: 변동률 숫자를 받아서 색깔이 다른 뱃지로 보여주는 작은 컴포넌트

**위치**: `roomi-app/components/PriceChangeBadge.tsx` (신규 생성)

**정의**: `priceChangeRate`(숫자) prop을 받아서, 규칙(CLAUDE.local.md 기준 — 음수(할인) 파란색, 0%~29% 초록, +30%~99% 주황, +100% 이상 빨강)에 따라 배경색이 다른 작은 텍스트 뱃지를 렌더링 (2026-06-18: 할인 구간 추가)

**확인할 것**: 색상 분기 조건 4단계(파랑/초록/주황/빨강)가 명확히 나뉘는지

**성공 기준**: 다른 숫자를 넣었을 때 색이 바뀌는지 눈으로 확인

---

## 3. components/AccommodationCard.tsx

**목적**: 숙소 한 건을 카드 형태로 보여주는 핵심 컴포넌트 (프로젝트의 차별화 기능이 직접 드러나는 화면)

**위치**: `roomi-app/components/AccommodationCard.tsx` (신규 생성)

**정의**: `Accommodation` 타입 객체 하나를 prop으로 받아서 — 썸네일 이미지, 숙소명, 평소가(취소선 스타일), 현재가, `PriceChangeBadge` — 를 카드 레이아웃으로 렌더링

**확인할 것**:
- 평소가는 취소선(line-through) 스타일이 적용되는지
- `PriceChangeBadge`를 import해서 사용하는지 (직접 만들지 않고 2번에서 만든 걸 재사용)
- 터치 영역이 최소 44px 이상인지 (CLAUDE.local.md 프론트 작업 규칙)

**성공 기준**: mock 데이터 하나를 넣었을 때 카드 형태로 정상 렌더링

---

## 4. mock 데이터

**목적**: 실제 API 연동 전, 화면 확인용 가짜 데이터

**위치**: `app/(tabs)/index.tsx` 안에 임시 배열로 작성 (3~5개 정도, 추후 실제 연동 시 삭제될 임시 코드라는 걸 주석으로 표시)

**확인할 것**: 가격 변동률 값을 다양하게 넣어서(낮음/중간/높음) `PriceChangeBadge` 색상 분기가 전부 보이는지

---

## 5. app/(tabs)/index.tsx — 목록 렌더링

**목적**: mock 데이터 배열을 `AccommodationCard` 여러 개로 화면에 나열

**위치**: `roomi-app/app/(tabs)/index.tsx` (기존 파일 수정)

**정의**: 배열을 순회해서 `AccommodationCard`를 여러 개 렌더링 (RN에서 목록은 일반적으로 `FlatList` 사용 — `map`도 가능하지만 항목이 많아지면 성능 차이가 남, 이 단계에서는 개념만 소개)

**확인할 것**: 각 카드에 고유한 `key`(또는 FlatList의 `keyExtractor`)가 들어가는지

**성공 기준**: mock 데이터 개수만큼 카드가 화면에 나열됨

---

## 완료 기준

```bash
npx tsc --noEmit   # 오류 0개
npx expo start     # 정상 구동
```

화면에서 카드 3~5개가 보이고, 각 카드의 가격 변동률 뱃지 색이 값에 따라 다르게 보이는지 눈으로 확인.

에러 없으면 커밋 → push.
