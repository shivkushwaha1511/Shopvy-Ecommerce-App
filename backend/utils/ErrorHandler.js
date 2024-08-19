class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    // Give stacktrace
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
