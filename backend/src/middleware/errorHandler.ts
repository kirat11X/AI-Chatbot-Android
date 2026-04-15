import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../lib/appError'

export function notFoundHandler(
  _request: Request,
  _response: Response,
  next: NextFunction,
) {
  next(new AppError(404, 'NOT_FOUND', 'The requested resource was not found.'))
}

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
) {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
      },
    })
    return
  }

  if (error instanceof SyntaxError && 'body' in error) {
    response.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'Request body contains invalid JSON.',
      },
    })
    return
  }

  console.error('Unhandled server error', error)

  response.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected server error occurred.',
    },
  })
}
