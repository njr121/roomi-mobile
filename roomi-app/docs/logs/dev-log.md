# roomi-app 개발 로그

> GitHub 공개. 학습 과정은 제외하고 완료 항목·기술 결정만 기록.

---

## 260616 — Phase 7 시작

### 완료

- [x] `docs/features/phase7-setup.md` 작성 (Expo 생성 → 패키지 설치 → CLAUDE.local.md → settings.local.json 순서 정의)
- [x] Expo 프로젝트 생성 (`create-expo-app@latest`, SDK 52 / React Native 0.76.9 / TypeScript strict)
- [x] Expo 자동 생성 데모 화면(hello-wave, parallax-scroll-view) 제거, index/explore 최소 화면으로 교체
- [x] Expo가 만든 `CLAUDE.md`/`AGENTS.md` 삭제 (프로젝트 규칙과 충돌)
- [x] `npx tsc --noEmit` 오류 0건 확인
- [x] `.claude/settings.local.json` 작성 (roomi-api 쓰기 차단)

### 기술 결정

- `create-expo-app@52` 같은 형태로 CLI에 SDK 버전을 직접 지정할 수 없음 → `create-expo-app@latest`로 생성 후 `npx expo install expo@52`로 다운그레이드
- `expo install --fix`는 `dependencies`만 SDK에 맞게 고치고 `devDependencies`(`@types/react`, `eslint-config-expo`)는 수동으로 맞춰야 함

### 다음

1. 핵심 패키지 설치 (NativeWind 4.x, Zustand 5.x, TanStack Query 5.x, React Hook Form 7.x + Zod 3.x)
2. NativeWind 세부 설정 (babel, tailwind.config.js, global.css)
3. 첫 화면 작업 시작

---

## 260617 — NativeWind 패키지 설치 + ERESOLVE 트러블슈팅

### 완료

- [x] `nativewind@^4.2.5`, `react-native-css-interop@^0.2.5` 설치
- [x] `tailwindcss@3.4.17` 고정 설치 (NativeWind 4.x는 Tailwind v3 체계 전제, v4 비호환)

### 에러 이력

- npm ERESOLVE peer dependency 충돌로 설치 명령이 36분간 종료되지 않음 → `--legacy-peer-deps`로 우회 (`expo install` 옵션 전달은 `--` 구분자 필요)
- `--legacy-peer-deps`가 충돌 검사를 생략하면서 `tailwindcss@4.3.1`(비호환)이 조용히 설치됨 → `tailwindcss@3.4.17`로 재고정
- 상세: `roomi-app/docs/errors/error-log.md` 2026-06-17 항목 2건

### 다음

1. 나머지 핵심 패키지 설치 (Zustand 5.x, TanStack Query 5.x, React Hook Form 7.x + Zod 3.x)
2. NativeWind 세부 설정 (babel.config.js, tailwind.config.js, global.css, metro.config.js)
3. 첫 화면 작업 시작

---

## 260617 — Phase 7 완료

### Phase 7 완료 ✅

| 항목 | 상태 |
|---|---|
| Expo 프로젝트 생성 (SDK 52) | ✅ |
| 핵심 패키지 7종 설치 (버전 고정) | ✅ |
| CLAUDE.local.md 작성 | ✅ |
| settings.local.json 작성 | ✅ |
| `npx tsc --noEmit` 오류 0개 | ✅ |
| `npx expo start` 정상 구동 (웹 화면 확인) | ✅ |

### `npx expo start` 트러블슈팅 — 에러 3건

1. `expo-asset` 누락 → `node_modules`+`package-lock.json` 삭제 후 재설치
2. `ajv` v6/v8 충돌 (`ajv-keywords`가 v8 요구) → `ajv@^8.17.1` 명시 설치로 재분리
3. `app.json`의 `reactCompiler: true`(SDK54 템플릿 잔재) → 설정 제거

세 건 모두 `--legacy-peer-deps` 반복 사용 또는 SDK54→52 다운그레이드 잔재가 원인. 상세: `roomi-app/docs/errors/error-log.md` 2026-06-17 항목 참고

### 다음

1. `git add` + Phase 7 커밋 → push
2. Phase 8 feature 문서 작성 (NativeWind 세부 설정)
3. NativeWind 세부 설정 → 첫 화면 작업

---

## 260617 — Phase 8 완료 (NativeWind 세부 설정)

### Phase 8 완료 ✅

