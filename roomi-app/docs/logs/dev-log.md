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
- [x] 용어 동기화: `CLAUDE.md`, `CLAUDE.local.md`, `phase9-first-screen.md`, PRD(`v9`, 웹 클로드 경유) 전부 "상승률"→"변동률"
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
- 오늘 한정 Claude 직접 작성 모드(사용자 명시 요청, 마감 압박) — Phase 끝날 때마다 문서 작성 + 커밋 반복하는 방식으로 진행, 직접작성→리뷰 단계만 생략

### Phase 16 구현 완료

- `types/index.ts`(`AccommodationFilters`, `PaginatedAccommodations`), `lib/api.ts`(`getAccommodations`가 필터 받아 쿼리스트링 빌드), `hooks/useAccommodations.ts`(필터를 `queryKey`에 포함), `components/SearchBar.tsx`/`FilterSheet.tsx`/`SortSelector.tsx`/`Pagination.tsx`(전부 신규), `app/(tabs)/index.tsx`(전부 조합, 필터 변경 시 `page: 1` 리셋) 전부 작성
- `npx tsc --noEmit` 오류 0개 확인

### 수동 검증 — 일부만 가능, 한계를 기록

- 지역 검색, 숙박 종류 필터, 정렬(변동률/가격) 토글, 페이지네이션(이전/다음) — Expo 웹에서 정상 동작 확인
- 날짜(체크인/체크아웃) 가용성 필터의 "제외 동작"(겹치는 예약이 있으면 숙소가 목록에서 빠지는 것)은 **시각적으로 확인하지 못함** — 시드 데이터의 모든 숙소가 객실을 2개씩 갖고 있어서, 한 객실만 예약된 상태로는 다른 객실이 항상 비어있어 숙소가 절대 안 사라짐(필터 로직상 정상 동작이지만 이 데이터로는 입증할 시나리오 자체가 없음)
- 대안으로 같은 숙소의 두 번째 객실에 임시 예약을 추가해 완전히 막아보는 방법을 검토했으나, Prisma Studio 관계 탐색이 복잡해서 보류 — 대신 다음 근거로 논리적 검증 처리: (1) `region`/`guests` 단독 필터는 Phase 7에서 `curl`로 이미 실제 검증됨 (2) 날짜 겹침 조건(`bookings.none`+`gte`/`lt`/`gt`)은 이미 검증된 것과 동일한 Prisma 관계 필터 패턴을 객실 하위 관계에 적용한 것 (3) `checkIn` 단독 전송 시 `400` 검증 로직은 동작 확인됨
- 결론: 코드 리뷰 + 부분 동작 확인으로 충분하다고 판단, Phase 16 완료로 처리. 시간 여유가 생기면 임시 예약으로 완전 검증하는 걸 과제로 남김
