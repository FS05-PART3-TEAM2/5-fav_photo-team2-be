import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME!,
  api_key: process.env.CLOUD_API_KEY!,
  api_secret: process.env.CLOUD_API_SECRET!,
});

export const uploadToCloudinary = async (
  buffer: Buffer,
  folder: string = "photo-cards"
): Promise<{ imageUrl: string; publicId: string }> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image", // (이미지)
        overwrite: true, // (덮어쓰기)
      },
      (error, result) => {
        if (error || !result) {
          console.error("❌ Cloudinary 업로드 실패:", error);
          return reject(error);
        }
        console.log("✅ Cloudinary 업로드 성공:", result);
        resolve({
          imageUrl: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    stream.end(buffer); // 버퍼를 스트림에 전달
  });
};
