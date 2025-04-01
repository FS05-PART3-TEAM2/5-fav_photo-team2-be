"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAll = void 0;
const errors_1 = require("../utils/errors");
const formatZodError_1 = require("../utils/formatZodError");
const validateAll = (schemas) => (req, res, next) => {
    if (schemas.body) {
        const result = schemas.body.safeParse(req.body);
        if (!result.success) {
            const flat = result.error.flatten();
            throw new errors_1.ValidationError((0, formatZodError_1.formatZodError)(flat));
        }
        req.body = result.data;
    }
    if (schemas.query) {
        const result = schemas.query.safeParse(req.query);
        if (!result.success) {
            const flat = result.error.flatten();
            throw new errors_1.ValidationError((0, formatZodError_1.formatZodError)(flat));
        }
        req.query = result.data;
    }
    if (schemas.params) {
        const result = schemas.params.safeParse(req.params);
        if (!result.success) {
            const flat = result.error.flatten();
            throw new errors_1.ValidationError((0, formatZodError_1.formatZodError)(flat));
        }
        req.params = result.data;
    }
    next();
};
exports.validateAll = validateAll;
