# roomi-app 개발 로그

> GitHub 공개. 완료 항목·기술 결정만 기록.

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
- [x] 용어 동기화: `CLAUDE.md`, `CLAUDE.local.md`, `phase9-first-screen.md`, PRD(`v9`) 전부 "상승률"→"변동률"
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

### 커밋 + push 완료 — `5548746`

### Phase 12 — 인증 설계 완료 (`phase12-auth.md`)

- 백엔드 `requireAuth()`가 쿠키(웹) 전용이라 RN 앱은 그대로 못 씀 → 모바일 전용 토큰 발급 라우트 신규 추가 + `requireAuth()` 확장(쿠키 또는 Bearer 토큰)으로 결정
- Google 1개 provider로 먼저 정식 OAuth 구현, 카카오·네이버는 패턴 확인 후 추가
- 백엔드(jose 설치, 신규 라우트, requireAuth 확장) + 외부설정(Google Console) + 프론트(authStore, api.ts 토큰 첨부, 로그인 화면) 순서로 정의

### Phase 12 구현 방식 최종 확정 — 단순 버전 유지

더 정교한 패턴(Account 재사용, RefreshToken 회전)을 검토했으나, 마감 대비 위험이 커서 단순 버전(JWT 1개, 회전 없음)으로 최종 확정.

### 다음

1. Phase 12 구현 착수 (다음 세션 — 야간 또는 주말 가능), `phase12-auth.md` 설계 그대로

---

## 260621 — Phase 12 프론트(인증) 전체 완료

### Phase 12 프론트 완료 ✅

| 파일 | 내용 |
|---|---|
| `types/index.ts` | `User` 타입 추가 |
| `lib/env.ts` | `GOOGLE_CLIENT_ID` 환경변수 검증 추가 |
| `store/authStore.ts` | 신규 — Zustand 인증 상태(`token`, `user`, `isLoggedIn`), 첫 Zustand 사용 |
| `lib/storage.ts` | 신규 — 플랫폼별 저장소 분기(웹: `localStorage`, 네이티브: `expo-secure-store`) |
| `lib/api.ts` | `loginWithGoogle()` 추가, 기존 함수에 토큰 헤더 자동 첨부 |
| `app/_layout.tsx` | 앱 시작 시 저장된 로그인 복원, `login` 라우트 등록 |
| `app/login.tsx` | 신규 — `expo-auth-session` 기반 Google 로그인 화면 |

### 외부 설정

- Google Cloud Console에 신규 프로젝트(`roomi-mobile`) 생성, OAuth 동의 화면 설정, 웹 애플리케이션 타입 OAuth 클라이언트 ID 발급, 테스트 사용자 등록 완료

### 에러 3건 해결 (상세는 error-log.md 참고)

1. `expo-secure-store`가 웹에서 동작하지 않는 문제 → `lib/storage.ts`로 플랫폼 분기
2. Google OAuth `code_challenge_method` 파라미터 거부 → `usePKCE: false` 설정
3. 백엔드(`roomi-api`) `.env`에 NextAuth 관련 환경변수 누락으로 서버 기동 실패 → 환경변수 추가로 해결

### 최종 검증

- 브라우저 `localStorage`에 `token`(JWT), `user`(DB 데이터) 정상 저장 확인
- 새로고침 후에도 로그인 상태 유지 확인

**Phase 12 전체(백엔드+프론트) 완료**

### 다음

1. 예약(객실 선택 → 예약 생성 화면)
2. 내 예약(목록·취소), 찜하기
3. 필터/검색, 디자인 통일은 진행 상황 보고 결정

---

## 260621 — Phase 13 예약(객실 선택 → 예약 생성) 완료

### Phase 13 완료 ✅

| 파일 | 내용 |
|---|---|
| `docs/features/phase13-booking.md` | 기능 정의 문서 |
| `types/index.ts` | `Booking` 타입 추가 |
| `lib/api.ts` | `createBooking()` 추가 |
| `app/accommodation/[id].tsx` | 객실 항목에 "예약하기" 버튼 추가, `/booking/[roomId]`로 이동 |
| `app/booking/[roomId].tsx` | 신규 — 예약 생성 화면 |

### 기술 결정

- 날짜 선택 UI를 텍스트 직접 입력에서 `react-native-calendars`의 캘린더 클릭 방식으로 변경(사용자 요청) — 체크인/체크아웃을 두 번의 탭으로 선택, `markingType="period"`로 선택 범위를 시각적으로 표시
- 인원수만 React Hook Form + Zod로 검증, 날짜는 캘린더 선택 상태(`useState`)로 별도 관리
- 객실 단건 조회 API가 없어 상세 화면이 가진 객실 정보(이름·가격·최대인원)를 라우트 쿼리 파라미터로 전달

### 검증

- 실제 예약 생성 후 `npx prisma studio`로 `Booking` 테이블에 행 생성 확인

### 다음

1. 내 예약(목록·취소)
2. 찜하기
3. 필터/검색, 디자인 통일은 진행 상황 보고 결정

---

## 260621 — Phase 14 내 예약(목록·취소) 완료

### Phase 14 완료 ✅

| 파일 | 내용 |
|---|---|
| `docs/features/phase14-my-bookings.md` | 기능 정의 문서 |
| `types/index.ts` | `BookingWithDetails` 추가 |
| `lib/api.ts` | `getBookings()`, `cancelBooking()` 추가 |
| `hooks/useMyBookings.ts` | 신규 |
| `app/(tabs)/my-bookings.tsx` | 신규(기존 미사용 `explore.tsx` 대체) |
| `app/(tabs)/_layout.tsx` | 탭 이름·아이콘 변경 |
| `components/ui/icon-symbol.tsx` | 아이콘 매핑에 `calendar` 추가 |
| `app/booking/[roomId].tsx` | 예약 성공 후 이동 경로를 내 예약 화면으로 변경 |

### 기술 결정

- 취소 버튼은 `useMutation`(첫 사용) + `queryClient.invalidateQueries`로 처리 — 취소 성공 시 목록 쿼리를 무효화해 자동 재조회
- `useMutation`을 쓰는 행(`BookingRow`)을 별도 컴포넌트로 분리 — `FlatList`의 `renderItem` 콜백 안에서 훅을 직접 호출할 수 없어서

### 에러 1건 해결 — NativeWind `disabled:` 변형이 웹에서 적용 안 됨

`Pressable`이 웹에서 `<div>`로 렌더링되어 `disabled:opacity-40` 같은 스타일이 적용되지 않음(`disabled` HTML 속성이 없는 요소라 셀렉터가 안 걸림). 상태에 따라 className을 직접 분기하는 방식으로 수정. 상세: error-log.md 참고

### 검증

