# Phase 3 — Auth (NextAuth v5 + 다중 소셜 로그인 + 이메일)

> 완료된 Phase. 참고용 기록.

## 담당 도메인

Google · 카카오 · 네이버 OAuth 소셜 로그인 + 이메일/비밀번호 가입 + 세션 관리 + API 인증 미들웨어

---

## 전담 파일 경계

```
roomi-api/
├── lib/auth.ts                              → NextAuth 설정 (providers, callbacks, session)
├── app/api/auth/[...nextauth]/route.ts      → 소셜 로그인/로그아웃 Route Handler
├── app/api/auth/register/route.ts           → 이메일 회원가입
├── app/api/auth/verify-email/route.ts       → 이메일 인증 토큰 확인
├── app/api/auth/forgot-password/route.ts    → 비밀번호 재설정 메일 발송
├── app/api/auth/reset-password/route.ts     → 비밀번호 재설정
└── types/index.ts                           → Session 타입 확장 (기존 파일에 추가)
```

---

## 구현 우선순위

시간이 부족하면 뒤에서부터 제거한다.

1. **Google OAuth** ← 최우선
2. **카카오 OAuth**
3. **네이버 OAuth**
4. **이메일/비밀번호** ← 가장 나중

---

## 도메인 핵심 규칙

### 소셜 로그인 공통
- NextAuth v5 Provider 방식 사용: `GoogleProvider`, `KakaoProvider`, `NaverProvider`
- 최초 소셜 로그인 시 DB에 User 자동 생성 → `callbacks.signIn`에서 upsert 처리
- 세션에 `userId` 포함 필수 → `callbacks.jwt`, `callbacks.session`에서 추가

### 이메일/비밀번호
- 비밀번호는 반드시 `bcrypt`로 해싱 후 저장 (평문 저장 절대 금지)
- 회원가입 시 이메일 인증 토큰 발송 → 인증 완료 전 로그인 차단
- 비밀번호 재설정 토큰 유효시간: 1시간
- 이메일 발송은 `nodemailer` 또는 외부 SMTP 서비스 사용

### 세션 전략
- `strategy: "jwt"` — DB 세션 없이 JWT 토큰만 사용
- 토큰 만료: 기본값(30일) 사용

### 인증 확인 유틸
- `requireAuth()` — 로그인 필요한 API에서 세션 확인 후 userId 반환
- 미인증 시 `401 UNAUTHORIZED` 반환 (`lib/errors.ts`의 `ErrorCode.UNAUTHORIZED` 사용)
- 모든 인증 필요 API는 반드시 이 유틸 사용 — 직접 세션 확인 금지

### NextAuth v5 주의사항
- `getServerSession()` 사용 금지 → `auth()` 함수 사용
- Route Handler export 형식: `export const { handlers, auth, signIn, signOut } = NextAuth(config)`
- `handlers.GET`, `handlers.POST` 를 route.ts에서 export

---

## 환경변수 (lib/env.ts에 추가)

```
# NextAuth
NEXTAUTH_SECRET
NEXTAUTH_URL

# Google OAuth
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET

# 카카오 OAuth
KAKAO_CLIENT_ID
KAKAO_CLIENT_SECRET

# 네이버 OAuth
NAVER_CLIENT_ID
NAVER_CLIENT_SECRET

# 이메일 (이메일 인증 구현 시)
EMAIL_SERVER_HOST
EMAIL_SERVER_PORT
EMAIL_SERVER_USER
EMAIL_SERVER_PASSWORD
EMAIL_FROM
```

---

## 구현 순서

1. `lib/env.ts` — Auth 환경변수 추가 (구현할 provider만)
2. `lib/auth.ts` — NextAuth 설정 (GoogleProvider 먼저, 나머지 순차 추가)
3. `app/api/auth/[...nextauth]/route.ts` — GET/POST handler export
4. `app/api/auth/register/route.ts` — 이메일 가입 (이메일 인증 구현 시)
5. `app/api/auth/verify-email/route.ts` — 이메일 인증 토큰 확인
6. `app/api/auth/forgot-password/route.ts` — 재설정 메일 발송
7. `app/api/auth/reset-password/route.ts` — 비밀번호 재설정
8. `.env` — 환경변수 값 직접 입력 (사용자 직접)
9. `npx tsc --noEmit` — 타입 오류 없음 확인

---

## 의존 관계

- `lib/prisma.ts` — User upsert에 사용
- `lib/errors.ts` — `ErrorCode.UNAUTHORIZED` 사용
- `lib/api-response.ts` — `apiError()` 응답 포맷

---

## 금지 사항

- `process.env` 직접 접근 금지 → `lib/env.ts` 경유
- `getServerSession()` 사용 금지 (NextAuth v4 방식)
- 비밀번호 평문 저장 금지 → 반드시 bcrypt 해싱
- 세션에서 userId 없이 DB 조회 금지
- `.env` 파일 직접 읽기·수정 금지
