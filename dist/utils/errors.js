"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.CustomError = void 0;
class CustomError extends Error {
    constructor(message, statusCode) {
        super(typeof message === "string" ? message : JSON.stringify(message));
        this.statusCode = statusCode;
    }
}
exports.CustomError = CustomError;
class ValidationError extends CustomError {
    constructor(message) {
        super(message, 400);
    }
}
exports.ValidationError = ValidationError;
