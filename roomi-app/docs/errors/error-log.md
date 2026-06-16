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