- 예약 생성 → 내 예약 탭에 목록 표시 확인
- 취소 버튼 클릭 → 상태가 "취소됨"으로 즉시 바뀌고 버튼 비활성 스타일 적용 확인

**Phase 14 완료**

### 다음

1. 찜하기
2. 필터/검색, 디자인 통일은 진행 상황 보고 결정

---

## 260621 — Phase 15 찜하기 완료

### Phase 15 완료 ✅

| 파일 | 내용 |
|---|---|
| `docs/features/phase15-wishlist.md` | 기능 정의 문서 |
| `types/index.ts` | `Wishlist` 타입 추가 |
| `lib/api.ts` | `getWishlists()`, `addWishlist()`, `removeWishlist()` 추가 |
| `hooks/useWishlists.ts` | 신규 |
| `components/WishlistButton.tsx` | 신규 — 하트 토글 버튼 |
| `app/(tabs)/index.tsx`, `app/accommodation/[id].tsx`, `app/(tabs)/wishlist.tsx` | 하트 버튼 배치 |
| `app/(tabs)/_layout.tsx`, `components/ui/icon-symbol.tsx` | "찜 목록" 탭 추가 |

### 기술 결정

- 숙소가 찜됐는지 여부는 별도 API 필드 없이, 찜 목록 전체를 캐시(`useWishlists`)에서 `some()`으로 확인하는 방식 채택 — TanStack Query 캐시 공유로 중복 호출 방지
- `useWishlists()`에 `enabled: isLoggedIn` 적용 — 비로그인 상태에서 카드마다 불필요한 401 요청 방지

### 에러 1건 해결 — 하트 버튼이 카드 이동(Link) 안에 중첩되어 탭 시 상세로 이동해버림

처음에 하트 버튼을 카드 이동 영역(`Link`→`Pressable`) **안에** 배치해서, 하트를 눌러도 상세 화면으로 함께 이동하는 문제가 있었음(`event.stopPropagation()`으로도 해결 안 됨 — 웹에서 `Link`가 `<a>` 태그로 렌더링되어 기본 이동 동작까지 막아야 했음). 구조를 바꿔서 하트 버튼을 이동 영역의 **형제(sibling)**로 분리(`AccommodationCard`에서 버튼 제거 → 호출하는 화면에서 `View` 하나로 감싸고 `Link`와 `WishlistButton`을 나란히 배치) — 홈 화면, 찜 목록 화면 둘 다 동일하게 적용. 상세: error-log.md 참고

### 검증

- 홈/상세/찜 목록 화면에서 하트 토글이 서로 동기화되어 반영됨 확인
- 하트 클릭 시 상세 이동 없이 찜 추가/제거만 동작함 확인

**Phase 15 완료 — 핵심 플로우(인증→예약→내예약→찜하기) 전체 완료**

### 다음

1. 필터/검색, 디자인 통일은 진행 상황 보고 결정

---

## 260622 — Phase 16 검색·필터·정렬·페이지네이션 착수

### Phase 16 설계 완료

- `docs/features/phase16-search-filter.md` 작성 완료
- 범위 확정: 지역/체크인/체크아웃/인원 검색(실제 가용성 체크) + 숙박 종류 필터 + 정렬(변동률/가격 토글) + 페이지네이션
- 정렬 옵션을 변동률 단독에서 "가격 낮은순" 추가로 확장 결정(`SortSelector` 토글 UI 필요)
- 선행 작업으로 `feat/api`에 Phase 7(검색 가용성 필터) 먼저 구현·커밋·push 완료 (`599b529`, `6bf4a9e`) — `curl` 한글 인코딩 이슈로 디버깅 우회(코드 버그 아님, 테스트 명령어 문제)

### Phase 16 구현 완료

- `types/index.ts`(`AccommodationFilters`, `PaginatedAccommodations`), `lib/api.ts`(`getAccommodations`가 필터 받아 쿼리스트링 빌드), `hooks/useAccommodations.ts`(필터를 `queryKey`에 포함), `components/SearchBar.tsx`/`FilterSheet.tsx`/`SortSelector.tsx`/`Pagination.tsx`(전부 신규), `app/(tabs)/index.tsx`(전부 조합, 필터 변경 시 `page: 1` 리셋) 전부 작성
- `npx tsc --noEmit` 오류 0개 확인

### 수동 검증 — 일부만 가능, 한계를 기록

- 지역 검색, 숙박 종류 필터, 정렬(변동률/가격) 토글, 페이지네이션(이전/다음) — Expo 웹에서 정상 동작 확인
- 날짜(체크인/체크아웃) 가용성 필터의 "제외 동작"(겹치는 예약이 있으면 숙소가 목록에서 빠지는 것)은 **시각적으로 확인하지 못함** — 시드 데이터의 모든 숙소가 객실을 2개씩 갖고 있어서, 한 객실만 예약된 상태로는 다른 객실이 항상 비어있어 숙소가 절대 안 사라짐(필터 로직상 정상 동작이지만 이 데이터로는 입증할 시나리오 자체가 없음)
- 대안으로 같은 숙소의 두 번째 객실에 임시 예약을 추가해 완전히 막아보는 방법을 검토했으나, Prisma Studio 관계 탐색이 복잡해서 보류 — 대신 다음 근거로 논리적 검증 처리: (1) `region`/`guests` 단독 필터는 Phase 7에서 `curl`로 이미 실제 검증됨 (2) 날짜 겹침 조건(`bookings.none`+`gte`/`lt`/`gt`)은 이미 검증된 것과 동일한 Prisma 관계 필터 패턴을 객실 하위 관계에 적용한 것 (3) `checkIn` 단독 전송 시 `400` 검증 로직은 동작 확인됨
- 결론: 코드 리뷰 + 부분 동작 확인으로 충분하다고 판단, Phase 16 완료로 처리. 시간 여유가 생기면 임시 예약으로 완전 검증하는 걸 과제로 남김

---

## 260622 — Phase 17 디자인 통일 착수

### Phase 17 설계 완료

- `docs/features/phase17-design-unification.md` 작성 완료
- 조사 결과: `AccommodationCard`/`PriceChangeBadge`/숙소 상세 화면이 Phase 9 뼈대 그대로 거의 스타일 없는 상태였음을 확인(기능은 완성됐지만 디자인은 처음부터 입힌 적이 없었음)
- 가격(취소선 평소가+현재가)+변동률 배지 레이아웃이 카드·상세·찜목록 3곳에서 동일하게 반복 — 공유 컴포넌트(`PriceBlock`)로 추출 결정
- `disabled:opacity-50` 버그(웹에서 `Pressable`이 `<div>`로 렌더링되어 안 먹힘)가 `login.tsx`/`booking/[roomId].tsx`에 아직 남아있는 것 확인 — 이번에 같이 수정

