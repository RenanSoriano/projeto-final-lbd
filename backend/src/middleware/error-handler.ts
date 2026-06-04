import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/http-error.js";

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction
) {
  if (error instanceof HttpError) {
    response.status(error.statusCode).json({
      ok: false,
      error: error.message
    });
    return;
  }

  console.error(error);

  response.status(500).json({
    ok: false,
    error: "Internal server error"
  });
}
