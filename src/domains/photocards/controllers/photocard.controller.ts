import { Request, Response, NextFunction } from "express";
import photocardService from "../services/photocard.service";
import { MyPhotocardsQuery } from "../types/photocard.type";
import multer from "multer";
import path from "path";
import { CreatePhotocardSchema } from "../validators/photocard.validator";

/**
 * 사용자의 포토카드 목록 조회
 * GET /api/photocards/me
 */
export const getMyPhotocards = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      message: "로그인이 필요합니다.",
    });
    return;
  }

  const query = req.query as unknown as MyPhotocardsQuery;

  return photocardService
    .getMyPhotocards(userId, query)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch(next);
};

/**
 * 필터 옵션별 포토카드 개수 조회
 * GET /api/photocards/me/count
 */
export const getMyPhotocardsCount = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      message: "로그인이 필요합니다.",
    });
    return;
  }

  const { grade, genre } = req.query as { grade?: string; genre?: string };

  return photocardService
    .getMyPhotocardsCount(userId, { grade, genre })
    .then((result) => {
      res.status(200).json({
        grade: grade || "",
        genre: genre || "",
        count: result,
      });
    })
    .catch(next);
};

// Multer 설정: 메모리에 임시 저장
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 최대 5MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [".jpg", ".jpeg", ".png"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "유효하지 않은 파일 형식입니다. jpg, jpeg, png 형식만 지원합니다."
        )
      );
    }
  },
});

/**
 * 미들웨어: 이미지 파일 업로드
 */
export const uploadSingle = upload.single("image");

/**
 * 포토카드 생성 컨트롤러
 * POST /api/photocards
 */
export const createPhotocard = async (req: Request, res: Response) => {
  try {
    // 사용자 ID 확인
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "인증이 필요합니다.",
      });
    }

    // 파일 확인
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "이미지 파일은 필수입니다.",
      });
    }

    // 요청 데이터 유효성 검사
    const validationResult = CreatePhotocardSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: validationResult.error.errors[0].message,
      });
    }

    // 포토카드 생성
    const photocard = await photocardService.createPhotocard(
      validationResult.data,
      req.file.buffer,
      userId
    );

    return res.status(201).json({
      success: true,
      message: "포토카드가 성공적으로 생성되었습니다.",
      data: photocard,
    });
  } catch (error) {
    console.error("포토카드 생성 중 오류 발생:", error);
    return res.status(500).json({
      success: false,
      message: "포토카드 생성에 실패했습니다.",
    });
  }
};

export default {
  getMyPhotocards,
  getMyPhotocardsCount,
  createPhotocard,
};
