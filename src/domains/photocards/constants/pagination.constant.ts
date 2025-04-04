/**
 * 디바이스별 페이지 크기 설정
 */
export const PHOTOCARD_PAGE_SIZES = {
  PC: 15, // PC: 15장 (3 x 5)
  TABLET: 10, // 태블릿: 10장 (2 x 5)
  MOBILE: 10, // 모바일: 10장 (2 x 5)
  DEFAULT: 15, // 기본값
};

/**
 * 디바이스 타입 열거형
 */
export type DeviceType = "PC" | "TABLET" | "MOBILE";

/**
 * 디바이스 타입에 따른 페이지 크기 반환
 *
 * @param device 디바이스 타입
 * @returns 해당 디바이스에 맞는 페이지 크기
 */
export const getPageSizeByDevice = (device?: DeviceType): number => {
  if (!device) return PHOTOCARD_PAGE_SIZES.DEFAULT;
  return PHOTOCARD_PAGE_SIZES[device] || PHOTOCARD_PAGE_SIZES.DEFAULT;
};
