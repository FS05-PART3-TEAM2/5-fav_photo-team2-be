import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
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

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