### Phase 17 구현 완료 — 디자인 통일

- `PriceBlock.tsx`(신규, 가격+배지 공유 컴포넌트), `PriceChangeBadge.tsx`(패딩·모서리·텍스트 색 추가), `AccommodationCard.tsx`(카드 컨테이너 스타일 재작성), `app/accommodation/[id].tsx`/`app/(tabs)/wishlist.tsx`(`PriceBlock` 적용), `app/login.tsx`/`app/booking/[roomId].tsx`(`disabled:opacity-50` 버그 수정), `components/SearchBar.tsx`/`app/booking/[roomId].tsx`(입력창 모서리 `rounded` → `rounded-lg` 통일) 전부 작성
- `npx tsc --noEmit --watch`로 작업 중 실시간 점검(사용자 요청), Expo 웹에서 홈/상세/찜목록/내예약 화면 스타일 정상 확인

### 기능 누락 발견 — 로그아웃 버튼이 화면 어디에도 없었음

- 사용자가 로그인 화면 확인을 요청하다가 "로그아웃은 어디서 하냐"고 질문 → PRD 6.5 마이페이지(US-16, US-17, 흐름도에 "로그아웃" 명시)를 다시 확인한 결과, `authStore.ts`의 `logout()`은 Phase 12부터 있었지만 이걸 호출하는 UI 버튼이 어느 화면에도 없었던 걸 발견
- 사용자가 야놀자 앱 참고 화면(하단 탭: 지역/내주변/홈/찜/마이 — 찜과 마이가 별도 탭) 제시 → "마이" 탭을 4번째로 신규 추가하는 방향으로 결정
- `components/ui/icon-symbol.tsx`(`person.fill` 매핑 추가), `app/(tabs)/mypage.tsx`(신규 — 로그인 정보 표시 + 로그아웃), `app/(tabs)/_layout.tsx`(탭 추가) 작성

### 에러 1건 해결 — `Alert.alert()`가 웹에서 버튼 눌러도 반응 없음

`Alert.alert()`는 네이티브 전용 시스템 다이얼로그라 웹(react-native-web)에서는 다이얼로그 자체가 안 뜨고 에러도 없이 조용히 무시됨(`expo-secure-store`, `disabled:` 패턴과 같은 종류의 "네이티브 전용 API" 문제). `Platform.OS === "web"`으로 분기해서 웹은 `window.confirm()`을 쓰도록 수정, 실제 로그아웃 처리(`doLogout`)는 함수로 분리해서 양쪽에서 재사용. 상세는 `docs/log/study-log.md` 260622 항목 참고

### 검증 완료
- 마이 탭에서 로그인 정보 표시, 로그아웃 → 로그인 화면 이동까지 실제 동작 확인

**Phase 17 완료 — 디자인 통일 + 로그아웃 기능 누락 보완**

---

## 260622 — Phase 18 홈 화면 레이아웃 재구성 (야놀자 참고) + PRD 대조 사건

### PRD 위반 발견

Phase 18 진행 중 "검색하면 메인화면이 그대로 나온다"는 게 이상해서 PRD를 다시 펼쳐 대조한 결과, PRD 7.1·8.2·8.3에 "홈 → 검색 결과(별도 화면) → 상세"가 명확히 적혀 있었는데 그걸 확인 안 하고 홈 화면 자체가 필터링되는 구조로 임의 설계했던 것을 발견. PRD 전체를 다시 대조해서 추가로 발견한 차이:
- 정렬 옵션에 "평점 높은순" 빠짐(PRD는 3가지: 가격변동률/현재가격/평점)
- 예약 취소에 확인 모달 없음(PRD 8.4, US-13 "확인 모달 필수")
- 추천 캐로셀 6개 vs 구현 5개(F-002)
- 필터(하단시트→아이콘행), 페이지네이션(이전/다음→무한스크롤), 홈 화면 범위(검색바+추천만→카테고리+정렬+전체목록까지) — 이 3개는 오늘 사용자가 야놀자 참고로 명시적으로 정한 방향이라 PRD를 v10으로 개정하는 쪽으로 결정(코드 유지). 사용자가 PRD 개정 지시문은 직접 별도 도구(웹)에 맡기기로 함

### Phase 18 구현 — 레이아웃 재구성

- `app/search-results.tsx` 신규 — 검색 결과 전용 화면(캐로셀·카테고리 없이 목록+정렬만), `SearchBar`의 검색 버튼이 `router.push({pathname:"/search-results", params:{...}})`로 이동하도록 변경
- `app/(tabs)/index.tsx` 재구성 — GNB(로고+검색버튼+돋보기 아이콘) → 캐로셀("베스트 딜") → 카테고리 아이콘 → 정렬 → 2열 그리드(무한스크롤)
- `components/CategoryIcons.tsx` 신규(`FilterSheet.tsx` 대체, 삭제), `components/Pagination.tsx`도 무한스크롤 도입으로 삭제
- `hooks/useAccommodations.ts`를 `useInfiniteQuery`로 전환

### 디자인 반복 수정

- 카테고리 아이콘 "전체" 이모지 교체, 크기 조정 2회, 선택 시 배경색 제거(텍스트만 강조)로 최종 정리
- 정렬 탭을 박스形 → 텍스트 전용(세그먼트 컨트롤 시도 후 최종 텍스트만)으로 단순화, 색상도 파란색→검은색
- `disabled:` 패턴과 같은 종류의 신규 버그: 검색 모달 X 버튼이 부모의 기본 `alignItems: stretch`로 풀폭 늘어나 포커스 테두리가 화면 너비만큼 길게 보임 → `self-start`로 해결
- 메인 컬러를 `blue-500`(할인 배지와 색 겹침)에서 `sky-500`로 전체 교체(로고, 링크, 그라데이션 버튼, 선택 상태, 캘린더 선택색 등) — 할인 배지(`PriceChangeBadge`)의 `blue-500`은 의미 색상이라 그대로 유지
- 전체 주요 버튼에 그라데이션 적용(`components/GradientButton.tsx` 신규, `expo-linear-gradient` 설치) — 이후 로그인 유도 버튼들은 "어떤 방식으로 로그인할지 모른다"는 지적으로 `components/GoogleButton.tsx`(흰 배경+Google 브랜드 색 G 아이콘)로 재교체
- 화면 배경 회색 문제: `@react-navigation` `DefaultTheme.colors.background`가 옅은 회색 — `app/(tabs)/_layout.tsx`의 `sceneStyle`에 흰 배경 지정으로 일괄 해결
- 캐로셀(`AccommodationCarousel.tsx`) 대대적 재작업 — ① 가로 스크롤 카드 여러 개 나열(1차) → ② "1개씩만, 자동 전환 4초+좌우 버튼" 요청으로 배너형 단일 카드 구조로 전환 → ③ "Steam 스타일 아니라 야놀자 배너처럼 이미지 꽉 채우고 텍스트 오버레이" 요청으로 풀블리드 배너 디자인으로 재작업 → ④ 카테고리/정렬 바꿀 때 캐로셀이 같이 깜빡이는 버그(매번 새 배열·새 엘리먼트 생성이 원인) → `useMemo`로 고정해 해결 → ⑤ 전환 효과 슬라이드(`translateX`) 시도했으나 "부자연스럽다"는 피드백으로 페이드(`opacity`)로 최종 정리
- 버그 2건: `Animated.View`에 NativeWind `className`(높이 등)이 안 먹혀서 레이아웃 찌그러짐 → 일반 `View`로 레이아웃 분리, `Animated.View`는 `style`로 애니메이션 값만; 캐로셀 이미지 박스에 준 `px-4`가 같은 엘리먼트의 배경색과 겹쳐 양옆에 회색 띠로 보임 → 패딩을 바깥 래퍼로 분리

