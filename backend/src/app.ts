import cors from "cors";
import express from "express";
import { pingDatabase } from "./db/service.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.get("/db/ping", async (_request, response, next) => {
  try {
    const database = await pingDatabase();

    response.json({
      ok: true,
      database
    });
  } catch (error) {
    next(error);
  }
});

app.use(
  (
    error: unknown,
    _request: express.Request,
    response: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(error);

    response.status(500).json({
      ok: false,
      error: "Internal server error"
    });
  }
);
