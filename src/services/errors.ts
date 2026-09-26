export type AppErrorCode =
  | "VALIDATION_ERROR"
  | "DUPLICATE_WORK_DAY"
  | "WORK_DAY_NOT_FOUND"
  | "PAYMENT_NOT_FOUND"
  | "DATABASE_ERROR";

export class AppError extends Error {
  public readonly code: AppErrorCode;

  constructor(code: AppErrorCode, message: string) {
    super(message);

    this.name = "AppError";
    this.code = code;
  }
}
