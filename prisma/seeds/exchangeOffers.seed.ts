import { userIDs } from "./user.seed";
import { userPhotoCards } from "./userPhotoCard.seed";
import { saleCards } from "./saleCard.seed";

export const exchangeOffers = [
  {
    id: "ecb804f6-4efa-4ab5-b461-70d1218a5520",
    saleCardId: saleCards[0].id,
    offererId: userIDs[5],
    userPhotoCardId: userPhotoCards[2].id,
    status: "PENDING",
    content: "제 카드랑 교환 어떠세요?",
  },
  {
    id: "5c1f1e1b-581f-4259-9302-88290459f6cb",
    saleCardId: saleCards[1].id,
    offererId: userIDs[10],
    userPhotoCardId: userPhotoCards[3].id,
    status: "PENDING",
    content: "자연 장르로 교환 희망",
  },
  {
    id: "7b7e8b65-2bd5-4b85-81d4-71dc697bbf06",
    saleCardId: saleCards[2].id,
    offererId: userIDs[7],
    userPhotoCardId: userPhotoCards[4].id,
    status: "ACCEPTED",
    content: "동급 교환 원합니다.",
  },
  // ... 총 30개
  {
    id: "8661a46f-5ad3-4f84-a4cd-d5f474f988b8",
    saleCardId: saleCards[3].id,
    offererId: userIDs[9],
    userPhotoCardId: userPhotoCards[5].id,
    status: "FAILED",
    content: "생각 있으면 연락주세요.",
  },
  {
    id: "3c8a62d6-6156-4f3f-8bc9-2adeb75ab9cc",
    saleCardId: saleCards[4].id,
    offererId: userIDs[15],
    userPhotoCardId: userPhotoCards[8].id,
    status: "PENDING",
    content: "교환 희망합니다.",
  },
  {
    id: "14f9ad08-9639-4461-9c22-2c995792da3b",
    saleCardId: saleCards[5].id,
    offererId: userIDs[18],
    userPhotoCardId: userPhotoCards[9].id,
    status: "PENDING",
    content: "B급 카드 2장 드릴게요.",
  },
  {
    id: "1450bc91-66d3-49cc-bd35-a25304157b2f",
    saleCardId: saleCards[6].id,
    offererId: userIDs[4],
    userPhotoCardId: userPhotoCards[1].id,
    status: "ACCEPTED",
    content: "교환 확정합시다.",
  },
  {
    id: "a7f3ed00-20fc-4e7d-a918-1b508b2e1b81",
    saleCardId: saleCards[7].id,
    offererId: userIDs[3],
    userPhotoCardId: userPhotoCards[0].id,
    status: "FAILED",
    content: "다른 거래가 생겼습니다.",
  },
  {
    id: "5e43fdd3-3b30-4cc9-92f2-4ab68f5086bd",
    saleCardId: saleCards[8].id,
    offererId: userIDs[8],
    userPhotoCardId: userPhotoCards[2].id,
    status: "PENDING",
    content: "동물 카드랑 교환 원해요.",
  },
  {
    id: "08175499-b29b-4d82-b486-e3ffcfa8ca56",
    saleCardId: saleCards[9].id,
    offererId: userIDs[2],
    userPhotoCardId: userPhotoCards[3].id,
    status: "PENDING",
    content: "추가금 낼게요.",
  },
  {
    id: "7f2d4c57-43d1-44b2-ae5c-b529cd09be2e",
    saleCardId: saleCards[10].id,
    offererId: userIDs[12],
    userPhotoCardId: userPhotoCards[15].id,
    status: "PENDING",
    content: "2장 교환 희망.",
  },
  {
    id: "56814b96-811c-4acf-9fb1-4df53ff35742",
    saleCardId: saleCards[11].id,
    offererId: userIDs[16],
    userPhotoCardId: userPhotoCards[16].id,
    status: "PENDING",
    content: "가능하실까요?",
  },
  {
    id: "4ed742e1-56e2-41c3-8224-d9c62f10bd51",
    saleCardId: saleCards[12].id,
    offererId: userIDs[17],
    userPhotoCardId: userPhotoCards[17].id,
    status: "FAILED",
    content: "상대가 거래 취소...",
  },
  {
    id: "c574dd83-c554-4200-8b1b-0be89c94d8dc",
    saleCardId: saleCards[13].id,
    offererId: userIDs[6],
    userPhotoCardId: userPhotoCards[10].id,
    status: "ACCEPTED",
    content: "합리적 제안!",
  },
  {
    id: "f195d184-1333-4468-86c0-d7b4c3a14dc8",
    saleCardId: saleCards[14].id,
    offererId: userIDs[11],
    userPhotoCardId: userPhotoCards[11].id,
    status: "PENDING",
    content: "등급 괜찮으면 교환",
  },
  {
    id: "73100c17-d939-4d21-95b7-24f09cf36f78",
    saleCardId: saleCards[15].id,
    offererId: userIDs[0],
    userPhotoCardId: userPhotoCards[12].id,
    status: "PENDING",
    content: "S급도 드려요.",
  },
  {
    id: "4608e7b5-0b71-48d6-8ed9-fd56bd26d461",
    saleCardId: saleCards[16].id,
    offererId: userIDs[1],
    userPhotoCardId: userPhotoCards[4].id,
    status: "FAILED",
    content: "거래 불발되었습니다.",
  },
  {
    id: "1428e881-8f32-4bb7-8814-c41446e783a4",
    saleCardId: saleCards[17].id,
    offererId: userIDs[2],
    userPhotoCardId: userPhotoCards[5].id,
    status: "PENDING",
    content: "교환 콜?",
  },
  {
    id: "dfe7a12c-315f-447d-af8b-e8018cbf3802",
    saleCardId: saleCards[18].id,
    offererId: userIDs[4],
    userPhotoCardId: userPhotoCards[6].id,
    status: "ACCEPTED",
    content: "완료!",
  },
  {
    id: "60416196-1178-4cd8-aacf-575f892b15bc",
    saleCardId: saleCards[19].id,
    offererId: userIDs[18],
    userPhotoCardId: userPhotoCards[7].id,
    status: "PENDING",
    content: "확인 부탁드립니다",
  },
  // 남은 10개 더
  {
    id: "e0c88304-3198-4b9f-b690-d3a9edf24e2b",
    saleCardId: saleCards[20].id,
    offererId: userIDs[17],
    userPhotoCardId: userPhotoCards[8].id,
    status: "PENDING",
    content: "교환 문의",
  },
  {
    id: "4dc1f235-f8a4-4fb2-97b6-fc6e97b81f2e",
    saleCardId: saleCards[21].id,
    offererId: userIDs[19],
    userPhotoCardId: userPhotoCards[9].id,
    status: "PENDING",
    content: "포인트 추가 가능",
  },
  {
    id: "2de8df6c-9f08-4e48-87dc-ffcf6f28e95d",
    saleCardId: saleCards[22].id,
    offererId: userIDs[14],
    userPhotoCardId: userPhotoCards[10].id,
    status: "PENDING",
    content: "얼른 연락 주세요.",
  },
  {
    id: "0c455f16-1ddb-4da3-afda-6fed2f98ddc6",
    saleCardId: saleCards[23].id,
    offererId: userIDs[13],
    userPhotoCardId: userPhotoCards[12].id,
    status: "FAILED",
    content: "취소할게요.",
  },
  {
    id: "e1bc919f-5b73-4f84-9b76-9f9b43b3fb1e",
    saleCardId: saleCards[24].id,
    offererId: userIDs[8],
    userPhotoCardId: userPhotoCards[16].id,
    status: "ACCEPTED",
    content: "좋은 거래였습니다.",
  },
  {
    id: "09dff2a0-cfed-4480-b2b5-653463921679",
    saleCardId: saleCards[25].id,
    offererId: userIDs[9],
    userPhotoCardId: userPhotoCards[17].id,
    status: "PENDING",
    content: "이번 주 안에 하고 싶어요.",
  },
  {
    id: "85eb92a5-3575-499a-a225-2daec583dfa8",
    saleCardId: saleCards[26].id,
    offererId: userIDs[10],
    userPhotoCardId: userPhotoCards[18].id,
    status: "PENDING",
    content: "연락바랍니다.",
  },
  {
    id: "d7392f1e-90b2-4fef-816c-040723dc01f4",
    saleCardId: saleCards[27].id,
    offererId: userIDs[11],
    userPhotoCardId: userPhotoCards[19].id,
    status: "FAILED",
    content: "거래 불발.",
  },
  {
    id: "3779afc1-98d1-4958-9268-662106f75ab2",
    saleCardId: saleCards[28].id,
    offererId: userIDs[6],
    userPhotoCardId: userPhotoCards[20].id,
    status: "PENDING",
    content: "괜찮으면 교환.",
  },
  {
    id: "1903cf17-49bb-4255-8a3b-b16e4c20531f",
    saleCardId: saleCards[29].id,
    offererId: userIDs[7],
    userPhotoCardId: userPhotoCards[21].id,
    status: "ACCEPTED",
    content: "기다리겠습니다!",
  },
];
