/**
 * 포토카드 필터링 및 정렬 설정
 */
export const PHOTOCARD_FILTER_CONFIG = {
  orderBy: {
    // 정렬 기준
    latest: "최신 순",
    oldest: "오래된 순",
  },
  filter: {
    grade: {
      label: "등급",
      options: {
        default: "전체",
        COMMON: "COMMON",
        RARE: "RARE",
        SUPER_RARE: "SUPER RARE",
        LEGENDARY: "LEGENDARY",
      },
    },
    genre: {
      label: "장르",
      options: {
        default: "전체",
        TRAVEL: "여행",
        LANDSCAPE: "풍경",
        PORTRAIT: "인물",
        OBJECT: "사물",
      },
    },
  },
};

/**
 * 필터링 기본값
 */
export const DEFAULT_FILTER_VALUES = {
  grade: "default",
  genre: "default",
  orderBy: "latest",
};

/**
 * 포토카드 등급 목록
 */
export const PHOTOCARD_GRADES = ["COMMON", "RARE", "SUPER_RARE", "LEGENDARY"];

/**
 * 포토카드 장르 목록
 */
export const PHOTOCARD_GENRES = ["TRAVEL", "LANDSCAPE", "PORTRAIT", "OBJECT"];
