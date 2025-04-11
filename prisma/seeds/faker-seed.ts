// @ts-nocheck
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker/locale/ko";

const prisma = new PrismaClient();

// 데이터 생성 수량 설정
const USERS_COUNT = 20;
const PHOTOCARDS_PER_USER = 5;
const SALE_CARDS_PER_USER = 3;
const EXCHANGE_OFFERS_PER_USER = 2;

// 사용할 장르 및 등급 목록
const GENRES = ["LANDSCAPE", "PORTRAIT", "TRAVEL", "OBJECT"] as const;
type Genre = (typeof GENRES)[number];
const GRADES = ["COMMON", "RARE", "SUPER_RARE", "LEGENDARY"] as const;
type Grade = (typeof GRADES)[number];

// 장르별 이름 및 설명 템플릿
const GENRE_TEMPLATES: Record<
  Genre,
  {
    names: string[];
    descriptions: string[];
    imageUrls: string[];
  }
> = {
  LANDSCAPE: {
    names: [
      "아름다운 산맥",
      "해질녘 바다",
      "안개 낀 계곡",
      "초원의 풍경",
      "폭포수",
      "눈 덮인 산봉우리",
      "호수의 일출",
      "화려한 일몰",
      "사계절 풍경",
      "고요한 시골길",
    ],
    descriptions: [
      "푸른 하늘 아래 펼쳐진 대자연의 아름다움을 담았습니다.",
      "자연의 경이로움을 한 장의 사진에 오롯이 담아냈습니다.",
      "한 폭의 그림 같은 풍경을 절묘한 순간에 포착했습니다.",
      "계절의 변화가 만들어내는 자연의 색채를 표현했습니다.",
      "마음의 평온을 가져다주는 자연의 풍경입니다.",
    ],
    imageUrls: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      "https://images.unsplash.com/photo-1511884642898-4c92249e20b6",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
      "https://images.unsplash.com/photo-1546514355-7fdc90ccbd03",
      "https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe",
    ],
  },
  PORTRAIT: {
    names: [
      "도시인의 표정",
      "꿈꾸는 소녀",
      "노인의 지혜",
      "아이의 웃음",
      "사색하는 청년",
      "인생의 순간",
      "희로애락",
      "감성 포트레이트",
      "행인의 표정",
      "감정의 순간",
    ],
    descriptions: [
      "인물의 내면을 담아낸 감성적인 포트레이트입니다.",
      "순간의 감정을 포착한 인물 사진입니다.",
      "표정 하나에 담긴 수많은 이야기를 느껴보세요.",
      "빛과 그림자로 표현한 인물의 다양한 면모입니다.",
      "우연히 마주친 행인의 표정에서 발견한 아름다움입니다.",
    ],
    imageUrls: [
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      "https://images.unsplash.com/photo-1492681290082-e932832941e6",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    ],
  },
  TRAVEL: {
    names: [
      "파리의 아침",
      "베니스 운하",
      "경복궁의 봄",
      "쿄토의 가을",
      "산토리니 일몰",
      "뉴욕의 밤",
      "발리의 해변",
      "알프스 설경",
      "아마존의 비밀",
      "시드니 항구",
    ],
    descriptions: [
      "여행지에서 만난 특별한 순간을 담았습니다.",
      "이국적인 풍경이 주는 새로운 감각을 느껴보세요.",
      "낯선 곳에서 발견한 친숙함을 표현했습니다.",
      "여행의 설렘과 그 순간의 감동을 한 장에 담았습니다.",
      "다양한 문화가 공존하는 풍경을 포착했습니다.",
    ],
    imageUrls: [
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a",
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963",
      "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e",
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b",
    ],
  },
  OBJECT: {
    names: [
      "빈티지 카메라",
      "오래된 시계",
      "가을 낙엽",
      "커피 한 잔",
      "오래된 책",
      "유리병 속 메시지",
      "빗방울",
      "도자기 작품",
      "나무 질감",
      "추억의 장난감",
    ],
    descriptions: [
      "일상에서 발견한 작은 오브제의 아름다움입니다.",
      "평범한 사물에 담긴 특별한 이야기를 발견했습니다.",
      "사물의 질감과 색감을 섬세하게 표현했습니다.",
      "시간이 만들어낸 흔적이 담긴 오브제입니다.",
      "사물에 반사된 빛과 그림자의 향연을 담았습니다.",
    ],
    imageUrls: [
      "https://images.unsplash.com/photo-1516724562728-afc824a36e84",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314",
      "https://images.unsplash.com/photo-1495121553079-4c61bcce1894",
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d",
      "https://images.unsplash.com/photo-1488654715439-fbf461f0eb8d",
    ],
  },
};

