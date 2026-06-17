# roomi-app 에러 로그

> 에러 발생 시 아래에 섹션 추가

---

## 2026-06-16 | create-expo-app@52 — 존재하지 않는 버전

### 에러 메시지

```
npm error code ETARGET
npm error notarget No matching version found for create-expo-app@52.
npm error notarget In most cases you or one of your dependencies are requesting a package version that doesn't exist.
```

### 원인

`create-expo-app`(프로젝트 생성 CLI 도구)의 npm 버전과 Expo SDK 버전은 서로 다른 번호 체계다. `@52`는 "Expo SDK 52"를 의미하려 한 것이지만, `create-expo-app` 패키지 자체에는 그런 버전이 없다. CLI 도구 버전과 그 도구가 만들어주는 앱의 SDK 버전을 혼동한 것.

### 해결

CLI는 버전 고정 없이(`@latest` 또는 버전 생략) 실행해서 프로젝트를 생성하고, SDK 버전은 생성된 프로젝트 안에서 따로 맞춘다.

```bash
npx create-expo-app@latest roomi-app
cd roomi-app
npx expo install expo@52
```

### 교훈

"도구 이름@버전"이 항상 그 도구가 다루는 대상의 버전을 의미하지는 않는다. 패키지명과 그 패키지가 생성/관리하는 결과물의 버전을 구분해야 한다.

---

## 2026-06-16 | npm ERESOLVE — expo install --fix가 devDependencies는 안 고침

### 에러 메시지

```
npm error code ERESOLVE
npm error ERESOLVE could not resolve
npm error While resolving: react-native@0.76.9
npm error Found: @types/react@19.1.17
npm error peerOptional @types/react@"^18.2.6" from @react-native/virtualized-lists@0.76.9
npm error Conflicting peer dependency: @types/react@18.3.31
```

### 원인

`npx expo install expo@52` → `npx expo install --fix`로 `dependencies`(react, react-native, expo-* 등)는 SDK 52에 맞는 버전으로 자동 수정됐지만, `devDependencies`의 `@types/react`(19.x)와 `eslint-config-expo`(10.x)는 SDK 54 템플릿 생성 당시 버전 그대로 남아있었다. `react-native@0.76.9`는 `@types/react@^18.2.6`를 요구하는데 실제 설치된 건 19.x라 충돌.

### 해결

`package.json`의 `devDependencies`를 수동으로 SDK 52 기준에 맞춰 수정:

```diff
  "devDependencies": {
-   "@types/react": "~19.1.0",
+   "@types/react": "~18.3.12",
    "typescript": "~5.9.2",
    "eslint": "^9.25.0",
-   "eslint-config-expo": "~10.0.0"
+   "eslint-config-expo": "~8.0.1"
  }
```

그 다음 `node_modules`, `package-lock.json` 삭제 후 재설치:

```bash
rm -rf node_modules package-lock.json
npm install
```

### 교훈

`expo install --fix`는 `dependencies`만 책임진다. `devDependencies`에 있는 타입 정의(`@types/*`)나 린트 설정 패키지는 SDK 버전이 바뀌면 직접 확인해야 한다. "자동으로 다 맞춰주는 도구"라도 적용 범위를 확인해야 함.

---

## 2026-06-17 | npm ERESOLVE backtracking — 설치 명령이 36분간 끝나지 않음

### 에러 메시지

```
npm warn ERESOLVE overriding peer dependency
npm warn While resolving: roomi-app@1.0.0
npm warn Found: tailwindcss@3.4.19
npm warn peer tailwindcss@"~3" from react-native-css-interop@0.2.5
```

위 경고가 반복 출력되며 36분간 명령이 종료되지 않아 Ctrl+C로 강제 종료함.

### 원인

`npx expo install nativewind tailwindcss react-native-css-interop` 실행 시, `react-native-css-interop`이 요구하는 `tailwindcss` peer 버전과 실제 설치 시도 버전 사이에 충돌이 있었다. npm은 충돌이 있으면 "충돌 없는 조합"을 찾으려고 가능한 버전 조합을 backtracking으로 탐색하는데, Expo/RN 프로젝트는 의존성 트리가 매우 커서(패키지 1000개 이상) 이 탐색이 비정상적으로 오래 걸리거나 멈춘 것처럼 보일 수 있다. 네트워크 문제는 아니었음(`registry.npmjs.org` 응답 0.14초로 확인).

### 해결

`--legacy-peer-deps` 옵션으로 peer dependency 충돌 검사 자체를 건너뛰게 했다. 단, `expo install`은 자체 옵션 파서를 가지고 있어 `--legacy-peer-deps`를 직접 인식하지 못하므로 `--` 구분자로 npm에 전달해야 한다.

```bash
npx expo install nativewind tailwindcss react-native-css-interop -- --legacy-peer-deps
```

→ 3초 내 설치 완료.

### 교훈

