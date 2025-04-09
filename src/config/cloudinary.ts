import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// 환경 변수 로드
dotenv.config();

// Cloudinary 설정
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dsz0kvk40",
  api_key: process.env.CLOUDINARY_API_KEY || "854813535551371",
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Cloudinary에 이미지를 업로드하는 함수
 * @param fileBuffer 업로드할 이미지 파일 버퍼
 * @returns 업로드된 이미지 URL
 */
export const uploadImage = async (fileBuffer: Buffer): Promise<string> => {
  try {
    // 파일을 base64 문자열로 변환
    const fileStr = `data:image/jpeg;base64,${fileBuffer.toString("base64")}`;

    // Cloudinary에 업로드
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: "photocards", // 이미지를 저장할 폴더
      resource_type: "image",
      fetch_format: "auto", // 자동 포맷 최적화
      quality: "auto", // 자동 품질 최적화
    });

    return uploadResponse.secure_url;
  } catch (error) {
    console.error("이미지 업로드 중 오류 발생:", error);
    throw new Error("이미지 업로드에 실패했습니다.");
  }
};

export default cloudinary;
