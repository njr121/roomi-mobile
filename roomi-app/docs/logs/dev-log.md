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

둘 다 babel/metro 설정 파일을 처음부터 새로 만들면서, 기존에 암묵적으로 들어가 있던 설정을 놓친 경우. 상세: `roomi-app/docs/errors/error-log.md` 2026-06-17 항목. 개념 보강: `docs/log/study-log.md` "require() 구조 분해" 섹션

### 다음

1. Phase 8 커밋 → push
2. 첫 화면(AccommodationCard 등) 작업 시작

---

## 260617 — 핵심 패키지 설치 완료 (Phase 7 패키지 단계 종료)

### 완료

- [x] `zustand@^5.0.14`, `@tanstack/react-query@^5.101.0`, `react-hook-form@^7.79.0` 설치
- [x] `zod@3.24.1` 고정 설치 (npm이 최신 v4를 가져와서 버전 명시 재설치 — 상세는 error-log.md 아님, study-log.md "npm ERESOLVE" 섹션 참고)
- [x] `npx tsc --noEmit` 오류 0건 — 패키지 설치 단계 완료

### 다음

1. NativeWind 세부 설정 (global.css → tailwind.config.js → babel.config.js → metro.config.js)
2. 첫 화면(AccommodationCard 등) 작업 시작

### 학습 보강

- nativewind / tailwindcss / react-native-css-interop 패키지 3종 역할 구분 설명 → `docs/log/study-log.md`에 기록