ERESOLVE 경고 자체는 즉시 출력되는 텍스트라 시간이 걸리지 않는다. 경고가 반복되며 명령이 오래 끝나지 않는다면 경고 출력이 아니라 npm의 버전 조합 탐색(backtracking)이 원인일 가능성이 높다. 의존성 트리가 큰 Expo/RN 프로젝트에서는 `--legacy-peer-deps`가 표준적인 우회법.

---

## 2026-06-17 | --legacy-peer-deps로 설치한 tailwindcss가 호환 안 되는 v4로 들어옴

### 에러 메시지

(에러 메시지 없음 — 설치는 성공했지만 잘못된 버전이 조용히 들어간 경우)

```json
"tailwindcss": "^4.3.1"
```

### 원인

`--legacy-peer-deps`는 peer dependency 검사를 건너뛰는 옵션이라, npm이 충돌 검사 없이 그냥 최신 버전(`tailwindcss@4.3.1`)을 설치했다. 그런데 NativeWind 4.x는 Tailwind **v3** 체계(엔진·설정 파일 구조)를 기준으로 동작해서 v4와 호환되지 않는다. 충돌 검사를 건너뛰었기 때문에 에러 없이 잘못된 버전이 들어갔다.

### 해결

`tailwindcss`만 NativeWind가 요구하는 3.x로 버전을 고정해서 재설치.

```bash
npm install --save-exact tailwindcss@3.4.17 --legacy-peer-deps
```

### 교훈

`--legacy-peer-deps`는 "충돌이 있어도 진행"이 아니라 "충돌 검사 자체를 안 함"이다. 검사를 생략한 패키지는 설치 후 버전을 직접 확인해야 한다. 설치 성공 메시지만 보고 끝났다고 판단하면 안 되고, `package.json`에서 실제 설치된 버전을 확인하는 습관이 필요하다.

---

## 2026-06-17 | expo-asset 누락 — npx expo start 실행 시 모듈을 찾을 수 없음

### 에러 메시지

```
Error: The required package `expo-asset` cannot be found
    at getAssetPlugins (node_modules/@expo/metro-config/src/ExpoMetroConfig.ts:65:11)
```

### 원인

`expo` 패키지 자체가 내부적으로 `expo-asset@~11.0.5`를 필요로 하는데(`node_modules/expo/package.json`에 명시), 실제로는 `node_modules/expo-asset`이 존재하지 않았다. 같은 날 반복된 `--legacy-peer-deps` 설치(NativeWind, 나머지 패키지, ajv 등)가 누적되면서 `node_modules` 의존성 트리 일부가 깨진 것으로 추정.

### 해결

`node_modules`, `package-lock.json`을 삭제하고 처음부터 재설치.

```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

`package.json`에 버전이 이미 정확히 고정돼 있었기 때문에(`tailwindcss: "3.4.17"`, `zod: "3.24.1"` 등), 재설치해도 기존에 맞춰둔 버전 규칙은 그대로 유지됐다.

### 교훈

`--legacy-peer-deps`로 여러 번 설치를 반복하면 트리가 부분적으로 누락되는 사고가 생길 수 있다. 패키지 하나가 빠진 것처럼 보여도 부분 수정(`expo install --fix` 등)보다 `node_modules` 전체 재설치가 더 확실할 때가 있다. 단, 재설치 전 `package.json`에 원하는 버전이 정확히 박혀 있는지 먼저 확인해야 안전하다.

---

## 2026-06-17 | ajv 버전 충돌 — Cannot find module 'ajv/dist/compile/codegen'

### 에러 메시지

```
Error: Cannot find module 'ajv/dist/compile/codegen'
Require stack:
- node_modules/ajv-keywords/dist/definitions/typeof.js
...
- node_modules/expo-router/plugin/build/index.js
```

### 원인

`node_modules` 전체 재설치 후에도, `ajv-keywords`(Expo Router 빌드 도구 내부에서 쓰는 패키지)는 `ajv@^8.8.2`를 요구하는데 실제 설치된 `ajv`는 v6.15.0이었다. v6와 v8은 내부 폴더 구조가 달라서(`dist/compile/codegen` 경로는 v8에만 존재) 모듈을 찾지 못했다. `--legacy-peer-deps`가 충돌 검사를 생략하면서, npm이 원래 v6/v8을 따로 중첩 설치해야 하는데 v6 하나로 합쳐버린(dedupe) 것이 원인.

### 해결

최상위에 `ajv@8`을 명시적으로 설치해서 npm이 v6/v8을 다시 올바르게 나눠 두게 했다.

```bash
npm install ajv@^8.17.1 --legacy-peer-deps
```

### 교훈

`--legacy-peer-deps`를 반복 사용하면 서로 다른 메이저 버전을 요구하는 패키지들이 하나로 잘못 합쳐질(dedupe) 수 있다. "필요한 패키지가 없다"는 에러가 나면 단순 누락이 아니라 버전 충돌로 인한 dedupe 문제일 가능성도 함께 확인해야 한다.

---

## 2026-06-17 | reactCompiler 실험 기능 — babel-plugin-react-compiler must be installed

### 에러 메시지

```
Metro error: [BABEL] .../shim:react-native-web/dist/exports/BackHandler/index.js:
The `babel-plugin-react-compiler` must be installed before you can use React Compiler.
```

### 원인

`app.json`의 `experiments.reactCompiler`가 `true`로 설정돼 있었는데, 이는 `create-expo-app@latest`가 처음 생성한 SDK54 기본 템플릿의 값이 SDK52로 다운그레이드하는 과정에서 그대로 남은 것이었다 (이전에 정리한 hello-wave 데모 화면, CLAUDE.md/AGENTS.md 충돌과 같은 패턴). 이 실험 기능을 쓰려면 `babel-plugin-react-compiler` 패키지가 별도로 필요한데 설치돼 있지 않았다.

### 해결

이 프로젝트는 React Compiler가 필요 없으므로, 패키지를 추가하는 대신 설정을 껐다.

```diff
"experiments": {
  "typedRoutes": true,
- "reactCompiler": true
}
```

### 교훈

`create-expo-app@latest`로 생성하면 그 시점 최신 SDK(54) 기준 기본값이 함께 따라온다. SDK를 낮추는 다운그레이드 작업을 했다면, `package.json`(devDependencies)뿐 아니라 `app.json`의 `experiments` 같은 설정값도 다운그레이드 대상 SDK에 맞는지 확인해야 한다.

---

## 2026-06-17 | metro.config.js — 구조 분해 할당 누락으로 getDefaultConfig is not a function

### 에러 메시지

```
TypeError: getDefaultConfig is not a function
    at Object.<anonymous> (roomi-app/metro.config.js:4:16)
