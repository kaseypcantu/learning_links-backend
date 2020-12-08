import { ValidateError } from 'tsoa';

export class PrettyError {
  readonly errMessage: string;
  readonly error: Error | undefined;

  constructor(message: string, error?: Error) {
    this.errMessage = message;
    this.error = error;
  }

  static fromError(error: Error): PrettyError {
    return new PrettyError(error.message, error);
  }
}

export class ErrorResponse extends Error {
  readonly name: string;
  readonly statusCode: number;

  readonly errors: PrettyError[];

  constructor(statusCode: number, name: string, errors: PrettyError[]) {
    super();
    this.statusCode = statusCode;
    this.name = name;
    this.errors = errors;
    this.message = errors.map((r) => r.errMessage).join(', ');
  }

  static fromValidationError(error: ValidateError): ErrorResponse {
    const prettyError = new PrettyError(error.message, error);
    const err = new ErrorResponse(error.status, error.name, [prettyError]);
    err.message = error.message;
    return err;
  }
}
