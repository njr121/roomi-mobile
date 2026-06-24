# Phase 1 — DB 스키마 설계 및 연결

> 완료된 Phase. 참고용 기록.

---

## 작업 목표

Neon PostgreSQL에 앱에서 사용할 테이블 구조를 생성한다.

---

## 기술 결정 사항

| 항목 | 결정 | 이유 |
|---|---|---|
| ORM | Prisma 6.x | CLAUDE.md 버전 고정 기준 |
| DB | Neon PostgreSQL (서버리스) | 무료 티어, 배포 환경 고려 |
| ID 생성 | `cuid()` | PRD의 `gen_random_uuid()` 대비 Prisma 기본값, 기능 동일 |
| directUrl | 미사용 | Prisma 6 (≥ 5.10)은 pooled URL 하나로 마이그레이션 가능 |

---

## 생성한 모델 5개

### User
- 회원 정보. 소셜 로그인(Google · 카카오 · 네이버) + 이메일/비밀번호 공용
- `password`는 nullable (소셜 로그인 사용자는 null, 이메일 가입자는 bcrypt 해시 저장)

### Accommodation
- 숙소 정보. `priceChangeRate`가 핵심 차별화 필드
- `@@index([type])`, `@@index([priceChangeRate])` — 필터·정렬 성능

### Room
- 숙소에 속한 객실. Accommodation과 N:1 관계
- `onDelete: Cascade` — 숙소 삭제 시 객실도 함께 삭제

### Booking
- 예약 정보. User, Room 각각 N:1 관계
- `status` 기본값 `"confirmed"`. 취소 시 `"cancelled"`로 변경

### Wishlist
- 찜하기. User + Accommodation 조합
- `@@unique([userId, accommodationId])` — 같은 숙소 중복 찜 방지

---

## 완료 기준 (달성)

```bash
npx prisma migrate dev --name init  # ✅ 성공
# prisma/migrations/20260611054358_init/migration.sql 생성
# Neon DB 테이블 5개 생성 확인
```

---

## 마이그레이션 파일

`prisma/migrations/20260611054358_init/migration.sql`
