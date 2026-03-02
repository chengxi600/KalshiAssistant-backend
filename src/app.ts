import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import dotenv from "dotenv";
import summarizeRoutes from "./routes/summarize.routes";
import { ServiceError } from "./utils/errors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", summarizeRoutes);

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ServiceError) {
    res.status(err.statusCode).json({
      error: err.message,
      ...(err.details && { details: err.details }),
    });
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
};

app.use(errorHandler);
app.listen(3000);
