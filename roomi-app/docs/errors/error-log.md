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
