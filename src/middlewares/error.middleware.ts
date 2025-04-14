import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { CustomError } from "../utils/errors";
import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const apiInfo = `${req.method} ${req.originalUrl}`;

  // ✅ 파일 사이즈 초과만 체크
  if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
    res.status(404).json({ error: "파일 크기가 너무 큽니다. (최대 5MB)" });
    return;
  }

  // ✅ 커스텀 에러 처리
  if (error instanceof CustomError) {
    res.status(error.statusCode).send({ error: error.message });
    return;
  }

  // ✅ 그 외 예외 처리
  console.error(`${apiInfo} :: ${error.message}`);
  res.status(500).send({ error: "Internal Server Error" });
  return;
};
