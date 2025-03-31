import express from "express";
import dotenv from "dotenv";
import routes from "./domains/routes";
import { swaggerUi, swaggerSpec } from "./utils/swagger/swagger";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware";
dotenv.config();
const app = express();
app.use(cookieParser());

app.use(express.json());
app.use("/api", routes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

export default app;