### PRD 누락 사항 보완 (실제 기능, Phase 18과 별개로 처리)

- `feat/api`: `accommodations` 라우트 `orderBy`에 `sort === "rating"`일 때 내림차순(`desc`) 분기 추가(나머지는 `asc` 유지)
- `components/SortSelector.tsx`/`types/index.ts`: 정렬 옵션에 "평점 높은순"(`rating`) 추가
- `app/(tabs)/my-bookings.tsx`: 예약 취소 버튼에 확인 모달 추가(`Platform.OS` 분기, `Alert.alert`/`window.confirm` 패턴 재사용)
- 캐로셀 표시 개수 5 → 6개(F-002 명시값에 맞춤)

### 이미지 추가 — picsum.photos 장애 우회

- 시드 데이터에 이미지가 전혀 없어 카드가 항상 회색 빈 박스였던 것을 발견 → `roomi-api/prisma/backfill-images.ts` 신규(기존 데이터 보존하며 `images` 필드만 업데이트), `seed.ts`도 향후 신규 시드 대비 동기화
- 1차로 picsum.photos 사용 시도 → 서비스 자체 장애(Cloudflare 522)로 전부 실패, 원인이 우리 코드가 아님을 `curl -sI`로 확인 → `placehold.co`로 교체
- 2차로 한글 텍스트(숙소명)를 이미지에 새기려다 placehold.co가 한글 폰트 미지원으로 깨짐(`motel 12??`) → 텍스트 없이 숙박 종류별 색상 블록(`hotel`=파랑, `motel`=주황, `pension`=초록, `resort`=시안)으로 최종 정리

### 다음
1. 마감 2026-06-24, 남은 가용일 23·24
2. 시간 남으면: 카카오·네이버 모바일 로그인, 날짜 가용성 필터 완전 검증
3. PRD v10 갱신은 사용자가 별도로(웹 도구) 진행 — 코드와 PRD가 다시 동기화됐는지 다음 세션 시작 시 확인할 것

---

## 260622 (이어서) — PRD v10 적용, 화면 다듬기, 소셜 로그인 버튼, 숙소 이미지

### PRD v9 → v10 검토 및 정리
- 사용자가 별도 도구(웹)로 만든 PRD v10(`.md`+`.html`)을 검토 — 요청한 3가지(홈 화면 설명, 필터 정책, F-006)는 정확히 반영됐으나, 그 영향으로 생긴 연쇄 불일치(검색결과 화면 설명에 "필터" 잔존, 폴더구조 컴포넌트 목록에 삭제된 `FilterSheet`/`Pagination` 잔존) 3건 발견 → `.md`와 `.html` 둘 다 직접 수정
- v9(`.md`+`.html`)는 `docs/prd/history/`로 이동

### 내 예약·찜 목록·숙소 상세 화면 디자인 (야놀자 참고)
- `wishlist.tsx`: 인라인 텍스트 행 → 홈 화면과 동일한 `AccommodationCard`(grid 변형) 2열 그리드로 재사용 교체
- `my-bookings.tsx`: 텍스트 전용 행 → 좌측 숙소 사진 + 우측 정보(상태 배지, 날짜, 가격, 취소 버튼) 카드형으로 재구성
- `accommodation/[id].tsx`: 상단에 큰 히어로 이미지 추가(기존엔 사진이 전혀 없었음), 평점에 별 아이콘 추가, 객실 목록을 그림자 카드로 재구성

### 소셜 로그인 버튼 3종 신규
- `GoogleButton`/`KakaoButton`/`NaverButton` — 사용자가 제시한 참고 이미지(흰/노란/초록 브랜드 컬러) 그대로 구현
- 1차: 아이콘 폰트(FontAwesome5)·SVG 직접 그리기 시도 → 구글은 4색 로고라 단색 아이콘 폰트로 표현 불가능, 사용자가 실제 PNG 파일을 직접 제공하는 방식으로 전환
- 카카오·네이버 PNG는 투명 배경(alpha)이 없는 파일이었던 걸 `sips -g hasAlpha`로 확인 — 코드로는 투명하게 못 만든다고 안내, 사용자가 파일 재교체
- 로그인 화면: 구글만 실제 동작(`promptAsync`), 카카오·네이버는 버튼만(눌러도 "준비 중" 안내) — PRD상 P1 보류 항목과 일치
- 로그인 화면 다듬기: 상단 헤더("로그인" 타이틀+구분선) 제거, "Roomi 로그인" 텍스트 메인 컬러(`sky-500`)로 변경 + 크기 키움, 하단 리다이렉트 URI 디버그 텍스트 제거

### 숙소 이미지 — 종류별 실제 사진 적용
- 기존 DB의 `images` 필드(picsum→placehold.co 색상블록)를 프론트에서 더 이상 안 쓰고, 숙박 종류별 로컬 이미지(`assets/images/{type}-{n}.jpg`)로 전환 — 백엔드 데이터 안 건드리고 프론트에서만 처리해 외부 서비스 의존성 제거
- 1차: 종류당 1장 → 사용자 요청으로 종류당 4장씩(총 16장)으로 확장, 숙소 ID를 해시(`hashString % 길이`)해서 항상 같은 숙소는 같은 사진이 나오게 분배(`lib/typeImages.ts`)
- 이미지 레이아웃 버그 반복 발생 — 비율이 서로 다른 사진(1.28~2.38)을 카드/캐로셀/상세/내예약 4곳에 넣는 과정에서 `className`만으로 크기를 주면 중첩 구조(Animated.View, Link/Pressable)에 따라 깨지는 문제가 재발 → **컨테이너 고정 높이(style)+이미지 width/height 100%+resizeMode cover**로 전부 통일, 그림자 박스와 overflow-hidden 박스도 다시 분리

