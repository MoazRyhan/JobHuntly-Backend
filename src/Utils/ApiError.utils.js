export default class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = "") {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Capture stack trace for error debugging
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