| 항목 | 상태 |
|---|---|
| `global.css` 작성 | ✅ |
| `tailwind.config.js` 작성 | ✅ |
| `babel.config.js` 작성 | ✅ |
| `metro.config.js` 작성 | ✅ |
| `app/_layout.tsx`에 `global.css` import | ✅ |
| `npx tsc --noEmit` 오류 0개 | ✅ |
| `npx expo start` 정상 구동 | ✅ |
| `className="bg-red-500"` 실제 화면 반영 확인 | ✅ |

### 에러 이력 (중요)

1. `metro.config.js` — `require()` 구조 분해 할당(`{ }`) 누락으로 `getDefaultConfig is not a function`
2. `babel.config.js` — Reanimated 플러그인 누락으로 `__reanimatedLoggerConfig is not defined`

둘 다 babel/metro 설정 파일을 처음부터 새로 만들면서, 기존에 암묵적으로 들어가 있던 설정을 놓친 경우. 상세: `roomi-app/docs/errors/error-log.md` 2026-06-17 항목

### 다음

1. Phase 8 커밋 → push
2. 첫 화면(AccommodationCard 등) 작업 시작

---

## 260617 — Phase 9 완료 (첫 화면 — AccommodationCard, mock 데이터)

### Phase 9 완료 ✅

| 항목 | 상태 |
|---|---|
| `types/index.ts` — Accommodation 타입 정의 | ✅ |
| `components/PriceChangeBadge.tsx` — 가격 변동률 뱃지 | ✅ |
| `components/AccommodationCard.tsx` — 숙소 카드 | ✅ |
| mock 데이터 4건 작성 | ✅ |
| `app/(tabs)/index.tsx` — FlatList로 목록 렌더링 | ✅ |
| `npx tsc --noEmit` 오류 0개 | ✅ |
| `npx expo start` 정상 구동, 카드 4개 + 색상 3종 정상 표시 확인 | ✅ |

### 기준 변경

`PriceChangeBadge` 색상 경계값을 "+30% 이하 초록"에서 "+30% 미만 초록(30%부터 주황)"으로 변경. `CLAUDE.local.md`, `phase9-first-screen.md` 반영 완료. PRD는 별도 처리.

### 다음

1. UI 디자인 개선 (Steam 스토어 참고 — 가로 배치, 배지·가격 타이포그래피)
2. Phase 10 — 실제 API 연동 (TanStack Query, mock 데이터 대체)

### Phase 10 feature 문서 작성

- [x] `docs/features/phase10-data-integration.md` 작성 완료
- 범위: roomi-api 서버 실행 → lib/env.ts → lib/api.ts → TanStack Query Provider → useAccommodations 훅 → index.tsx 데이터 교체
- 디자인 개선은 모든 화면 기능 완성 후 일괄 적용으로 결정, 다음 세션은 Phase 10부터 시작

---

## 260617 — 핵심 패키지 설치 완료 (Phase 7 패키지 단계 종료)

### 완료

- [x] `zustand@^5.0.14`, `@tanstack/react-query@^5.101.0`, `react-hook-form@^7.79.0` 설치
- [x] `zod@3.24.1` 고정 설치 (npm이 최신 v4를 가져와서 버전 명시 재설치)
- [x] `npx tsc --noEmit` 오류 0건 — 패키지 설치 단계 완료

### 다음

1. NativeWind 세부 설정 (global.css → tailwind.config.js → babel.config.js → metro.config.js)
2. 첫 화면(AccommodationCard 등) 작업 시작

---

## 260618 — Husky 설치 (Phase 10 착수 전)

### 완료

- [x] 루트 `package.json` 신규 작성 (husky devDependency + prepare 스크립트)
- [x] `npm install`로 husky 셋업
- [x] `.husky/pre-commit` 작성 — `cd roomi-app && npx tsc --noEmit`
- [x] 타입 에러 의도적 발생 → 커밋 차단 확인 → 수정 후 정상 커밋 확인
- [x] 커밋 `018dda7`

### 기술 결정

- `.husky/_`는 husky 내부 엔진(수정 금지), 실제 검사 명령은 `.husky/pre-commit`(최상위, `_`와 형제 위치)에 작성
- `feat/api`도 동일한 패턴으로 이미 설치돼 있음(`cd roomi-api && npx tsc --noEmit`) — 브랜치마다 자기 도메인 검사만 실행

### Phase 10 1단계 완료 — roomi-api 서버 실행 (같은 날 이어서)

