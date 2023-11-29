export class AppError extends Error {
  public readonly name: string
  public readonly httpCode: HtppCode 
  public readonly isOperational: boolean

  constructor(
    name: string, 
    httpCode: HtppCode, 
    description: string, 
    isOperational: boolean
  ) {
    super(description)

    Object.setPrototypeOf(this, new.target.prototype)

    this.name = name
    this.httpCode = httpCode
    this.isOperational = isOperational

    Error.captureStackTrace(this)
  }
}