### 다음
1. 마감 2026-06-24, 남은 가용일 23·24
2. 시간 남으면: 카카오·네이버 실제 OAuth 연동, 날짜 가용성 필터 완전 검증

---

## 260622 (이어서) — 전체 플로우 점검: 로그아웃 버그, 비로그인 리다이렉트, 헤더 통일

### 발견·수정

| 항목 | 내용 |
|---|---|
| 로그아웃 시 로그인 화면에 갇히는 버그 | `mypage.tsx`의 `doLogout()`이 로그아웃 후 `router.replace("/login")`을 강제 호출해 빠져나갈 방법이 없었음(PRD US-02 "비로그인도 둘러보기" 위반) — 강제 이동 제거 |
| 비로그인 시 안내화면 → 즉시 리다이렉트 | 마이/내예약/찜목록 3개 탭의 "로그인이 필요합니다" 중간 화면 제거, `useEffect`로 `/login` 즉시 이동(`GoogleButton` import도 같이 제거) |
| 런타임 에러 | "Attempted to navigate before mounting the Root Layout component" — 앱 시작 시 `restore()` 끝나기 전에 리다이렉트 시도해서 발생 → `useRootNavigationState()`로 라우터 준비 여부 확인하는 가드 추가 |
| 로그인 화면 헤더 통일 | 로고→화살표→로고로 왔다갔다 하던 커스텀 헤더를 다른 Stack 화면(상세·예약·검색결과)과 동일한 기본 헤더(자동 화살표)로 통일 — `app/_layout.tsx`의 `Stack.Screen` 옵션 지정, 화면 안 커스텀 버튼 제거 |
| `BackButton` 신규 컴포넌트 | `components/BackButton.tsx` — `router.canGoBack()` 확인 후 `back()`/`replace(fallbackHref)` 분기, 내예약·찜목록 탭 헤더(`headerLeft`)와 로그인 화면에 적용 |
| 탭 헤더 일괄 추가 시도 → 롤백 | 탭 4개에 로고 헤더를 일괄 추가했다가 "로고는 메인에만, 다른 곳은 화살표"로 정정 받아 롤백(`AppHeader.tsx` 삭제) |

### 검증

- 로그아웃 → 마이 화면이 "로그인이 필요합니다" 거치지 않고 바로 로그인 화면으로 이동 확인
- 로그인 화면에서 뒤로가기(`BackButton`) 동작 확인
- 내예약·찜목록 탭 헤더에 뒤로가기 버튼 정상 표시 확인

### 다음
1. 마감 2026-06-24, 남은 가용일 23·24
2. 검색→상세→예약→취소→찜하기 전체 플로우 점검 이어서(로그인/로그아웃/탭 전환은 확인 완료)
3. 시간 남으면: 카카오·네이버 실제 OAuth 연동, 날짜 가용성 필터 완전 검증

---

## 260623 — 전체 플로우 점검(검색→상세→예약→취소→찜하기), 버그 3건 발견·수정

### 점검 방식

헤드리스 브라우저(Playwright)로 Expo 웹의 비로그인/로그인 양쪽 플로우를 자동 클릭 검증, 로그인 상태는 토큰을 별도 브라우저 세션의 localStorage에 주입해서 재현

### 점검 완료 — 정상 확인

- 홈(캐로셀·카테고리·그리드·무한스크롤), 검색 모달→지역 선택→검색결과 화면 분리, 카드→상세 이동, 카테고리 필터·정렬(변동률 오름차순) 전부 정상
- 상세→예약하기(비로그인 시 `/login` 이동)→로그인 화면 뒤로가기 정상
- 예약 생성(날짜 캘린더 선택→인원 입력→제출)→내예약 목록 반영→취소 확인모달→상태 변경 정상
- 찜토글(홈에서 추가)→찜목록 탭 동기화 정상

### 버그 3건 발견·수정 (상세는 error-log.md 260623 항목 3건 참고)

| 버그 | 원인 | 수정 |
|---|---|---|
| 내예약 탭 비로그인 시 401 요청 | `useMyBookings.ts`에 `useWishlists.ts`와 같은 `enabled: isLoggedIn` 가드 누락 | 가드 추가 |
| 로그인 상태에서 보호된 탭(마이/내예약/찜목록) 새로고침 시 강제 로그아웃 | `useRootNavigationState()`만으론 `authStore.restore()`(토큰 복원) 완료 여부를 확인 못 함 — 라우터 준비가 복원보다 먼저 끝나는 race | `authStore`에 `isRestoring` 플래그 추가, 리다이렉트 가드에 체크 추가 |
| 예약 화면 새로고침 시 강제 로그아웃(같은 race) + `Alert.alert()` 웹 무반응(날짜중복·검증실패·예약완료 메시지 전부 안 뜸) | `booking/[roomId].tsx`에 `isRestoring` 가드 미적용 + 기존에 고친 `Platform.OS` 웹 분기 패턴이 안 적용돼 있었음 | `isRestoring` 가드 추가, `notify()` 헬퍼로 웹 분기 추가 |

### 다음
1. 마감 2026-06-24, 남은 가용일 24
2. 핵심 플로우(인증→검색→상세→예약→취소→찜하기) 전체 검증 완료 — 남은 시간은 카카오·네이버 실제 OAuth, 날짜 가용성 필터 완전 검증 중 선택
3. 예약 화면 캘린더 `markingType="period"`가 체크인·체크아웃 사이 날짜를 시각적으로 안 채워주는 것 발견(기능엔 영향 없음, 다음에 디자인 다듬을 시간 있으면 참고)

## 260623 (이어서) — UI 다듬기 + 예약 인원 검증 보강

### 완료
- [x] 로그인 화면 헤더 하단 테두리 제거(`headerShadowVisible: false`)
- [x] `BackButton`에 `forceHome` prop 추가 — 로그인 화면은 이동 히스토리 무시하고 항상 메인으로 이동
- [x] "찜 목록" 탭 명칭을 "위시리스트"로 변경(탭 타이틀 + 빈 목록 안내문구)
- [x] 마이 탭에도 다른 탭과 동일한 뒤로가기 헤더 추가
- [x] 예약 인원 입력에 최대 인원 검증 추가 — `GuestsFormSchema`를 모듈 상수에서 `createGuestsFormSchema(maxGuests)` 함수로 변경, `useMemo`로 라우트 파라미터 기준 동적 생성
- [x] 홈 화면 로고 탭 시 메인으로 이동(`Pressable` + `router.push("/")`)
- [x] `npx tsc --noEmit` 오류 0개

