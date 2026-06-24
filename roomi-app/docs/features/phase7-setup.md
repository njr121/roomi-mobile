# Phase 7 — 앱 초기 세팅

> 구현 전 이 파일을 먼저 읽는다.
> 무엇을 만들지 정의만 한다. 실제 코드는 여기 없다.

---

## 작업 순서

1. Expo 프로젝트 생성
2. 핵심 패키지 설치 (버전 고정)
3. CLAUDE.local.md 작성
4. settings.local.json 작성 (도메인 차단)

---

## 1. Expo 프로젝트 생성

**목적**: React Native + Expo 기반 프로젝트 뼈대 생성

**버전 고정**: Expo 52.x / React Native 0.76.x / TypeScript 5.x (strict)

**명령어**
```bash
npx create-expo-app@latest roomi-app
cd roomi-app
npx expo install expo@52
```

**확인할 것**
- `roomi-app/package.json`에 `expo` 52.x, `react-native` 0.76.x 명시돼 있는지
- `roomi-app/tsconfig.json`에 `"strict": true` 들어있는지 (기본 템플릿 포함 여부 확인)
- `roomi-app/app/` 폴더(Expo Router 파일 기반 라우팅) 존재 여부

**성공 기준**: `npx expo start`로 앱이 정상 구동됨

---

## 2. 핵심 패키지 설치

**목적**: 상태관리·스타일링·폼 처리에 필요한 라이브러리 설치 (CLAUDE.md 버전 고정표 기준)

**설치 대상**

| 패키지 | 버전 | 용도 |
|---|---|---|
| `nativewind` | 4.x | TailwindCSS RN 스타일링 |
| `tailwindcss` | 3.x | NativeWind 4.x 필수 의존성 |
| `zustand` | 5.x | 클라이언트 상태 |
| `@tanstack/react-query` | 5.x | 서버 상태 |
| `react-hook-form` | 7.x | 폼 검증 |
| `zod` | 3.x | 스키마 검증 |

**절대 금지**: `latest` 버전 설치 — 위 메이저 버전 고정해서 설치

**성공 기준**: `package.json`의 dependencies에 6개 패키지 전부 명시된 버전대로 들어있음

> NativeWind 세부 설정(babel, tailwind.config.js, global.css)은 패키지 설치 후 별도 단계에서 다룬다. 이 문서 범위는 설치까지다.

---

## 3. CLAUDE.local.md 작성

**목적**: feat/app 세션 상태 추적, 작업 경계 명시

**기반 템플릿**: `docs/guide/CLAUDE.local.app.md`

**위치**: `roomi-app/CLAUDE.local.md` (gitignore 대상)

---

## 4. settings.local.json 작성

**목적**: `roomi-api/` 쓰기 물리적 차단 (도메인 경계 하네스)

**기반 템플릿**: `docs/guide/settings.local.app.json`

**위치**: `roomi-app/.claude/settings.local.json` (gitignore 대상)

---

## 완료 기준

```bash
npx tsc --noEmit   # TypeScript 오류 0개
npx expo start     # 정상 구동 확인
```

에러 없으면 커밋 → push
