// 박스 하나는 무조건 포인트 획득
// 가챠 확률 100%
export const rewardTableBox1 = [
  { point: 1, chance: 40 }, // 1포인트 획득 확률 40%
  { point: 3, chance: 30 },
  { point: 5, chance: 10 },
  { point: 10, chance: 10 },
  { point: 15, chance: 5 },
  { point: 50, chance: 3.2 },
  { point: 100, chance: 1.2 },
  { point: 200, chance: 0.5 },
  { point: 500, chance: 0.09 },
  { point: 1000, chance: 0.01 },
];

// 나머지 박스는 꽝
export const rewardTableBox2 = [{ point: 0, chance: 100 }];