### 남은 항목
- 예약 중복 생성 가능성(동시 요청 시 race condition 의심) — 재현 조건 확인 중
- 상세·검색결과 화면에 하단 탭 메뉴 노출(현재 탭 그룹 바깥 화면이라 구조 변경 필요)
- 우측 하단 스크롤 이동 버튼, 커스텀 스플래시 화면 — 범위 미정, 시간 보고 결정

## 260623 (이어서) — UI 추가 수정 + 예약 중복 생성 버그 수정 + 하단 탭/스크롤버튼/스플래시 신규

### 되돌림
- [x] 로그인 화면 화살표를 "항상 메인으로"에서 원래 동작(`canGoBack()` 기반)으로 원복, `BackButton`의 `forceHome` prop 제거(미사용 코드 정리)

### 완료
- [x] 마이 탭 명칭 "마이" → "마이 페이지"
- [x] 예약 중복 생성 버그 수정(`roomi-api`, `app/api/bookings/route.ts`) — 동시 요청 시 둘 다 충돌 체크를 통과해서 같은 객실·날짜로 2건 생성될 수 있던 race condition을 `prisma.$transaction(..., { isolationLevel: Serializable })`로 해결, 동시 요청 2개로 직접 검증(하나만 200, 하나는 409)
- [x] `components/BottomTabBar.tsx` 신규 — 탭 그룹 바깥 화면(상세, 검색결과)에 하단 탭 메뉴 노출
- [x] `components/ScrollJumpButtons.tsx` 신규 — 우측 하단 위/아래 스크롤 이동 버튼(홈, 검색결과 화면에 적용)
- [x] `components/SplashScreen.tsx` 신규 — 앱 시작 시 1.2초간 브랜드 스플래시 화면 노출(`app/_layout.tsx`)
- [x] `npx tsc --noEmit` 오류 0개(앱·백엔드 둘 다)

### 남은 항목
- 캐로셀 드래그/스와이프 미지원 확인(타이머·버튼으로만 전환되는 구조, 모바일에서도 동일) — 개선 여부는 시간 보고 결정

## 260623 (이어서) — 하단 탭 디자인 통일

### 완료
- [x] 탭 화면 4개(Home/내예약/위시리스트/마이페이지)의 네이티브 탭바와 탭 그룹 바깥 화면(상세·검색결과)의 `BottomTabBar`가 서로 다른 디자인이던 것을 발견 — `Tabs`의 `tabBar` prop으로 네이티브 탭바를 `BottomTabBar`로 완전히 교체, 6개 화면이 진짜 같은 컴포넌트를 쓰도록 통일
- [x] 더 이상 안 쓰는 `tabBarIcon` 옵션, `HapticTab`/`Colors`/`useColorScheme` import 제거
- [x] `npx tsc --noEmit` 오류 0개, 6개 화면 스크린샷으로 디자인 일치 확인

## 260623 (이어서) — 예약화면 스크롤 누락 수정, 스크롤버튼 전체 화면 확장, 캐로셀 재작성, 스플래시 보강, 로그인 정렬 수정

### 완료
- [x] 예약 화면(`booking/[roomId].tsx`)에 콘텐츠가 화면보다 길어지면 하단 버튼이 잘리던 버그 수정 — `View`를 `ScrollView`로 교체(웹·모바일 공통으로 발생하는 문제였음)
- [x] `ScrollJumpButtons`(위/아래 스크롤 버튼)를 내예약·위시리스트·상세 화면에도 추가(기존엔 홈·검색결과에만 있었음) — 로그인 화면, 콘텐츠가 적은 마이 페이지는 제외
- [x] `AccommodationCarousel`을 타이머+opacity 페이드 방식에서 `ScrollView(horizontal, pagingEnabled)` 기반 가로 슬라이드로 재작성 — 손가락 드래그(모바일)·트랙패드 드래그(웹) 둘 다 지원, 좌우 버튼·4초 자동전환은 유지
- [x] 스플래시 화면에 숙소 타입 이미지 16장 중 랜덤 배경 추가, 문구를 "변동률 낮은 숙소를 가장 먼저"→"지금이 가장 합리적인 순간이에요"로 변경
- [x] 로그인 화면 — `headerTransparent: true`로 헤더가 콘텐츠 위에 떠 있게 변경해서 콘텐츠가 화면 전체 높이 기준 정중앙에 위치하도록 수정
- [x] `npx tsc --noEmit` 오류 0개

## 260623 (이어서) — 예약화면 무한루프 원인 발견, 캐로셀 라이브러리 교체, 헤더 공통 컴포넌트화

### 버그 수정 — 예약 화면 진입 시 "Maximum update depth exceeded"
- 증상: 홈 화면이 백그라운드에 떠 있는 상태로 상세→예약 화면까지 push하면 크래시(홈에서 새로고침 후 곧바로 예약 화면 URL로 들어가면 재현 안 됨)
- 원인: `booking/[roomId].tsx`에만 있던 `useRootNavigationState()` — 이 화면은 항상 다른 화면에서 push로 들어오기 때문에, 그 훅이 막으려던 "루트 레이아웃 마운트 전 네비게이션" 상황 자체가 발생할 수 없는 화면이었음. 자체 렌더링하던 `<Stack.Screen options={{...}}>`와 맞물려 재렌더링↔재구독 핑퐁이 발생
- 해결: `useRootNavigationState()` 제거(이 화면엔 불필요), `isRestoring` 가드만 유지. 헤더를 공통 컴포넌트로 옮기면서 `Stack.Screen` 자체 렌더링도 같이 제거됨
- 같은 시나리오 5회 연속 재현 테스트로 검증 완료(상세는 error-log.md 260623 항목 참고)

### 캐로셀 — 라이브러리 교체
- `react-native-reanimated-carousel` 설치, 자체 구현(타이머+`ScrollView`)을 교체 — 자동재생·루프 정상 동작 확인
- 드래그 동작은 헤드리스 브라우저로는 검증 불가(제스처 라이브러리는 실제 터치 이벤트가 필요) — 실기기 확인 필요

### 헤더 공통 컴포넌트화
- `components/AppHeader.tsx` 신규 — 모든 화면이 같은 높이(56px)의 헤더를 쓰도록 통일(기존엔 홈만 커스텀 GNB, 나머지는 네이티브 헤더로 높이가 서로 달랐음)
- 적용 화면 7곳: 홈(검색바 모드), 내예약·위시리스트·마이페이지·검색결과·상세·예약·로그인(타이틀+뒤로가기 모드)
- 모든 화면의 `headerShown`을 `false`로 변경, `Stack.Screen`/`Tabs.Screen`의 `title`/`headerLeft` 옵션 제거 — 헤더는 전부 화면 컴포넌트 안에서 직접 렌더링
- `npx tsc --noEmit` 오류 0개, 7개 화면 스크린샷으로 높이·스타일 일치 확인

