<div align="center">

# 🏨 Roomi

**성수기 가격 변동률을 보여주는 숙소 예약 앱**

평소가 대비 현재가의 변동률(%)을 목록·상세 화면에 표시하고, 변동률이 낮은 "최고 딜" 순으로 정렬할 수 있습니다.

[![React Native](https://img.shields.io/badge/React_Native-0.76-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-52-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)

[웹 데모](https://roomi-app-six.vercel.app) · [API](https://roomi-api.vercel.app/api/accommodations)

</div>

---

## 목차

- [차별점](#차별점)
- [데모](#데모)
- [핵심 기능](#핵심-기능)
- [기술 스택](#기술-스택)
- [아키텍처](#아키텍처)
- [로컬 실행](#로컬-실행)

## 차별점

일반 숙소 예약 앱은 현재가만 보여주지만, Roomi는 **평소가 대비 현재가가 얼마나 올랐는지(변동률)**를 카드·상세 화면에 함께 노출합니다. 사용자는 "지금 이 가격이 합리적인가"를 바로 비교할 수 있고, 변동률이 낮은 순으로 정렬해서 상대적으로 덜 오른 숙소를 먼저 찾을 수 있습니다.

## 데모

| | 링크 |
|---|---|
| 웹 앱 | https://roomi-app-six.vercel.app |
| API | https://roomi-api.vercel.app/api/accommodations |

> 모바일 네이티브 빌드(Android APK, Google 로그인 포함)는 별도 빌드 산물로 존재하며 저장소에는 포함되어 있지 않습니다.

## 핵심 기능

- 🔐 회원가입 / 로그인 — Google 소셜 로그인(웹 + 모바일 네이티브), 카카오·네이버는 UI 준비
- 🔍 숙소 검색 / 필터 — 지역, 체크인·체크아웃 날짜, 인원, 숙박 종류
- 📉 가격 변동률 표시 + 변동률 낮은 순 정렬
- 🏠 숙소 상세 — 이미지 슬라이드, 객실별 가격·평점
- 📅 예약 — 캘린더 날짜 선택, 동시 예약 충돌 방지(DB 트랜잭션)
- 📋 예약 내역 조회 / 취소
- ❤️ 찜하기
- ♾️ 무한 스크롤 목록

## 기술 스택

**프론트엔드** (`roomi-app/`)

| 영역 | 기술 |
|---|---|
| 프레임워크 | React Native, Expo (Expo Router) |
| 언어 | TypeScript |
| 스타일링 | NativeWind (Tailwind CSS) |
| 클라이언트 상태 | Zustand |
| 서버 상태 | TanStack Query |
| 폼 검증 | React Hook Form, Zod |
| 인증(네이티브) | expo-auth-session (OAuth 2.0 Authorization Code + PKCE) |

**백엔드** (`roomi-api/`)

| 영역 | 기술 |
|---|---|
| 프레임워크 | Next.js (API Routes) |
| DB / ORM | PostgreSQL (Neon), Prisma |
| 인증 | NextAuth v5, JWT(모바일 전용 토큰) |
| 배포 | Vercel |

## 아키텍처

```
roomi-mobile/
├── roomi-api/    Next.js 백엔드 (REST API)
│   ├── app/api/       라우트 핸들러
│   ├── lib/            인증·응답 포맷·DB 클라이언트
│   └── prisma/         스키마·마이그레이션·시드
└── roomi-app/    React Native 앱 (Expo)
    ├── app/             Expo Router 화면
    ├── components/      재사용 컴포넌트
    ├── hooks/           TanStack Query 훅
    └── store/           Zustand 상태
```

두 도메인은 `feat/api`, `feat/app` 브랜치에서 독립적으로 작업한 뒤 `develop`을 거쳐 `main`에 병합하는 흐름을 따릅니다.

## 로컬 실행

**백엔드**
```bash
cd roomi-api
npm install
npx prisma generate
npm run dev        # http://localhost:3000
```

**프론트엔드**
```bash
cd roomi-app
npm install
npx expo start
```
