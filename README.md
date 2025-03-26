# 포토 공유 앱 백엔드

이 프로젝트는 최애의 포토 백엔드 서버입니다. Express와 TypeScript를 사용하여 개발되었으며, Prisma ORM을 통해 데이터베이스와 상호작용합니다.

## 기술 스택

- **Node.js**: 자바스크립트 런타임
- **TypeScript**: 정적 타입 지원 언어
- **Express**: 웹 애플리케이션 프레임워크
- **Prisma**: ORM(Object-Relational Mapping) 도구
- **PostgreSQL**: 관계형 데이터베이스

## 설치 방법

1. 저장소 클론

```bash
git clone https://github.com/your-repository/5-fav_photo-team2-be.git
cd 5-fav_photo-team2-be
```

2. 의존성 설치

```bash
npm install
```

3. 환경변수 설정
   `.env` 파일을 프로젝트 루트에 생성하고 다음 내용을 추가합니다:

```
DATABASE_URL="postgresql://username:password@localhost:5432/favphoto?schema=public"
PORT=3000
JWT_SECRET="your-jwt-secret"
```

4. 데이터베이스 마이그레이션

```bash
npm run prisma:migrate
```

5. 타입 생성

```bash
npm run prisma:generate
```

## 실행 방법

### 개발 모드

```bash
npm run dev
```

### 빌드

```bash
npm run build
```

### 프로덕션 실행

```bash
npm start
```

## 프로젝트 구조

```
.
├── prisma/                  # 데이터베이스 관련 파일
│   ├── schema/              # 스키마 정의 파일
│   └── schema.prisma        # 메인 프리즈마 스키마
├── src/                     # 소스 코드
│   ├── domains/             # 도메인별 모듈
│   │   ├── auth/            # 인증 관련 모듈
│   │   └── routes.ts        # 도메인 라우터 설정
│   ├── app.ts               # Express 앱 설정
│   └── index.ts             # 메인 진입점
├── .env                     # 환경 변수 (git에 포함되지 않음)
├── .gitignore               # git 무시 파일 목록
├── nodemon.json             # Nodemon 설정
├── package.json             # 프로젝트 의존성 및 스크립트
├── README.md                # 이 파일
└── tsconfig.json            # TypeScript 설정
```

## API 엔드포인트

### 인증 (auth)

- `POST /api/auth/signup`: 회원가입
- `POST /api/auth/login`: 로그인
- `POST /api/auth/refresh`: 토큰 재생성

### 포토카드 (photocard)

- `GET /api/photocards/:id`: 포토 카드 상세 조회
- `GET /api/photocards/me`: 내 포토 카드 전체 조회
- `POST /api/photocards`: 포토 카드 등록
- `PATCH /api/photocards/:id`: 포토 카드 수정
- `DELETE /api/photocards/:id`: 포토 카드 삭제

### 마켓 (market)

- `GET /api/market`: 마켓 플레이스 조회
- `GET /api/market/me`: 내가 판매 등록한 포토 카드 목록 조회
- `POST /api/market`: 포토 카드 판매 등록
- `POST /api/market/purchase`: 포토 카드 구매
- `POST /api/market/exchange`: 교환 제안
- `GET /api/market/exchange`: 교환 제안 목록 조회
- `PATCH /api/market/exchange/:id/decline`: 교환 제안 취소/거절
- `PATCH /api/market/exchange/:id/approve`: 교환 제안 승인

### 알림 (notification)

- `GET /api/notification`: 알림 조회
- `PATCH /api/notification/:id`: 알림 열람

### 랜덤박스 (randombox)

- `POST /api/random-box`: 랜덤박스 뽑기 수행

## 개발 가이드

1. 새 기능을 구현할 때는 `src/domains` 아래에 적절한 도메인 디렉토리를 생성하고 그 안에 다음 파일들을 포함합니다:

   - `controller.ts`: 요청 처리 로직
   - `service.ts`: 비즈니스 로직
   - `repository.ts`: 데이터베이스 액세스 로직
   - `router.ts`: 라우트 정의
   - `dto.ts`: 데이터 전송 객체

2. 새 도메인을 추가한 후 `src/domains/routes.ts`에 라우터를 등록합니다.

3. 데이터베이스 모델을 수정할 경우 `prisma/schema.prisma` 파일을 수정한 후 마이그레이션을 실행합니다:
   ```bash
   npm run prisma:migrate
   ```

## 기여 방법

1. 저장소를 포크합니다.
2. 개발 브랜치를 생성합니다: `git checkout -b feature/new-feature`
3. 변경사항을 커밋합니다: `git commit -m 'Add new feature'`
4. 브랜치를 푸시합니다: `git push origin feature/new-feature`
5. Pull Request를 생성합니다.

## 라이센스

ISC