// 교환 제안 설명 템플릿
const EXCHANGE_DESCRIPTIONS = [
  "이 카드와 교환하고 싶어요! 제 컬렉션을 완성하는 데 필요합니다.",
  "오랫동안 찾던 카드인데, 교환해 주시면 정말 감사하겠습니다.",
  "특별한 의미가 있는 카드라 꼭 갖고 싶어요. 교환 부탁드립니다.",
  "제가 제안한 카드도 희소성이 높은 편이니 고려해주세요!",
  "컬렉션 마무리를 위해 꼭 필요한 카드입니다. 교환 가능할까요?",
  "이 시리즈의 마지막 카드라 꼭 갖고 싶습니다. 교환해주세요!",
  "같은 작가의 작품을 모으고 있어요. 교환 고려해주세요.",
  "이 카드의 색감과 구도가 정말 마음에 들어요. 교환해주실 수 있을까요?",
  "제가 좋아하는 장르의 카드라 꼭 소장하고 싶어요. 교환 부탁드립니다.",
  "정성껏 보관해온 제 카드와 교환해주세요!",
];

// 랜덤박스 보상 테이블
const rewardTableBox1 = [
  { point: 500, chance: 40 },
  { point: 700, chance: 30 },
  { point: 1000, chance: 10 },
  { point: 3000, chance: 10 },
  { point: 5000, chance: 5 },
  { point: 10000, chance: 3.2 },
  { point: 50000, chance: 1.2 },
  { point: 100000, chance: 0.5 },
  { point: 500000, chance: 0.09 },
  { point: 1000000, chance: 0.01 },
];

const rewardTableBox2 = [{ point: 0, chance: 100 }];

// 장르 기반 이미지 URL 가져오기
function getImageUrlByGenre(genre) {
  const template = GENRE_TEMPLATES[genre];
  return faker.helpers.arrayElement(template.imageUrls);
}

// 장르 기반 이름 가져오기
function getNameByGenre(genre) {
  const template = GENRE_TEMPLATES[genre];
  return faker.helpers.arrayElement(template.names);
}

// 장르 기반 설명 가져오기
function getDescriptionByGenre(genre) {
  const template = GENRE_TEMPLATES[genre];
  return faker.helpers.arrayElement(template.descriptions);
}

// 교환 제안 설명 가져오기
function getExchangeDescription() {
  return faker.helpers.arrayElement(EXCHANGE_DESCRIPTIONS);
}

// 랜덤 포인트 획득 (랜덤박스 로직)
function getRandomPoint(table) {
  const total = table.reduce((sum, cur) => sum + cur.chance, 0);
  const rand = Math.random() * total;

  let acc = 0;
  for (const item of table) {
    acc += item.chance;
    if (rand <= acc) return item.point;
  }

  // fallback
  return 0;
}