## 260623 (이어서) — 헤더 로고·뒤로가기 좌측 정렬 통일

### 완료
- [x] `BackButton`이 44×44 고정 박스 안에서 아이콘을 중앙 정렬하다 보니, 박스 자체는 좌측에 붙어도 화살표 그림은 안쪽으로 들어가 보여 로고("Roomi")와 좌측 시작 위치가 어긋남 — `hitSlop`(터치 영역만 확장, 시각적 위치는 그대로) 방식으로 교체해서 해결
- [x] `AppHeader`의 타이틀-뒤로가기 간격을 `ml-1`→`ml-3`으로 재조정(아이콘이 더 이상 박스에 안 갇히면서 간격 기준이 바뀜)
- [x] `npx tsc --noEmit` 오류 0개

## 260623 (이어서) — 좌우 패딩 통일, 로그인 화면 헤더 바 제거

### 완료
- [x] 마이 페이지·예약 화면이 `px-6`(24px)을 쓰고 있어서 홈·상세 등 나머지 화면(`px-4`, 16px)보다 좌우 여백이 넓어 보이던 것 수정 — 전부 `px-4`로 통일
- [x] 로그인 화면은 `AppHeader`(테두리 있는 56px 바) 대신, 화살표(`BackButton`)만 좌상단에 단독으로 배치 — 다른 화면과 구분되는 의도적 디자인
- [x] `npx tsc --noEmit` 오류 0개

### 추가 수정 — 로그인 화면 정중앙 정렬
- [x] 화살표가 일반 흐름(flex)에 있어서 그 아래 "남은 공간" 기준으로만 중앙 정렬되던 문제 — 화살표를 `absolute`로 띄워서 본문이 화면 전체 높이 기준으로 정중앙에 오도록 수정
- [x] `npx tsc --noEmit` 오류 0개

## 260623 (이어서) — 헤더 2줄로 겹쳐 보이던 버그 수정

### 버그 수정
- 증상: 상세·예약·검색결과 화면에서 제가 만든 `AppHeader` 위에 라우트 파일명("accommodation/[id]" 등)을 제목으로 쓰는 또 다른 헤더 바가 겹쳐서 2줄로 보임
- 원인: 각 화면 안에서 직접 렌더링하던 `<Stack.Screen options={{...}}>`을 헤더 공통화 작업(`AppHeader`) 때 지웠는데, 루트 레이아웃(`app/_layout.tsx`)에는 그 라우트들의 `headerShown: false`를 추가하지 않았음 — 명시적으로 등록 안 된 라우트는 Expo Router가 기본 네이티브 헤더(라우트 파일명 그대로 제목)를 자동으로 띄움
- 해결: `app/_layout.tsx`의 `<Stack>`에 `screenOptions={{ headerShown: false }}`를 줘서 모든 라우트의 기본값을 "헤더 없음"으로 바꾸고, 정말 네이티브 헤더가 필요한 `modal` 라우트만 개별적으로 `headerShown: true` 재지정
- `npx tsc --noEmit` 오류 0개, 스크린샷으로 헤더 1줄만 남은 것 확인

## 260623 (이어서) — 실기기(Expo Go) 테스트 중 발견한 안전영역(safe area) 문제

### 버그 수정
- 증상: 실제 폰에서 화면 상단(상태바/노치)·하단(홈 인디케이터)에 콘텐츠가 가려지거나 잘림 — 웹 미리보기에서는 안전영역 자체가 없어서 못 보던 문제
- 원인: `AppHeader`/`BottomTabBar`/로그인 화면의 떠 있는 뒤로가기 버튼을 직접 만들면서 `useSafeAreaInsets()`를 안 챙김(네이티브 기본 헤더/탭바는 자동으로 처리해주던 부분이라 그동안 드러난 적이 없었음)
- 해결: `react-native-safe-area-context`의 `useSafeAreaInsets()`로 `AppHeader`는 `paddingTop: insets.top`, `BottomTabBar`는 `paddingBottom: insets.bottom`, 로그인 화면의 절대위치 화살표는 `top: insets.top + 16`으로 보정
- `npx tsc --noEmit` 오류 0개 — **웹 미리보기로는 검증 불가(안전영역 자체가 0이라 재현이 안 됨), 실기기 확인 필요**

## 260623 (이어서) — 상태바 아이콘 안 보임 + 로그인 버튼 추가 확대

### 버그 수정 — 상태바(시간·배터리) 아이콘이 안 보임
- 원인: `<StatusBar style="auto" />`가 폰의 시스템 다크모드 여부에 따라 아이콘 색을 자동으로 바꾸는데, 앱 화면은 항상 밝은 배경(흰색)으로 고정돼 있어서 폰이 다크모드면 흰색 아이콘이 흰 배경에 묻혀 안 보임
- 해결: `style="dark"`로 고정 — 앱이 다크모드 자체를 지원 안 하므로 상태바도 항상 어두운 아이콘으로 고정

### 추가 확대 — 소셜 로그인 버튼(Google/Kakao/Naver)
- `min-h-11`(44px) → `min-h-14`(56px), 아이콘 22→26, 텍스트 `text-base`→`text-lg`
- `npx tsc --noEmit` 오류 0개

## 260623 (이어서) — 실기기 Google 로그인 400 진단 + 커스텀 빌드 준비

### 진단 (상세는 error-log.md 260623 항목 참고)
- 실기기 Expo Go에서 Google 로그인 400(`invalid_request`) — `redirect_uri=exp://192.168.0.175:8081`가 Google Cloud Console의 "웹 애플리케이션" 클라이언트 등록 자체를 거부당함(도메인 형식 아니라서)
- `expo-auth-session@6.0.3`에 과거 우회 수단이던 Expo 인증 프록시(`useProxy`)가 제거되어 있음을 확인 — 일반 Expo Go로는 이 버전 기준 해결 불가능한 구조적 한계로 결론

### 완료 — 커스텀 빌드(EAS Build) 준비
- [x] `app.json`에 `android.package: "com.roomi.app"` 추가(EAS Build 필수 항목)
- [x] `expo-dev-client` 설치
- [x] `eas.json` 신규 작성(`development` 프로파일, `developmentClient: true`, Android APK)
- [x] `npx tsc --noEmit` 오류 0개
- 남은 단계(사용자 Expo 계정 필요): `eas login` → `eas build --platform android --profile development` → 빌드 완료 후 APK 설치 → Google Cloud Console에 Android용 OAuth 클라이언트 추가(패키지명+서명 인증서)

## 260624 — EAS Build 실제 실행, 네이티브 빌드 오류 해결, Google 로그인 실기기 동작 확인, UI 버그 일괄 수정

