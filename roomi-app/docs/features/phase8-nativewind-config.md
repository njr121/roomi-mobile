# Phase 8 — NativeWind 세부 설정

> 완료된 Phase. 참고용 기록.

> 구현 전 이 파일을 먼저 읽는다.
> 무엇을 만들지 정의만 한다. 실제 코드는 여기 없다.

---

## 전제

Phase 7에서 `nativewind`, `tailwindcss`, `react-native-css-interop` 설치까지 완료. 이 문서는 그 다음 단계 — 설치된 패키지가 실제로 동작하도록 연결하는 설정 작업만 다룬다.

---

## 작업 순서

1. `global.css` 작성
2. `tailwind.config.js` 작성
3. `babel.config.js` 수정
4. `metro.config.js` 작성
5. `app/_layout.tsx`에 `global.css` import

---

## 1. global.css

**목적**: Tailwind 지시문(`base`/`components`/`utilities`)을 선언하는 진입점 파일

**위치**: `roomi-app/global.css` (루트, 신규 생성)

**정의**: Tailwind가 요구하는 3개 지시문을 정해진 순서로 작성

**확인할 것**: 파일이 프로젝트 루트(`app/`이나 `components/` 안이 아님)에 생성됐는지

**성공 기준**: 다음 단계(metro.config.js)에서 이 파일을 input으로 연결하기 전까지는 단독으로 효과가 없음 — 문법 오류만 없으면 됨

---

## 2. tailwind.config.js

**목적**: Tailwind가 어떤 파일에서 클래스를 스캔할지, NativeWind preset을 어떻게 연결할지 정의

**위치**: `roomi-app/tailwind.config.js` (루트, 신규 생성)

**정의**:
- `content`: 클래스를 스캔할 파일 경로 배열 (`app/`, `components/` 하위 `.tsx` 파일 포함)
- `presets`: NativeWind 전용 preset 연결

**확인할 것**: `content` 경로가 실제 폴더 구조(`app/`, `components/`)와 정확히 일치하는지 — 경로가 틀리면 클래스가 스캔되지 않아 스타일이 전혀 안 먹힘

**성공 기준**: 문법 오류 없이 파일 작성 완료

---

## 3. babel.config.js

**목적**: 빌드 시점에 `className="..."` 문자열을 NativeWind가 처리할 수 있도록 babel 설정에 연결

**위치**: `roomi-app/babel.config.js` (기존 파일 수정)

**정의**: 기존 `babel-preset-expo` 설정에 NativeWind용 옵션 추가 (jsxImportSource 지정)

**확인할 것**: 기존에 있던 다른 설정(예: `react-native-reanimated/plugin`)을 지우지 않고 추가만 하는지 — 기존 설정 삭제 시 다른 기능이 깨질 수 있음

**성공 기준**: Metro 서버가 babel 설정 오류 없이 기동

---

## 4. metro.config.js

**목적**: Metro 번들러가 `global.css`를 인식하고 NativeWind 변환 파이프라인을 거치게 함

**위치**: `roomi-app/metro.config.js` (신규 생성 또는 기존 파일 감싸기)

**정의**: NativeWind 전용 함수로 기존 Expo 기본 Metro 설정을 감싸고, `global.css` 경로를 input으로 지정

**확인할 것**: 기존 `metro.config.js`가 없으면 Expo 기본 설정부터 가져와서 감싸야 함 (처음부터 새로 작성하면 Expo 기본 설정이 누락됨)

**성공 기준**: 빌드 시 css 관련 에러 없음

---

## 5. app/_layout.tsx — global.css import

**목적**: 앱 전체 화면에 스타일 시스템을 적용

**위치**: `roomi-app/app/_layout.tsx` (기존 파일 최상단에 한 줄 추가)

**정의**: 다른 import보다 먼저 `global.css`를 import

**확인할 것**: 파일 최상단(다른 import문보다 위)에 위치하는지

**성공 기준**: 테스트용 `className="bg-red-500"` 같은 스타일을 컴포넌트에 적용했을 때 실제 화면에 반영됨

---

## 참고 — Phase 7에서 겪은 패턴

Phase 7에서 `--legacy-peer-deps` 반복 사용으로 인한 의존성 문제와, SDK54→52 다운그레이드 잔재(`app.json` 등) 문제가 있었다. Phase 8은 새 패키지 설치가 없는 순수 설정 작업이라 같은 유형의 문제는 발생하지 않을 것으로 예상되나, 설정 파일 작성 중 오류가 나면 "설정 문법 오류"와 "경로/스캔 범위 오류"를 구분해서 확인한다.

---

## 완료 기준

```bash
npx tsc --noEmit   # TypeScript 오류 0개
npx expo start     # 정상 구동 확인
```

추가로: 테스트 컴포넌트에 Tailwind 클래스(`className="bg-red-500"`)를 적용해 실제 화면에 스타일이 반영되는지 눈으로 확인.

에러 없으면 커밋 → push.
