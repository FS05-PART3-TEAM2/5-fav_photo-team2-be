"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errors_1 = require("../utils/errors");
const errorHandler = (error, req, res, next) => {
    const apiInfo = `${req.method} ${req.originalUrl}`;
    if (error instanceof errors_1.CustomError) {
        res.status(error.statusCode).send({ error: error.message });
        return;
    }
    console.error(`${apiInfo} :: ${error.message}`);
    res.status(500).send({ error: "Internal Server Error" });
    return;
};
exports.errorHandler = errorHandler;
