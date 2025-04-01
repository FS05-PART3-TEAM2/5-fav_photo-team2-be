export class CustomError extends Error {
  statusCode: number;

  constructor(message: string | object, statusCode: number) {
    super(typeof message === "string" ? message : JSON.stringify(message));
    this.statusCode = statusCode;
  }
}

export class ValidationError extends CustomError {
  constructor(message: string) {
    super(message, 400);
  }
}
