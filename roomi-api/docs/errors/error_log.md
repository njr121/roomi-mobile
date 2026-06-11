# roomi-api 에러 로그

> 에러 발생 시 아래에 섹션 추가

---

## 2026-06-10 | Prisma 버전 미지정으로 7.x 설치 → config 구조 불일치

### 에러 메시지

```
Error code: P1012
The datasource property `directUrl` is no longer supported in schema files.
Move connection URLs to `prisma.config.ts`.
```

### 원인

`npm install prisma --save-dev` 버전 미지정 → Prisma 7.8.0 설치됨 (스펙: 6.x)

Prisma 7에서 datasource 구조가 변경됨:
- `schema.prisma`에서 URL 설정 불가 → `prisma.config.ts`로 이동
- `directUrl` 타입 정의 미완성으로 TypeScript 오류 발생

### 해결

Prisma 6.x로 다운그레이드

```bash
npm install prisma@6 --save-dev
npm install @prisma/client@6
```

`prisma.config.ts` 삭제 후 `schema.prisma`에 URL 설정 복원:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_URL_UNPOOLED")
}
```

### 교훈

패키지 설치 시 반드시 버전 명시. `latest` 설치는 breaking change를 동반할 수 있음.

---

## 2026-06-10 | Prisma db pull P1000 — 인증 실패 (Authentication failed)

### 에러 메시지

```
Error: P1000
Authentication failed against database server,
the provided database credentials for `(not available)` are not valid.
```

### 원인

`(not available)` = 연결 문자열에서 아이디/비밀번호 파싱 실패.
호스트 주소는 정상 연결됐으나 계정 정보만 인식 불가.
`.env`의 연결 문자열 형식 오류 또는 복사 과정의 문자 손상 추정.

### 해결

Neon 대시보드 → Connect → Prisma 선택 → .env 탭에서 연결 문자열 전체 재복사.
`.env` 파일 전체 내용 교체.

추가로 `schema.prisma`의 `directUrl = env("DATABASE_URL_UNPOOLED")` 제거.
Prisma 6(≥ 5.10)에서는 pooled URL 하나로 마이그레이션까지 처리 가능하므로 불필요.

### 결과

2026-06-11 `npx prisma db pull` 재실행 → 연결 성공 (P4001 = DB empty, 정상)
