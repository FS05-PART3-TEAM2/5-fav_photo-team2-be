import express from "express";
import dotenv from "dotenv";
import routes from "./domains/routes";
import { swaggerUi, swaggerSpec } from './utils/swagger/swagger';

dotenv.config();
const app = express();

app.use(express.json());
app.use("/api", routes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
