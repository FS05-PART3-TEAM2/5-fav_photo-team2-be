import { Request, Response } from "express";
import { getRemainingTime, drawBox } from "../services/random-box.service";

// 랜던박스 상태 조회 요청
export const status = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user.id;

  try {
    const result = await getRemainingTime(userId);
    res.status(200).json(result);
    return;
  } catch (err: any) {
    console.error("Status error:", err);
    res.status(500).json({ error: "서버 에러 발생" });
    return;
  }
};

// 박스 선택 요청 컨트롤러
export const openBox = async (req: Request, res: Response): Promise<void> => {
  const userBox = req.body.boxNumber;

  // 유효성 검사
  if (![1, 2, 3].includes(userBox)) {
    res.status(400).json({ error: "잘못된 박스 번호입니다." });
    return;
  }

  try {
    // 서비스 호출 → 박스 로직 실행
    const result = await drawBox(userBox);

    // 성공 응답
    res.status(200).json(result);
  } catch (error) {
    // 예외 처리
    res.status(500).json({ error: "서버 오류 발생" });
  }
};
