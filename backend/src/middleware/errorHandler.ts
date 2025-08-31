import type { Request, Response, NextFunction } from 'express'
import { HttpError } from '../utils/httpError'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const status = err instanceof HttpError ? err.status : 500
  const message = err instanceof HttpError ? err.message : 'Internal Server Error'
  const details = (err as any)?.details

  if (process.env.NODE_ENV !== 'production') {
    // Log stack in non-prod for easier debugging
    // eslint-disable-next-line no-console
    console.error('[ERROR]', err)
  }

  res.status(status).json({ error: message, status, details })
}
