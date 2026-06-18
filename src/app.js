import express from "express";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes.js";

import { connectDB } from "./data/mongoConnection.js";

import {
  errorHandler,
  responseFormatter
} from "./middlewares/formatingMiddleware.js";

import {
  requestLogger
} from "./middlewares/loggingMiddleware.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

await connectDB();

app.use(express.json());

app.use(requestLogger);

app.use(responseFormatter);

app.get("/", (req, res) => {
  return res.status(200).send("<h1>Hello from Express</h1>");
});

app.use("/api/products", productRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});