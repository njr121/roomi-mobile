# Phase 12 — 인증 (Google 소셜 로그인)

> 구현 전 이 파일을 먼저 읽는다.
> 무엇을 만들지 정의만 한다. 실제 코드는 여기 없다.

---

## 전제 — 왜 기존 백엔드 인증을 그대로 못 쓰나

`roomi-api`의 `requireAuth()`는 NextAuth의 `auth()`로 **브라우저 쿠키**에 저장된 세션을 읽는다. Google·카카오·네이버 로그인도 NextAuth가 `/api/auth/...` 경로로 리다이렉트시키며 브라우저에 쿠키를 심는, **웹 전용** 흐름이다.

React Native 앱은 브라우저가 아니라서 이 쿠키가 `fetch` 요청에 자동으로 안 따라간다. 그래서 모바일 전용 인증 경로를 별도로 만든다 — 기존 웹용 NextAuth 흐름은 그대로 두고, 모바일은 "자체 토큰 발급" 방식을 추가한다.

**범위**: Google 1개 provider만 먼저 구현(카카오·네이버는 시간 남으면 같은 패턴으로 추가). 이메일/비밀번호는 백엔드에 라우트 자체가 없어(이전 결정으로 보류) 이번 범위에 포함 안 함.

---

## 전체 흐름

```
앱에서 "Google로 로그인" 버튼 탭
  → expo-auth-session이 브라우저(시스템 웹뷰)로 Google 로그인 화면 띄움
  → 사용자가 Google 계정으로 로그인/동의
  → 앱이 Google로부터 id_token을 직접 받음 (NextAuth 안 거침)
  → 앱이 그 id_token을 백엔드 신규 라우트(POST /api/auth/mobile/google)로 전송
  → 백엔드가 Google에 id_token이 진짜인지 확인 → 회원가입/로그인 처리(upsert) → 자체 JWT 발급
  → 앱이 그 JWT를 안전한 저장소(SecureStore)에 저장
  → 이후 모든 API 요청에 Authorization: Bearer <JWT> 헤더를 붙여서 보냄
  → 백엔드 requireAuth()가 쿠키 없으면 이 헤더의 JWT도 확인하도록 확장
```

---

## 작업 순서 — 백엔드 (`roomi-api-server` worktree, `feat/api` 브랜치)

### 1. `jose` 패키지 설치

**목적**: 자체 JWT를 서명·검증하기 위한 라이브러리 (Next.js Edge 런타임과도 호환되어 NextAuth 생태계에서 흔히 같이 씀)

**확인할 것**: `package.json`에 `latest` 아닌 명시 버전으로 들어가는지

### 2. `app/api/auth/mobile/google/route.ts` — 신규 라우트

**목적**: 앱이 보낸 Google `id_token`을 검증하고, 우리 서비스 전용 JWT를 발급

**정의**: POST 요청 바디로 `{ idToken: string }`을 받음 → Google의 토큰 검증(Google tokeninfo 엔드포인트 호출, 또는 `google-auth-library`) → email/name 추출 → `prisma.user.upsert()`(NextAuth `signIn` 콜백과 같은 로직, `provider: "google"`) → `jose`로 `{ userId }`를 담은 JWT 서명 → `{ token, user }` 형태로 응답(`apiSuccess` 포맷)

**확인할 것**: 가짜 `id_token`을 보냈을 때 401로 거부되는지(Google 검증 단계가 실제로 동작하는지)

**성공 기준**: 실제 Google 로그인으로 받은 `id_token`을 이 라우트에 보내면 우리 JWT가 발급됨

### 3. `lib/auth.ts`의 `requireAuth()` 확장

**목적**: 웹(쿠키)과 모바일(Bearer 토큰) 둘 다 지원

**정의**: 기존 `auth()` 쿠키 세션 체크가 실패하면, `Authorization: Bearer <token>` 헤더가 있는지 확인 → 있으면 `jose`로 검증 → 통과 시 그 안의 `userId` 반환. 둘 다 실패하면 기존처럼 401

**확인할 것**: 기존 웹 흐름(있었다면)이 안 깨지는지 — 쿠키 체크를 먼저 시도하고, 그게 없을 때만 토큰을 본다

**성공 기준**: 토큰을 헤더에 넣고 `/api/wishlists` 같은 인증 필요 API를 호출하면 401이 아니라 정상 응답

---

## 작업 순서 — 외부 설정 (사용자 직접, 웹 콘솔)

### 4. Google Cloud Console에서 모바일용 OAuth 클라이언트 ID 발급

**왜 따로 필요한가**: 기존 백엔드용 Google 클라이언트 ID는 "웹 애플리케이션" 타입이라 리다이렉트 URI가 웹 도메인 기준이다. Expo 앱은 별도의 클라이언트 ID(Android/iOS 또는 Expo 프록시용)가 필요하다.

**확인할 것**: `expo-auth-session` 공식 가이드 기준 리다이렉트 URI를 정확히 등록했는지 (여기서 막히면 가장 흔한 실패 지점)

---

## 작업 순서 — 프론트 (`roomi-app`, `feat/app` 브랜치)

### 5. 패키지 설치

`expo-auth-session`, `expo-web-browser`, `expo-secure-store`

### 6. `store/authStore.ts` — Zustand 스토어 (신규, 처음으로 Zustand 사용)

**목적**: 로그인 상태(`user`, `token`, `isLoggedIn`)를 앱 전체에서 공유

**정의**: 토큰은 `expo-secure-store`에 저장(메모리에만 두면 앱 재시작 시 로그아웃됨), 스토어는 그 토큰을 읽어와 상태로 노출. `login(token, user)`, `logout()` 액션 포함

### 7. `lib/api.ts` 수정 — 모든 요청에 토큰 첨부 + `loginWithGoogle` 함수 추가

**목적**: 기존 `getAccommodations` 등이 토큰을 자동으로 헤더에 붙이게 하고, 로그인 API 호출 함수도 추가

**확인할 것**: 토큰이 없는(비로그인) 상태에서 기존 화면(목록·상세)이 그대로 잘 동작하는지 — 그 둘은 인증 불필요 API라 토큰 없어도 되어야 함

### 8. 로그인 화면 (`app/login.tsx` 또는 적절한 위치)

**정의**: "Google로 로그인" 버튼 → `expo-auth-session`으로 OAuth 진행 → id_token 받으면 `loginWithGoogle` 호출 → 성공 시 `authStore.login()` → 홈으로 이동

---

## 완료 기준

```bash
npx tsc --noEmit   # 양쪽(roomi-api, roomi-app) 오류 0개
```

앱에서 Google 로그인 → 홈 화면으로 정상 이동 → 로그인 상태가 유지되는지(앱 재시작 후에도) 확인. 이후 찜하기/예약 화면 작업 시 이 로그인 상태를 그대로 사용.

---

## 보류 항목

- 카카오·네이버 로그인: Google 패턴 확인되면 동일하게 추가 (시간 남을 때)
- 로그아웃 시 백엔드에 별도 알릴 필요는 없음(JWT는 만료시간으로만 관리, 서버에 별도 무효화 로직 없음 — 포트폴리오 범위에서는 충분)
