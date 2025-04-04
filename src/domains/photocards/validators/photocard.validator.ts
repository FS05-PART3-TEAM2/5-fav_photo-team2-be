import { z } from "zod";
import {
  PHOTOCARD_GENRES,
  PHOTOCARD_GRADES,
} from "../constants/filter.constant";
import {
  DeviceType,
  getPageSizeByDevice,
} from "../constants/pagination.constant";

// 에러 메시지 정의
const ERROR_MESSAGES = {
  grade: `유효하지 않은 등급입니다. 'ALL', 'COMMON', 'RARE', 'SUPER_RARE', 'LEGENDARY' 중 하나여야 합니다.`,
  genre: `유효하지 않은 장르입니다. 'ALL', 'TRAVEL', 'LANDSCAPE', 'PORTRAIT', 'OBJECT' 중 하나여야 합니다.`,
  device: `유효하지 않은 디바이스 타입입니다. 'PC', 'TABLET', 'MOBILE' 중 하나여야 합니다.`,
  limit: {
    min: "페이지 크기는 1 이상이어야 합니다.",
    max: "페이지 크기는 50 이하여야 합니다.",
  },
};

// 커서 스키마 정의
const CursorSchema = z.object({
  id: z.string(),
  createdAt: z.string().optional(),
});

// 커서 변환 함수
const transformCursor = (val: any) => {
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch (error) {
      throw new Error("잘못된 커서 형식입니다: " + val);
    }
  }
  return val;
};

// 디바이스에 따른 페이지 크기 조정 함수
const adjustLimitByDevice = (data: any) => {
  if (data.device && (!data.limit || data.limit === 15)) {
    return {
      ...data,
      limit: getPageSizeByDevice(data.device as DeviceType),
    };
  }
  return data;
};

// 검증용 기본 스키마 (라우터에서 사용)
export const PhotocardsQuerySchema = z.object({
  keyword: z.string().optional(),
  grade: z
    .enum(["ALL", ...PHOTOCARD_GRADES], {
      errorMap: () => ({ message: ERROR_MESSAGES.grade }),
    })
    .optional()
    .default("ALL"),
  genre: z
    .enum(["ALL", ...PHOTOCARD_GENRES], {
      errorMap: () => ({ message: ERROR_MESSAGES.genre }),
    })
    .optional()
    .default("ALL"),
  device: z
    .enum(["PC", "TABLET", "MOBILE"], {
      errorMap: () => ({ message: ERROR_MESSAGES.device }),
    })
    .optional(),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 15))
    .pipe(
      z
        .number()
        .min(1, ERROR_MESSAGES.limit.min)
        .max(50, ERROR_MESSAGES.limit.max)
    ),
  cursor: z
    .any()
    .optional()
    .transform(transformCursor)
    .pipe(CursorSchema.optional()),
});

// 변환 로직이 포함된 전체 스키마 (서비스에서 사용)
export const PhotocardsQueryWithTransform =
  PhotocardsQuerySchema.transform(adjustLimitByDevice);
