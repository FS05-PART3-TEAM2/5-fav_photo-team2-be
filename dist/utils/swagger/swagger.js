"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = exports.swaggerUi = void 0;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
exports.swaggerUi = swagger_ui_express_1.default;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: '2팀 - 중급 프로젝트',
            version: '1.0.0',
            description: 'API 문서입니다.',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    // API 문서화할 경로 지정
    apis: ['./src/domains/**/*.ts'], // JSDoc이 포함된 파일들
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.swaggerSpec = swaggerSpec;
