import multer from "multer";

// 메모리에 저장 (Cloudinary/S3 등 외부 전송용)
const storage = multer.memoryStorage();

export const upload = multer({ storage });
