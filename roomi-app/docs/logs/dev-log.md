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
