export class AppError extends Error {
  code: string
  statusCode: number

  constructor(statusCode: number, code: string, message: string) {
    super(message)
    this.code = code
    this.name = 'AppError'
    this.statusCode = statusCode
  }
}
