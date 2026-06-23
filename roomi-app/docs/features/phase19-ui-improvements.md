# Phase 19 — UI개선 (공통 헤더/탭바/캐로셀/스플래시/스크롤버튼)

> 완료된 작업. 참고용 기록.
> 화면 로직(데이터·상태)이 아닌 레이아웃·스타일 작업만 모음.

---

## 방향

화면마다 따로 만들어져 있던 헤더·탭바를 공통 컴포넌트로 통일하고, 실기기(Expo Go) 테스트에서 드러난 안전영역·상태바·크기 문제를 보정한다.

---

## 구성요소 상세

| 항목 | 내용 |
|---|---|
| 공통 헤더 | `components/AppHeader.tsx` 신규 — `variant="search"`(홈)/`variant="title"`(나머지), 7개 화면 통일, `useSafeAreaInsets()`로 상단 보정 |
| 공통 하단 탭바 | `components/BottomTabBar.tsx` 신규 — `Tabs`의 `tabBar` prop으로 네이티브 탭바 대체, `useSafeAreaInsets()`로 하단 보정 |
| 캐로셀 | `components/AccommodationCarousel.tsx` — `react-native-reanimated-carousel`로 교체(자체 ScrollView 구현 폐기), 자동전환+드래그 지원 |
| 스플래시 | `components/SplashScreen.tsx` 신규 — 시작 1.2초, 숙소 타입 이미지 랜덤 배경 |
| 스크롤 이동 버튼 | `components/ScrollJumpButtons.tsx` 신규 — 홈/검색결과/내예약/위시리스트/상세 |
| 상태바 | `app/_layout.tsx`의 `<StatusBar style="dark">` 고정 — 시스템 다크모드 따라가다 흰 배경에 흰 아이콘 묻히는 문제 해결 |
| 헤더 2줄 버그 | `<Stack screenOptions={{headerShown:false}}>`로 기본 헤더 차단 |
| 크기 보정 | 헤더 56→64px, 로고/검색바/소셜버튼/탭 아이콘 단계적 확대(실기기 기준 재조정) |

---

## 변경 파일

`components/AppHeader.tsx`, `components/BottomTabBar.tsx`, `components/BackButton.tsx`, `components/AccommodationCarousel.tsx`, `components/SplashScreen.tsx`, `components/ScrollJumpButtons.tsx`, `components/GoogleButton.tsx`/`KakaoButton.tsx`/`NaverButton.tsx`/`GradientButton.tsx`(크기), `app/_layout.tsx`, `app/(tabs)/_layout.tsx`, `app/login.tsx`, `app/(tabs)/*.tsx`, `app/accommodation/[id].tsx`, `app/search-results.tsx`, `app/booking/[roomId].tsx`

## 삭제

`lib/typeImages.ts`에서 `pension-1.jpg` 참조(파일 누락으로 빌드 크래시 — 실제 파일 받으면 복구 필요)

---

## 완료 기준

```bash
npx tsc --noEmit   # 오류 0개
```

상세 진단·에러 내용은 `docs/errors/error-log.md`, 작업 순서는 `docs/logs/dev-log.md` 260623 항목 참고.
