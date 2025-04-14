# 2팀 최애의 포토 백엔드

이 프로젝트는 최애의 포토카드를 수집하고 거래할 수 있는 앱의 백엔드 서버입니다. Express와 TypeScript를 사용하여 개발되었으며, Prisma ORM을 통해 PostgreSQL 데이터베이스와 상호작용합니다.

## 기술 스택

- **Node.js**: 자바스크립트 런타임
- **TypeScript**: 정적 타입 지원 언어
- **Express**: 웹 애플리케이션 프레임워크
- **Prisma**: ORM(Object-Relational Mapping) 도구
- **PostgreSQL**: 관계형 데이터베이스
- **JWT**: 사용자 인증
- **Multer**: 파일 업로드 처리
- **Cloudinary**: 이미지 저장 및 관리
- **Zod**: 데이터 유효성 검증
- **Swagger**: API 문서화

## 설치 방법

1. 저장소 클론

```bash
git clone <repository-url>
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
PORT=5005
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-jwt-refresh-secret"
CORS_ORIGIN="http://localhost:3000"
```

4. 데이터베이스 마이그레이션

```bash
npm run prisma:migrate
```

5. 타입 생성

```bash
npm run prisma:generate
```

6. 초기 데이터 시드 생성 (선택사항)

```bash
npm run seed
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
│   ├── migrations/          # 데이터베이스 마이그레이션
│   └── seeds/               # 초기 데이터 시드
├── src/                     # 소스 코드
│   ├── domains/             # 도메인별 모듈
│   │   ├── auth/            # 인증 관련 모듈
│   │   ├── photocards/      # 포토카드 관련 모듈
│   │   ├── market/          # 마켓 관련 모듈
│   │   ├── notification/    # 알림 관련 모듈
│   │   ├── random-box/      # 랜덤박스 관련 모듈
│   │   ├── point/           # 포인트 관련 모듈
│   │   └── routes.ts        # 도메인 라우터 설정
│   ├── middlewares/         # 미들웨어
│   ├── utils/               # 유틸리티 함수
│   ├── types/               # 타입 정의
│   ├── zod/                 # Zod 스키마 정의
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
- `GET /api/auth/me`: 내 정보 조회

### 포토카드 (photocards)

- `GET /api/photocards/me`: 내 포토카드 목록 조회
- `GET /api/photocards/me/count`: 내 포토카드 개수 조회
- `GET /api/photocards/me/:id`: 내 포토카드 상세 조회
- `POST /api/photocards`: 포토카드 등록

### 마켓 (market)

- `GET /api/market`: 마켓 리스트 조회
- `GET /api/market/count`: 마켓 리스트 개수 조회
- `GET /api/market/me`: 내가 판매 등록한 포토카드 목록 조회
- `GET /api/market/me/count`: 내가 판매 등록한 포토카드 개수 조회
- `POST /api/market`: 포토카드 판매 등록
- `PATCH /api/market/:id`: 판매 포토카드 정보 수정
- `PATCH /api/market/:id/cancel`: 판매 취소
- `GET /api/market/:id/detail`: 판매 포토카드 상세 정보 조회
- `GET /api/market/:id/exchange`: 교환 가능한 포토카드 조회
- `POST /api/market/purchase`: 포토카드 구매
- `POST /api/market/exchange`: 교환 제안
- `PATCH /api/market/exchange/:id/fail`: 교환 제안 취소/거절
- `PATCH /api/market/exchange/:id/accept`: 교환 제안 승인

### 알림 (notifications)

- `GET /api/notifications`: 알림 조회
- `PATCH /api/notifications/:notificationId/read`: 알림 읽음 처리

### 랜덤박스 (random-box)

- `GET /api/random-box`: 랜덤박스 상태 조회
- `POST /api/random-box`: 랜덤박스 뽑기 수행
- `POST /api/random-box/test`: 테스트용 랜덤박스 뽑기 (시간 제한 없음)

### 포인트 (point)

- `GET /api/point`: 사용자 포인트 조회

## 데이터베이스 스키마

프로젝트는 다음과 같은 주요 데이터 모델을 사용합니다:

- **User**: 사용자 정보
- **PhotoCard**: 포토카드 정보
- **UserPhotoCard**: 사용자가 소유한 포토카드
- **SaleCard**: 판매 중인 포토카드
- **MarketOffer**: 마켓에서의 구매 제안
- **ExchangeOffer**: 교환 제안
- **RandomBoxDraw**: 랜덤박스 뽑기 이력
- **Point**: 사용자 포인트
- **PointHistory**: 포인트 사용 이력
- **Notification**: 사용자 알림
- **TransactionLog**: 거래 이력

## 팀 구성 및 역할

| 이름   | 역할        | 담당 기능                      |
| ------ | ----------- | ------------------------------ |
| 정하윤 | 백엔드 개발 | 교환 관련 수정 API             |
| 정한샘 | 백엔드 개발 | 마켓플레이스 관련 조회 API     |
| 가승연 | 백엔드 개발 | 유저기능, 랜덤포인트, 미들웨어 |
| 봉재완 | 백엔드 개발 | 포토카드 관련 조회, 등록 API   |
| 민지영 | 백엔드 개발 | 교환 관련 API, 포인트 API      |

## 개발 가이드

1. 새 기능을 구현할 때는 `src/domains` 아래에 적절한 도메인 디렉토리를 생성하고 그 안에 다음 파일들을 포함합니다:

   - `controllers/`: 요청 처리 로직
   - `services/`: 비즈니스 로직
   - `repositories/`: 데이터베이스 액세스 로직
   - `validators/`: 데이터 유효성 검증 로직
   - `routes.ts`: 라우트 정의

2. 새 도메인을 추가한 후 `src/domains/routes.ts`에 라우터를 등록합니다.

3. 데이터베이스 모델을 수정할 경우 `prisma/schema/` 디렉토리에 있는 해당 모델 파일을 수정한 후 마이그레이션을 실행합니다:
   ```bash
   npm run prisma:migrate
   ```

## 라이센스

ISC
