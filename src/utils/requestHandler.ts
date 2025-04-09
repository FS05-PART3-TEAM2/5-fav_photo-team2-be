import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * 비동기 컨트롤러 핸들러: 자동으로 try-catch 적용하여 next(error) 호출
 * 컨트롤러는 void 또는 Promise<any>를 반환할 수 있음
 */
export const requestHandler = (
  fn: RequestHandler | ((req: Request, res: Response) => Promise<any>)
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = fn(req, res, next);

    // Promise 반환인 경우 .catch로 에러 처리
    if (result instanceof Promise) {
      result.catch(next);
    }

    return result;
  };
};
