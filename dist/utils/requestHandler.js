"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestHandler = void 0;
/**
 * 비동기 컨트롤러 핸들러: 자동으로 try-catch 적용하여 next(error) 호출
 */
const requestHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.requestHandler = requestHandler;