### EAS Build + 네이티브 빌드 오류 해결

- `eas build --platform android --profile development` 실행 — `react-native-worklets` 패키지의 React Native 버전 호환성 검사 실패로 빌드 2회 연속 실패(상세는 error-log.md 260624 항목 참고)
- 원인: `nativewind`의 내부 의존 패키지(`react-native-css-interop`)가 Reanimated 버전과 무관하게 `react-native-worklets`를 babel 플러그인으로 무조건 요구 — 해당 패키지는 React Native 0.78 이상만 지원해서 이 프로젝트(0.76.9)와는 어떤 버전도 호환 불가
- `react-native-worklets` 의존성 제거 + `patch-package`로 `react-native-css-interop`의 babel 설정 직접 수정(`patches/react-native-css-interop+0.2.5.patch` 추가, `package.json`에 `postinstall: patch-package` 등록)
- `expo-crypto`가 하위 의존성으로만 존재해서 네이티브 모듈이 빠져있던 것 발견 → 직접 의존성으로 추가
- 빌드 3회차 성공, APK 실기기 설치 완료

### Google 로그인 — Android 네이티브 클라이언트 전환

- Google Cloud Console에 Android 타입 OAuth 클라이언트 신규 생성(패키지명+서명 SHA-1)
- `app/login.tsx`: 인증 흐름을 `id_token` 암묵적 방식에서 `Authorization Code + PKCE` 방식으로 변경(`AuthSession.exchangeCodeAsync` 추가), 플랫폼별 클라이언트 ID 분기(`Platform.OS`)
- `app.json`의 `scheme`을 배열로 변경해 Google 전용 커스텀 리디렉션 스킴(`com.googleusercontent.apps.<클라이언트ID>`) 추가
- `app/oauth2redirect.tsx` 신규 — 로그인 콜백 직후 잠깐 노출되는 빈 화면(라우트 미매칭 화면 방지)
- Google Cloud Console에서 Android 클라이언트의 커스텀 URI 스킴 옵션 활성화
- 실기기에서 Google 로그인 전체 흐름 정상 동작 확인(상세는 error-log.md 260624 항목 3건 참고)

### 실기기 전용 UI 버그 일괄 수정

- 홈 화면 검색 버튼이 실기기에서 응답하지 않던 문제 — 앱 전체를 `GestureHandlerRootView`로 감싸지 않아 캐로셀의 제스처가 화면 터치를 가로채던 것으로 추정, 검색 화면을 RN `<Modal>` 대신 라우터 기반 화면(`app/search-modal.tsx` 신규)으로 전환
- 정렬 탭(`SortSelector`) 글자 크기 확대 + 카테고리 아이콘 행과의 간격 보강
- 목록 카드(`AccommodationCard`)에 평점 표시 추가, 카드·예약 목록 그림자 농도 강화(`shadow-black/20` → `/40`)
- 내 예약 카드 내부 여백 재조정(잘림 방지)
- 숙소 상세 화면 이미지를 단일 이미지에서 스와이프 가능한 슬라이드(자동 전환 없음, 점 인디케이터 포함)로 변경, 콘텐츠를 가리던 스크롤 이동 버튼 제거
- 로그아웃 후에도 찜하기 하트가 활성 상태로 남아있던 캐시 버그 수정(`WishlistButton`이 로그인 상태를 직접 확인하도록 변경)
- 로그인 화면 뒤로가기 버튼이 히스토리에 남은 이전 로그인 화면으로 다시 진입하던 문제 → 항상 메인 화면으로 이동하도록 변경

### `npx tsc --noEmit` 오류 0개, 새 빌드 없이 적용된 항목(JS 변경분)은 리로드만으로 확인

## 260624 (이어서) — 백엔드·프론트 배포, 브랜치 전체 병합, 웹 로그인 디버깅

### 배포
- 백엔드(`roomi-api`): Vercel에 배포(`https://roomi-api.vercel.app`). DB는 기존 Neon 그대로 사용. 배포 전 `package.json`에 `postinstall: prisma generate` 추가(없으면 빌드 환경에서 Prisma 클라이언트 생성이 안 돼 빌드 실패)
- 프론트(`roomi-app`): `npx expo export -p web`으로 정적 웹 빌드 생성 후 Vercel에 배포(`https://roomi-app-six.vercel.app`). `.env`의 `EXPO_PUBLIC_API_URL`을 배포된 백엔드 주소로 교체
- 배포 관련 에러 3건(아이콘 폰트 404, `/login` 등 경로 404, 웹 로그인 client_secret 누락) — 상세는 error-log.md 260624 항목 참고

### 브랜치 전체 병합 — `feat/api`/`feat/app` → `develop` → `main`
- 그동안 모든 작업이 두 작업 브랜치에만 있고 `develop`/`main`에 한 번도 합쳐진 적이 없던 것을 발견
- `feat/api` → `develop`: 충돌 없이 병합
- `feat/app` → `develop`: 공유 루트 파일 3개에서 충돌 — `CLAUDE.md`(최신 버전으로 통일), `.gitignore`(한쪽 브랜치에만 있던 `roomi-api` 제외 규칙 삭제), `.husky/pre-commit`(각자 자기 도메인만 검사하던 스크립트를 두 도메인 모두 검사하도록 통합)
- `develop` → `main`: 충돌 없이 병합. 이후 PR을 통해 GitHub 저장소 기준 `main`에 전체 프로젝트 통합 완료
- 루트 `README.md` 신규 작성(프로젝트 소개·기술스택·핵심기능·데모 링크·아키텍처), 각 서브도메인 기본 README는 루트로 연결되도록 정리

### 웹 Google 로그인 디버깅 (여러 단계)
1. 배포된 도메인을 Google Cloud Console의 웹 OAuth 클라이언트(승인된 자바스크립트 원본/리디렉션 URI, OAuth 동의 화면의 승인된 도메인)에 추가
2. 아이콘 폰트·정적 경로 라우팅 문제 해결(위 배포 항목 참고)
3. 로그인 시도 시 인증 코드는 정상 발급되지만 사이트 루트로 리디렉션된 후 아무도 처리하지 않는 문제 발견 → 인증 응답 처리 로직을 로그인 화면에서 루트 레이아웃(`app/_layout.tsx`)으로 이동, 새 공유 훅 `hooks/useGoogleAuth.ts` 도입
4. 토큰 교환 단계에서 `client_secret` 누락 에러 확인 → 웹은 시크릿이 필요 없는 암묵적 흐름(`id_token`)으로, 네이티브(Android)는 Authorization Code+PKCE로 분리(상세는 error-log.md 260624 항목 참고)
5. 웹 로그인 전체 흐름 정상 동작 확인

### `npx tsc --noEmit` 오류 0개
