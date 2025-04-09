import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * 비동기 컨트롤러 핸들러: 자동으로 try-catch 적용하여 next(error) 호출
 */
export const requestHandler = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
