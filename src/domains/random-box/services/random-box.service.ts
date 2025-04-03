import prisma from '../../../utils/prismaClient';
import { RemainingTimeResult } from '../interfaces/random-box.interface';
import { rewardTableBox1, rewardTableBox2 } from './randomRewardTable.service';

// 최근 뽑기 시간 조회
export const getRemainingTime = async (
  userId: string
): Promise<RemainingTimeResult> => {
  // 최근 뽑기 기록 조회
  const lastDraw = await prisma.randomBoxDraw.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  // 쿨타임 없으면 바로 뽑기 가능
  if (!lastDraw) {
    return { canDraw: true, remainingSeconds: 0 };
  }

  /*
   * 쿨타임 1시간(3600초) 설정
   * 쿨타임이 지나면 true, 아니면 false
   * remainingSeconds는 남은 쿨타임(초)으로, 0보다 작으면 0으로 설정
   */
  const now = Date.now();
  const lastDrawTime = new Date(lastDraw.createdAt).getTime();
  const diffSec = (now - lastDrawTime) / 1000;
  const remaining = Math.max(0, 3600 - diffSec);
  const canDraw = remaining <= 0;

  // 쿨타임이 지나면 true, 아니면 false
  return {
    canDraw,
    remainingSeconds: remaining,
    message: canDraw
      ? '지금 바로 뽑을 수 있습니당!'
      : `아직 ${Math.ceil(remaining / 60)}분 남았습니다.`,
  };
};

// 랜덤박스 뽑기 처리 (쿨타임 검사 + 포인트 추가)
export const drawRandomBox = async (userId: string, pointToAdd: number) => {
  // 쿨타임 확인
  const remaining = await getRemainingTime(userId);
  console.log('remaining', remaining);

  // 쿨타임 남았으면 에러 처리
  if (!remaining.canDraw) {
    throw {
      code: 'COOLDOWN_ACTIVE',
      message: `아직 ${Math.ceil(
        remaining.remainingSeconds / 60
      )}분 남았습니다.`,
      nextAvailableAt: new Date(Date.now() + remaining.remainingSeconds * 1000),
    };
  }

  // 랜덤박스 뽑기 기록 생성
  await prisma.randomBoxDraw.create({
    data: {
      userId,
      earnedPoints: pointToAdd,
    },
  });

  // point 테이블에 포인트가 없으면 생성하고, 있으면 업데이트
  const existingPoint = await prisma.point.findUnique({
    where: { userId },
  });

  if (existingPoint) {
    await prisma.point.update({
      where: { userId },
      data: {
        points: {
          increment: pointToAdd,
        },
      },
    });
  } else {
    await prisma.point.create({
      data: {
        userId,
        points: pointToAdd,
      },
    });
  }

  return {
    message: '뽑기 성공',
    addedPoint: pointToAdd,
  };
};

// 확률 테이블 기반 포인트 추첨
// 균등 분포 실수 ( 모든 값이 나올 확률이 같음. )
// 0 ~ 100 중에서 어느 구간에서 멈추는가에 따라 확률이 정해지는건데 (ex. 25면 0~40인 0포인트, 99.991이면 99.99~100 인 1000포인트 )
// 구간 중 몇 퍼센트에 해당하느냐는 누적분포 방식, 수학적으로는 동등
export const getRandomPoint = (
  table: { point: number; chance: number }[]
): number => {
  const total = table.reduce((sum, cur) => sum + cur.chance, 0);
  console.log(total);
  const rand = Math.random() * total;
  console.log(rand);

  //rand가 어느 구간에 있는지 순회
  //ex. 0~40은 1포인트, 40~70 3포인트, 99.99~100은 1000포인트
  let acc = 0;
  for (const item of table) {
    acc += item.chance;
    if (rand <= acc) return item.point; // 아까 랜덤으로 나온 rand 값이 조건 만족 하면 위에서 추가한 배열의 point 값이 반환 됨
  }
  //fallback
  return 0;
};

// 박스 뽑기 서비스 로직
export const drawBox = (userPick: number) => {
  const boxes = [1, 2, 3];

  // 3개 중 하나를 무작위로 당첨 박스로 지정
  const winningBox = boxes[Math.floor(Math.random() * boxes.length)];
  console.log(winningBox);

  const boxMapping: Record<number, '당첨' | '꽝'> = {
    1: '꽝',
    2: '꽝', //초기 키 타입 꽝,
    3: '꽝',
  };
  console.log(boxMapping);
  boxMapping[winningBox] = '당첨'; // 무작위로 지정된 당첨 박스 키타입 지정

  const isHit = userPick === winningBox;
  const rewardTable = isHit ? rewardTableBox1 : rewardTableBox2;

  const point = getRandomPoint(rewardTable);

  return {
    selectedBox: userPick,
    isHit,
    point,
    correctBox: winningBox,
    boxMapping,
  };
};
