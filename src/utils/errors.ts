import { StatusCodes } from 'http-status-codes';

// npm i http-status-codes
// npm i --save-dev @types/http-status-codes
export class AppError extends Error {
  public readonly name: string;
  public readonly statusCode: StatusCodes;
  public readonly isOperational: boolean;

  constructor(name: string, statusCode: StatusCodes, message: string, isOperational: boolean) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}