- [x] `git worktree add ../roomi-api-server feat/api` — feat/app 작업 폴더는 그대로 두고 별도 폴더에 백엔드 동시 체크아웃
- [x] `.env` 복사 → `npm install` → `npm run dev` 정상 기동 확인
- [x] `GET http://localhost:3000/api/accommodations` → 200, 시드 데이터 JSON 응답 확인
- [x] `.env`에 `EXPO_PUBLIC_API_URL=http://localhost:3000` 추가 완료 (사용자 직접)

### 이슈 발견 — Next.js 버전 불일치 (보류)

`roomi-api/package.json`의 `next` 버전이 규칙(15.x)과 다른 `16.2.9`로 박혀있는 걸 서버 기동 중 발견. Phase 1~6이 이미 이 버전으로 완성돼 있어 지금 다운그레이드는 위험 부담이 더 크다고 판단해 기술 부채로 기록만 하고 보류. 상세: `roomi-app/docs/errors/error-log.md` 2026-06-18 항목

### Phase 10 2~6단계 완료

| 파일 | 내용 | 상태 |
|---|---|---|
| `lib/env.ts` | `EXPO_PUBLIC_API_URL` Zod 검증 | ✅ |
| `lib/api.ts` | `getAccommodations()` fetch 래퍼 | ✅ |
| `app/_layout.tsx` | `QueryClientProvider` 추가 | ✅ |
| `hooks/useAccommodations.ts` | `useQuery` 훅 | ✅ |
| `app/(tabs)/index.tsx` | mock → 실제 데이터, 로딩/에러 분기 | ✅ |

매 단계 `npx tsc --noEmit` 오류 0개 확인.

### Phase 10 7단계 — CORS 에러로 보류

Expo 웹에서 최종 확인 중 "데이터를 불러오지 못했습니다" 발생. 원인은 백엔드 CORS 헤더 누락(`roomi-api` 도메인 문제, `feat/app` 범위 밖). `curl` 직접 호출은 200 정상 — 서버 자체는 문제 없음. 상세: `docs/errors/error-log.md` 2026-06-18 항목.

### CORS 해결 + 음수(할인) 디자인 결정 + Phase 10 완료 ✅

- [x] `roomi-api`(worktree) `next.config.ts`에 CORS 헤더 추가 → Expo 웹에서 실제 데이터 정상 표시
- [x] `PriceChangeBadge` 부호 버그(`+-4%`) 발견·수정
- [x] 정책 결정: 음수(할인) 노출 — "변동률"로 컨셉 재정의(상승+할인 모두), 색상 4단계(할인 파랑/0~29 초록/30~99 주황/100+ 빨강)로 확장
- [x] 용어 동기화: `CLAUDE.md`, `CLAUDE.local.md`, `phase9-first-screen.md`, PRD(`v9`, 웹 클로드 경유) 전부 "상승률"→"변동률"
- [x] 최종 검증: Expo 웹에서 할인/일반 카드 색상·부호·정렬 전부 정상 확인

**Phase 10 전체 완료** — mock 데이터 → 실제 백엔드 데이터 연동 끝남

### 커밋 + push 완료
- `feat/app`: `df45860`, `a86960a`, `b65b026`
- `feat/api`: `0e05575`

### Phase 11 — 숙소 상세 화면 (`phase11-detail-screen.md` 작성 완료)

- 범위: `types/index.ts` 보강(`thumbnail`→`images` 등 버그 수정 포함) → `lib/api.ts`에 상세 API 함수 추가 → `useAccommodationDetail` 훅 → `app/accommodation/[id].tsx` 라우트 → 홈 화면 카드 탭 연결
- 주의점: 상세 API는 목록 API와 응답 구조가 다름(한 겹 vs 두 겹)

### Phase 11 전체 완료 ✅

| 파일 | 내용 |
|---|---|
| `types/index.ts` | `thumbnail` 제거, `location`/`description`/`rating`/`images` 추가, `Room`/`AccommodationDetail` 신규 |
| `components/AccommodationCard.tsx` | `thumbnail` → `images[0]` 버그 수정 |
| `lib/api.ts` | `getAccommodationDetail(id)` 추가 |
| `hooks/useAccommodationDetail.ts` | 신규 |
| `app/accommodation/[id].tsx` | 상세 화면 신규(동적 라우트), 헤더 제목 동적 설정 |
| `app/(tabs)/index.tsx` | 카드 탭 → 상세 이동 연결 |

`tsc --noEmit` 오류 0개, Expo 웹에서 전체 플로우(탭 → 상세 → 뒤로가기) 확인 완료.

### 다음

1. 커밋
2. 다음 화면 착수