```

### 원인

```js
// 실제로 작성된 코드
const getDefaultConfig = require("expo/metro-config");
const withNativeWind = require("nativewind/metro");
```

`expo/metro-config`와 `nativewind/metro`는 둘 다 함수를 이름 붙여서 내보내는(named export) 모듈이라, `{ }`로 구조 분해해서 꺼내야 한다. `{ }` 없이 받으면 변수에 함수가 아니라 **모듈 전체 객체**(`{ getDefaultConfig, createStableModuleIdFactory, ... }`)가 담겨서, 그걸 함수처럼 호출하면 에러가 난다. 코드 리뷰 단계에서 이 부분을 놓치고 통과시킨 것도 원인 중 하나.

### 해결

```diff
- const getDefaultConfig = require("expo/metro-config");
- const withNativeWind = require("nativewind/metro");
+ const { getDefaultConfig } = require("expo/metro-config");
+ const { withNativeWind } = require("nativewind/metro");
```

### 교훈

`require()` 결과를 받을 때 `{ }`가 있고 없고는 "그 모듈 전체를 받는다"와 "그 모듈 안의 특정 함수만 꺼내 받는다"의 차이다. 둘 다 에러 없이 변수에 값이 할당되기 때문에, 실제로 그 변수를 함수로 호출하는 순간에야 문제가 드러난다. 코드 리뷰 시 `require`/`import` 구문도 빠뜨리지 않고 확인해야 한다.

---

## 2026-06-17 | babel.config.js — Reanimated 플러그인 누락으로 __reanimatedLoggerConfig is not defined

### 에러 메시지

```
Metro error: __reanimatedLoggerConfig is not defined
```

### 원인

`babel.config.js`가 원래 없던 상태에서 NativeWind 연결을 위해 새로 만들면서, `babel-preset-expo`가 내부적으로 자동 처리해주던 `react-native-reanimated`용 babel 플러그인 등록이 함께 빠졌다. 이 프로젝트는 `react-native-reanimated`(Expo Router 네비게이션 애니메이션 등에서 사용)가 설치돼 있어서 이 플러그인이 필수다.

### 해결

`plugins` 배열에 reanimated 플러그인을 **마지막 항목으로** 추가.

```diff
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
+   plugins: ["react-native-reanimated/plugin"],
  };
};
```

추가로 babel 설정 변경 후에는 Metro 캐시도 같이 지워야 한다.

```bash
npx expo start -c
```

### 교훈

`babel.config.js`가 없던 프로젝트에 새로 파일을 만들면, 그동안 암묵적으로 적용되던 설정(이번엔 reanimated 플러그인)이 함께 빠질 수 있다. 새 설정 파일을 만들 때는 "원래 뭐가 자동으로 들어가 있었는지"까지 함께 확인해야 한다. 또한 babel 설정처럼 빌드 파이프라인 앞단의 설정을 바꾸면 캐시(`-c`)를 지우고 재시작해야 변경이 확실히 반영된다.

---
