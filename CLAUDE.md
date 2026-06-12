# CLAUDE.md — Roomi 프로젝트 공통 규칙

> ⚠️ Claude Code 시작 시 이 파일을 가장 먼저 읽는다.
> 매 작업 시작 전 반드시 확인한다.

---

## AI 필수 체크 — 매 작업 시작 전

- **승인 먼저** — 모든 작업 시작 전 방향을 제시하고 사용자 승인을 받은 후 진행
- **학습 우선** — 사용자는 학습하면서 개발 중. 이해 없이 넘어가지 않는다
- **커밋 먼저** — 미커밋 변경사항이 있으면 작업 전 커밋 권고
- **브랜치 확인** — 현재 브랜치와 무관한 작업이면 새 브랜치 생성 권고
- **기획 먼저** — 구현 전 반드시 방향 제시 → 사용자 승인 후 구현
- **완료 후 커밋** — 작업 완료 후 커밋 권고
- **코드 대신 짜주지 말 것** — 사용자가 직접 작성하는 게 전제. 힌트와 예시만 제공
- **개념 설명 시** — 퍼블리셔 출신 기준으로 쉽게 설명할 것

---

## PM 행동 규칙 — 매 응답 시 적용

**Claude가 직접 하는 것 (자동)**
- 문서 작성: dev-log.md, study-log.md, error-log.md, CLAUDE.local.md, features/*.md
- 파일 하나 완료 즉시 기록 — 몰아서 하지 않는다 (세션 중단 시 복구 기준)
- 개념·힌트: 채팅에서 직접 설명 + study-log.md에 즉시 기록 (둘 다)

**사용자가 직접 하는 것 (학습)**
- 소스 코드 작성 (lib/, types/, prisma/, app/api/ 등 모든 .ts 파일)
- 설정 파일 수정 (package.json, tsconfig.json 등)
- 터미널 명령 실행, git 커밋·push

**코드 작성 사이클 — 반드시 이 순서를 따른다**
1. Claude가 무엇을, 어떻게 작성할지 방향과 팁 제시
2. 사용자가 직접 작성
3. 사용자가 작성한 내용을 Claude에게 공유
4. Claude가 검토 후 피드백
5. 사용자가 수정

이 사이클을 건너뛰고 Claude가 코드를 대신 작성하는 것은 금지.

**절대 금지**
- 소스 코드·설정 파일을 사용자 동의 없이 수정하는 것
- 이미지·파일 경로 공유 시 "열까요?" 묻는 것 → 바로 읽는다
- 사용자에게 "문서 읽어라" 지시하는 것 → 필요한 내용은 채팅에서 직접 전달

---

## 프로젝트 개요

- **앱 이름**: Roomi
- **주제**: 숙소 예약 모바일 앱
- **차별화**: 성수기 가격 변동률 표시 (평소가 대비 현재가 + 상승률%)
- **플랫폼**: React Native + Expo (모바일 앱)
- **백엔드**: Next.js API Routes (별도 프로젝트, 화면 없음)
- **기간**: 2026.06.08 ~ 06.29

---

## 기술 스택 & 버전 고정

> 🚨 아래 버전만 사용한다. `latest` 사용 금지.

| 기술 | 버전 | 주의사항 |
|---|---|---|
| React Native | 0.76.x | Expo 관리 버전 사용 |
| Expo | 52.x | SDK 52 기준 |
| TypeScript | 5.x | strict 모드 필수 |
| NativeWind | 4.x | TailwindCSS RN 버전 |
| Zustand | 5.x | 클라이언트 상태 |
| TanStack Query | 5.x | 서버 상태 |
| React Hook Form | 7.x | 폼 검증 |
| Zod | 3.x | 스키마 검증 |
| Next.js | 15.x | API Routes 전용 (화면 없음) |
| Prisma | 6.x | DB ORM |
| NextAuth | v5 | Google · 카카오 · 네이버 OAuth + 이메일/비밀번호 |
| Neon | 최신 | PostgreSQL 서버리스 |

---

## 절대 금지 규칙

- `any` 타입 사용 금지
- `process.env` 직접 접근 금지 → 반드시 `lib/env.ts` 통해서 접근
- `.env` 파일 읽기·쓰기 금지
- `prisma/migrations/` 직접 수정 금지
- `latest` 버전 패키지 설치 금지
- 승인 없이 구현 단계로 넘어가지 않는다
- React Native를 웹처럼 다루지 말 것 (div, className 등 웹 문법 사용 금지)

---

## 프로젝트 구조

```
260609_ROOMI_MOBILE/
├── docs/                    → gitignore (로컬 전용 기획 문서)
│   ├── log/                 → 전체 프로젝트 작업 로그
│   └── prd/                 → 기획 문서 (PRD, HTML)
├── roomi-api/               → Next.js 백엔드 (feat/api 브랜치)
│   ├── CLAUDE.local.md      → API 작업 시 활성화
│   ├── docs/                → 깃허브 올림
│   │   ├── features/        → 기능별 작업 정의
│   │   ├── logs/            → 백엔드 작업 로그
│   │   └── errors/          → 에러 로그
│   ├── app/api/
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── env.ts           → 환경변수 Zod 검증
│   │   ├── api-response.ts  → 응답 포맷 유틸
│   │   └── errors.ts        → 에러 코드 정의
│   ├── types/
│   │   └── index.ts
│   └── prisma/
│       ├── schema.prisma
│       └── seed.ts
└── roomi-app/               → React Native 앱 (feat/app 브랜치)
    ├── CLAUDE.local.md      → 앱 작업 시 활성화
    ├── docs/                → 깃허브 올림
    │   ├── features/
    │   ├── logs/
    │   └── errors/
    ├── app/                 → Expo Router
    ├── components/
    ├── store/               → Zustand
    ├── lib/
    │   └── api.ts
    └── types/
        └── index.ts
```

---

## 도메인 경계

| 브랜치 | 작업 폴더 | 비고 |
|---|---|---|
| `feat/api` | `roomi-api/` 전체 | Next.js 백엔드 |
| `feat/app` | `roomi-app/` 전체 | React Native 앱 |

- `feat/api` 작업 중 `roomi-app/` 수정 금지
- `feat/app` 작업 중 `roomi-api/` 수정 금지

---

## Claude Code 설정 파일

### `roomi-api/.claude/settings.json` (Git 커밋, 공통 차단)

AI가 아래 파일을 수정하려 하면 물리적으로 차단된다.

| 차단 경로 | 이유 |
|---|---|
| `.env*` | 시크릿 키 노출 방지 |
| `prisma/migrations/*` | 마이그레이션 파일 임의 수정 방지 |
| `**/node_modules/**` | 패키지 파일 임의 수정 방지 |

### `roomi-api/.claude/settings.local.json` (gitignore, 도메인 차단)

feat/app 브랜치로 전환 시 직접 수정한다.

**feat/api 작업 중**
```json
{ "permissions": { "deny": ["Write(../roomi-app/**)"] } }
```

**feat/app 작업 중** → `roomi-app/.claude/settings.local.json`에서 별도 관리

> CLAUDE.md의 금지 규칙은 확률적이지만, settings.json의 deny는 무조건 차단된다.

---

## Git 브랜치 전략

```
main       → 최종 배포 (직접 커밋 금지)
develop    → 통합 브랜치 (직접 커밋 금지)
feat/api   → 백엔드 작업
feat/app   → 프론트 작업
```

**작업 흐름**
```
feat/* 작업 → develop PR 머지 → 배포 시 main 머지
```

**작업 시작 전 필수**
```bash
git checkout develop
git pull origin develop
git checkout feat/api  # 또는 feat/app
```

---

## 커밋 컨벤션

```
{type}({scope}): {내용}
```

| type | 용도 |
|---|---|
| `init` | 초기 세팅 |
| `feat` | 새 기능 추가 |
| `fix` | 버그 수정 |
| `refactor` | 리팩토링 |
| `style` | 스타일 변경 |
| `docs` | 문서 수정 |
| `chore` | 설정 변경, 패키지 설치 |

| scope | 해당 도메인 |
|---|---|
| `auth` | 인증 |
| `accommodation` | 숙소 |
| `booking` | 예약 |
| `wishlist` | 찜하기 |
| `common` | 공통 모듈 |
| `schema` | Prisma 스키마 |

**예시**
```
feat(accommodation): 숙소 목록 API 구현
feat(accommodation): 가격 변동률 정렬 기능 추가
fix(booking): 예약 취소 403 에러 수정
chore(schema): Prisma Accommodation 엔티티 priceChangeRate 필드 추가
docs(auth): auth.md 기능 정의 작성
```

---

## 커밋 전 체크리스트

```
□ TypeScript 오류 없음 (tsc --noEmit)
□ 의도하지 않은 파일 변경 없음 (git diff 확인)
□ .env 파일 미포함
□ 반대 도메인 파일 수정 없음
□ 커밋 메시지 컨벤션 준수
```

---

## 네이밍 컨벤션

| 종류 | 규칙 | 예시 |
|---|---|---|
| 페이지 컴포넌트 | kebab-case | `accommodation-detail.tsx` |
| 일반 컴포넌트 | PascalCase | `AccommodationCard.tsx` |
| 훅 | camelCase + use 접두사 | `useAccommodations.ts` |
| 유틸 함수 | camelCase | `calculatePriceChange.ts` |
| 타입/인터페이스 | PascalCase | `AccommodationType` |
| Zod 스키마 | PascalCase + Schema | `CreateBookingSchema` |
| 상수 | SCREAMING_SNAKE_CASE | `MAX_PAGE_SIZE` |
| API Route | kebab-case 폴더 | `api/accommodations/` |

---

## 문서 작성 규칙

**로그 파일 (dev-log.md, study-log.md)**
- 날짜 섹션 헤더: `## 260612 — 작업명` (6자리 단축 날짜)
- 본문에서 날짜 언급: `2026-06-12` (ISO 형식)
- 새 항목은 파일 하단에 추가 (시간순 유지)
- 완료: `- [x]` / 미완료: `- [ ]`
- Claude 직접 수정 시 "Claude 직접 수정 기록" 소항목으로 분리 기록

**features/ 문서**
- 완료된 Phase: 상단에 `> 완료된 Phase. 참고용 기록.` 표시
- 구현 전 문서에는 코드 없음 — 무엇을 만들지 정의만

**공통 규칙**
- 한국어 우선, 기술 용어는 영어 그대로 표기 (`PrismaClient`, `NextAuth` 등)
- 이모지 사용 금지
- 코드블록 언어 명시 필수 (`typescript`, `bash`, `json`, `prisma`)
- 섹션 구분은 `---` 사용
- 목록 항목 끝 마침표 생략
- 표는 3열 이하로 간결하게

---

## 디버깅 중 범위 이탈 방지

디버깅 중 현재 브랜치 범위를 벗어나는 작업이 필요하다고 판단되면
즉시 구현하지 않고 아래 순서를 따른다.

1. "이 수정은 현재 브랜치 범위 밖입니다" → 사용자에게 알림
2. "현재 작업을 먼저 커밋할까요?" → 제안
3. "새 브랜치에서 작업할까요?" → 제안
4. 사용자 승인 후 커밋 → 브랜치 전환 → 구현

---

## 핵심 기능 요약

**포함**
- 회원가입 / 로그인 (Google · 카카오 · 네이버 소셜 + 이메일)
- 숙소 목록 / 검색 / 필터 (숙박 종류)
- 가격 변동률 표시 + 상승률 낮은 순 정렬 ← 핵심 차별화
- 숙소 상세 페이지
- 객실 선택 및 예약
- 예약 내역 확인 / 취소
- 찜하기
- 페이지네이션 (10개씩)

**제외**
- 결제 (PG 연동)
- 리뷰 작성
- 관리자 페이지
- 실시간 채팅

---

*상세 내용은 각 docs/ 파일 참고.*
