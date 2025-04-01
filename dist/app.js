"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./domains/routes"));
const swagger_1 = require("./utils/swagger/swagger");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_middleware_1 = require("./middlewares/error.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use("/api", routes_1.default);
app.use("/api-docs", swagger_1.swaggerUi.serve, swagger_1.swaggerUi.setup(swagger_1.swaggerSpec));
app.use(error_middleware_1.errorHandler);
exports.default = app;
