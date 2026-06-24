# Phase 21 — EAS Build 네이티브 빌드 수정 + Google 로그인 Android 전환 + 실기기 UI 버그 수정

> 완료된 작업. 참고용 기록.
> 화면 로직이 아닌 빌드 환경·인증 흐름·레이아웃 수정 모음.

---

## 방향

커스텀 개발 빌드(EAS Build)를 실제로 실행해서 실기기에 설치하고, 그 위에서 Google 로그인을 끝까지 동작시키고, 실기기에서만 드러나는 UI 버그를 수정한다.

---

## 구성요소 상세

| 항목 | 내용 |
|---|---|
| 네이티브 빌드 오류 | `react-native-worklets`가 RN 0.76과 호환 불가(모든 배포 버전이 0.78+ 요구) — 의존성 제거 + `patch-package`로 `react-native-css-interop`의 babel 설정 패치(`patches/`), `expo-crypto` 직접 의존성 추가 |
| Google 로그인 흐름 전환 | Web 클라이언트 → Android 클라이언트(패키지명+SHA-1), `id_token` 암묵적 흐름 → `Authorization Code + PKCE`(`exchangeCodeAsync`), 플랫폼별 클라이언트 ID 분기 |
| 리디렉션 설정 | `app.json`의 `scheme`을 배열로 변경해 `com.googleusercontent.apps.<클라이언트ID>` 추가, `app/oauth2redirect.tsx` 빈 라우트 신규(콜백 후 "Unmatched Route" 노출 방지) |
| 검색 버튼 무반응 | 앱 전체를 `GestureHandlerRootView`로 감쌈, 홈 화면의 RN `<Modal>` 기반 검색창을 라우터 기반 화면(`app/search-modal.tsx` 신규)으로 구조 전환 |
| 카드 평점/그림자 | `AccommodationCard`에 평점 표시 추가(정렬엔 있는데 카드엔 없던 모순 보완), 카드·예약목록 그림자 농도 강화 |
| 예약 카드 레이아웃 | `my-bookings.tsx` 카드 높이·내부 여백 재조정(예약취소 버튼 하단 잘림 수정) |
| 상세 이미지 슬라이드 | 단일 이미지 → 스와이프 슬라이드(점 인디케이터, 자동전환 없음), 콘텐츠를 가리던 스크롤 이동 버튼 제거 |
| 찜하기 캐시 버그 | 로그아웃 후 TanStack Query 캐시 잔존으로 하트가 계속 활성 상태로 보이던 문제 — `WishlistButton`이 `isLoggedIn`을 직접 확인하도록 변경 |
| 로그인 화면 뒤로가기 | 히스토리에 남은 중복 로그인 화면으로 재진입하던 문제 — 항상 메인 화면으로 이동하도록 변경 |

---

## 변경 파일

`app.json`, `app/_layout.tsx`, `app/(tabs)/index.tsx`, `app/(tabs)/my-bookings.tsx`, `app/accommodation/[id].tsx`, `app/login.tsx`, `app/search-modal.tsx`(신규), `app/oauth2redirect.tsx`(신규), `components/AccommodationCard.tsx`, `components/AppHeader.tsx`, `components/SortSelector.tsx`, `components/WishlistButton.tsx`, `lib/env.ts`, `lib/typeImages.ts`, `package.json`, `patches/`(신규)

---

## 완료 기준

```bash
npx tsc --noEmit   # 오류 0개
```

실기기 커스텀 빌드(EAS Build)로 설치 후 Google 로그인 전체 흐름(로그인→토큰 교환→앱 로그인 처리) 정상 동작 확인. 상세 진단 과정은 `docs/errors/error-log.md`, 작업 순서는 `docs/logs/dev-log.md` 260624 항목 참고.