async function main() {
  // 기존 데이터 정리 (선택 사항)
  console.log("기존 데이터 정리 중...");

  try {
    // 데이터 삭제는 참조 무결성을 위해 역순으로 진행
    // 1. 가장 참조가 많은 자식 테이블들부터 삭제
    await prisma.notification
      .deleteMany({})
      .catch((e) => console.log("notification 삭제 오류:", e.message));
    await prisma.exchangeOffer
      .deleteMany({})
      .catch((e) => console.log("exchangeOffer 삭제 오류:", e.message));
    await prisma.marketOffer
      .deleteMany({})
      .catch((e) => console.log("marketOffer 삭제 오류:", e.message));
    await prisma.transactionLog
      .deleteMany({})
      .catch((e) => console.log("transactionLog 삭제 오류:", e.message));
    await prisma.randomBoxDraw
      .deleteMany({})
      .catch((e) => console.log("randomBoxDraw 삭제 오류:", e.message));
    await prisma.pointHistory
      .deleteMany({})
      .catch((e) => console.log("pointHistory 삭제 오류:", e.message));

    // 2. 중간 계층 테이블 삭제
    await prisma.saleCard
      .deleteMany({})
      .catch((e) => console.log("saleCard 삭제 오류:", e.message));
    await prisma.userPhotoCard
      .deleteMany({})
      .catch((e) => console.log("userPhotoCard 삭제 오류:", e.message));

    // 3. 기본 테이블 삭제
    await prisma.photoCard
      .deleteMany({})
      .catch((e) => console.log("photoCard 삭제 오류:", e.message));
    await prisma.point
      .deleteMany({})
      .catch((e) => console.log("point 삭제 오류:", e.message));
    await prisma.auth
      .deleteMany({})
      .catch((e) => console.log("auth 삭제 오류:", e.message));

    // 4. 마지막으로 User 삭제
    await prisma.user
      .deleteMany({})
      .catch((e) => console.log("user 삭제 오류:", e.message));

    // 1. 사용자 생성
    const users = [];
    console.log("사용자 생성 중...");

    // 더 자연스러운 한국어 닉네임 목록
    const koreanNicknames = [
      "행복한_고양이",
      "즐거운_여행자",
      "꿈꾸는_사진사",
      "열정적인_수집가",
      "따뜻한_미소",
      "신비로운_아티스트",
      "사색하는_독서가",
      "도전하는_등산가",
      "서정적인_음악가",
      "감성적인_작가",
      "호기심많은_탐험가",
      "활기찬_댄서",
      "차분한_그림쟁이",
      "재미있는_이야기꾼",
      "집중하는_개발자",
      "엉뚱한_과학자",
      "깔끔한_정리왕",
      "다정한_친구",
      "웃음많은_코미디언",
      "진지한_철학자",
    ];

    // 모든 사용자에게 동일한 비밀번호 설정 (테스트 용도)
    const defaultPassword = "password123";

    for (let i = 0; i < USERS_COUNT; i++) {
      // 중복되지 않는 닉네임과 이메일 생성
      const nickname =
        i < koreanNicknames.length
          ? koreanNicknames[i]
          : `${koreanNicknames[i % koreanNicknames.length]}${i}`;

      const email = `user${i + 1}@example.com`;

      const user = await prisma.user.create({
        data: {
          nickname,
          email,
          password: defaultPassword,
          role: "USER",
        },
      });
      users.push(user);
      console.log(`사용자 생성: ${user.nickname} (${user.email})`);
    }

    // 각 사용자에게 포인트 지급
    console.log("Point 데이터 생성 중...");
    for (const user of users) {
      // 각 유저에게 기본 포인트(5,000~20,000) 지급
      const initialPoint = faker.number.int({ min: 5000, max: 20000 });
      await prisma.point.create({
        data: {
          userId: user.id,
          points: initialPoint,
        },
      });
    }

    // 2. 포토카드 생성
    const photoCards = [];
    for (const user of users) {
      for (let i = 0; i < PHOTOCARDS_PER_USER; i++) {
        const grade = GRADES[
          Math.floor(Math.random() * GRADES.length)
        ] as Grade;
        const genre = GENRES[
          Math.floor(Math.random() * GENRES.length)
        ] as Genre;

        const photoCard = await prisma.photoCard.create({
          data: {
            name: getNameByGenre(genre),
            description: getDescriptionByGenre(genre),
            imageUrl: getImageUrlByGenre(genre),
            grade,
            genre,
            price: faker.number.int({ min: 100, max: 2000 }),
            creatorId: user.id,
          },
        });
        photoCards.push(photoCard);

        // 3. 각 포토카드에 대한 UserPhotoCard 생성 (소유 관계)
        let quantity = 1;
        switch (grade) {
          case "COMMON":
            quantity = 20;
            break; // 고정값 20으로 설정
          case "RARE":
            quantity = 8;
            break; // 고정값 8로 설정
          case "SUPER_RARE":
            quantity = 3;
            break; // 고정값 3으로 설정
          case "LEGENDARY":
            quantity = 1;
            break;
        }

        await prisma.userPhotoCard.create({
          data: {
            ownerId: user.id,
            photoCardId: photoCard.id,
            quantity,
          },
        });
      }
    }

    // 4. 판매 카드 생성
    const saleCards = [];
    for (const user of users) {
      const userPhotoCards = await prisma.userPhotoCard.findMany({
        where: { ownerId: user.id },
        include: { photoCard: true },
      });

      if (userPhotoCards.length === 0) continue;

      // 랜덤하게 SALE_CARDS_PER_USER개 선택하여 판매 등록
      const selectedCards = faker.helpers.arrayElements(
        userPhotoCards,
        Math.min(SALE_CARDS_PER_USER, userPhotoCards.length)
      );

      for (const card of selectedCards) {
        // 판매할 수량 (소유 카드의 절반 정도)
        const saleQuantity = Math.floor(card.quantity / 2) || 1;

        const saleCard = await prisma.saleCard.create({
          data: {
            sellerId: user.id,
            photoCardId: card.photoCardId,
            userPhotoCardId: card.id,
            price:
              card.photoCard.price * faker.number.float({ min: 0.8, max: 1.5 }),
            quantity: saleQuantity,
            status: "ON_SALE",
            exchangeGrade:
              Math.random() > 0.5 ? faker.helpers.arrayElement(GRADES) : "",
            exchangeGenre:
              Math.random() > 0.5 ? faker.helpers.arrayElement(GENRES) : "",
            exchangeDescription:
              Math.random() > 0.3 ? getExchangeDescription() : "",
          },
        });
        saleCards.push(saleCard);
      }
    }

    // 5. 교환 제안 생성
    for (const user of users) {
      // 다른 사용자의 판매 카드 중 랜덤 선택
      const otherSaleCards = saleCards.filter((sc) => sc.sellerId !== user.id);
      if (otherSaleCards.length === 0) continue;

      const targetSaleCards = faker.helpers.arrayElements(
        otherSaleCards,
        Math.min(EXCHANGE_OFFERS_PER_USER, otherSaleCards.length)
      );

      // 해당 사용자가 가진 UserPhotoCard 목록 조회
      const userPhotoCards = await prisma.userPhotoCard.findMany({
        where: { ownerId: user.id },
      });

      if (userPhotoCards.length === 0) continue;

      for (const saleCard of targetSaleCards) {
        // 교환에 제안할 포토카드 선택
        const offerCard = faker.helpers.arrayElement(userPhotoCards);

        // 교환 제안 생성
        await prisma.exchangeOffer.create({
          data: {
            saleCardId: saleCard.id,
            offererId: user.id,
            userPhotoCardId: offerCard.id,
            content: getExchangeDescription(),
            status: "PENDING",
          },
        });

        // MarketOffer에도 추가 (교환 제안 관련)
        await prisma.marketOffer.create({
          data: {
            ownerId: user.id,
            type: "EXCHANGE",
            exchangeOfferId: (
              await prisma.exchangeOffer.findFirst({
                where: {
                  saleCardId: saleCard.id,
                  offererId: user.id,
                  userPhotoCardId: offerCard.id,
                },
                orderBy: { createdAt: "desc" },
              })
            )?.id,
          },
        });
      }
    }

    // 6. 판매 카드에 대한 MarketOffer 생성
    for (const saleCard of saleCards) {
      await prisma.marketOffer.create({
        data: {
          ownerId: saleCard.sellerId,
          type: "SALE",
          saleCardId: saleCard.id,
        },
      });
    }

    // 7. 일부 거래 로그 생성 (완료된 거래)
    for (let i = 0; i < saleCards.length / 4; i++) {
      const saleCard = faker.helpers.arrayElement(saleCards);
      const buyer = faker.helpers.arrayElement(
        users.filter((u) => u.id !== saleCard.sellerId)
      );

      // TransactionLog 필드 수정 (buyerId/sellerId → newOwnerId/oldOwnerId)
      await prisma.transactionLog.create({
        data: {
          saleCardId: saleCard.id,
          newOwnerId: buyer.id, // buyerId 대신 newOwnerId 사용
          oldOwnerId: saleCard.sellerId, // sellerId 대신 oldOwnerId 사용
          quantity: 1,
          totalPrice: saleCard.price, // price 대신 totalPrice 사용
          transactionType: Math.random() > 0.5 ? "SALE" : "EXCHANGE",
        },
      });

      // 거래에 따른 포인트 업데이트
      // 구매자 포인트 차감
      await prisma.point.update({
        where: { userId: buyer.id },
        data: { points: { decrement: saleCard.price } },
      });

      // 판매자 포인트 증가
      await prisma.point.update({
        where: { userId: saleCard.sellerId },
        data: { points: { increment: saleCard.price } },
      });
    }

    // 8. Auth 데이터 생성
    console.log("Auth 데이터 생성 중...");
    for (const user of users) {
      await prisma.auth.create({
        data: {
          refreshToken: faker.string.alphanumeric(64),
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 현재로부터 7일 후
        },
      });
    }

    // 9. RandomBoxDraw 데이터 생성
    console.log("RandomBoxDraw 데이터 생성 중...");
    // 일부 사용자만 랜덤박스 뽑기 참여 (25%)
    const drawUsers = faker.helpers.arrayElements(
      users,
      Math.ceil(users.length / 4)
    );

    for (const user of drawUsers) {
      const drawCount = faker.number.int({ min: 1, max: 5 });

      for (let i = 0; i < drawCount; i++) {
        // 실제 drawBox 로직과 유사하게 구현
        // 3개 중 하나를 무작위로 당첨 박스로 지정
        const boxes = [1, 2, 3];
        const winningBox = boxes[Math.floor(Math.random() * boxes.length)];
        const userPick = faker.helpers.arrayElement(boxes); // 사용자가 선택한 박스

        const isHit = userPick === winningBox;
        const point = getRandomPoint(isHit ? rewardTableBox1 : rewardTableBox2);

        // 1. 랜덤박스 뽑기 기록 생성
        await prisma.randomBoxDraw.create({
          data: {
            userId: user.id,
            earnedPoints: point,
          },
        });

        // 2. 포인트 업데이트 (당첨 시 포인트 증가)
        if (point > 0) {
          await prisma.point.update({
            where: { userId: user.id },
            data: { points: { increment: point } },
          });
        }
      }
    }

    // 10. Notification 데이터 생성
    console.log("Notification 데이터 생성 중...");
    // 간단한 알림 메시지 템플릿
    const notificationMessages = [
      "[COMMON|아름다운 산맥]에 대한 교환제안이 등록되었습니다.",
      "[RARE|도시인의 표정]에 대한 교환제안이 등록되었습니다.",
      "사용자123님이 [SUPER_RARE|파리의 아침]에 대해 [RARE|빈티지 카메라] 카드로 교환을 제안했습니다.",
      "[LEGENDARY|베니스 운하]의 교환이 거절되었습니다.",
      "사용자456님의 교환 제안이 취소되었습니다.",
      "사용자789님과의 교환이 성사되었습니다.",
      "사용자012님과의 [COMMON|커피 한 잔] 교환이 성사되었습니다.",
      "[가을 낙엽] 판매글이 수정되었습니다. 수정된 판매글로 교환 제안이 이전되었습니다.",
      "[경복궁의 봄] 판매가 취소되어 교환 제안이 취소되었습니다.",
      "포인트가 충전되었습니다.",
      "포인트가 사용되었습니다.",
      "포토카드 판매로 포인트가 적립되었습니다.",
      "신규 포토카드가 등록되었습니다.",
      "랜덤박스에서 새로운 포토카드를 획득했습니다.",
      "랜덤박스에서 5,000 포인트를 획득했습니다!",
      "랜덤박스에서 10,000 포인트를 획득했습니다!",
      "랜덤박스에서 50,000 포인트를 획득했습니다!",
      "로그인 쿨타임이 초기화되었습니다.",
    ];

    // 모든 사용자에게 각각 3~5개의 알림 생성
    for (const user of users) {
      // 각 사용자별 3~5개의 알림 생성 (최소 몇 개는 생성되도록)
      const notificationsCount = faker.number.int({ min: 3, max: 5 });
      console.log(
        `사용자 ${user.nickname}에게 ${notificationsCount}개 알림 생성 중...`
      );

      for (let i = 0; i < notificationsCount; i++) {
        // 랜덤한 알림 메시지 선택
        const notificationMessage =
          faker.helpers.arrayElement(notificationMessages);
        // 30% 확률로 읽음 처리
        const isRead = Math.random() > 0.7;

        // 알림 생성
        await prisma.notification.create({
          data: {
            userId: user.id,
            message: notificationMessage, // content 대신 message 필드 사용
            readAt: isRead ? new Date() : null, // isRead 대신 readAt 필드 사용
          },
        });
      }
    }

    console.log("시드 데이터 생성 완료!");
  } catch (error) {
    console.error("시드 생성 중 오류 발생:", error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
