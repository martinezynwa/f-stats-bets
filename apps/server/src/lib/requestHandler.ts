import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { ErrorCodes } from './errorHandler'

type TypedRequestBody<T> = Request & { body: T }

type TypedRequestHandler<T> = {
  (req: TypedRequestBody<T>, res: Response, next: NextFunction): Promise<void | Response>
}

/**
 * Type definition for a request handler that works with typed request bodies
 * @template T - The type of the request body
 */
export const validateRequestWithBody =
  <T extends z.ZodType>(handler: TypedRequestHandler<z.infer<T>>, schema: T) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body)

      req.body = validatedData

      await handler(req as TypedRequestBody<z.infer<T>>, res, next)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        }))

        return res.status(ErrorCodes.BAD_REQUEST).json({
          error: 'Validation failed',
          details: formattedErrors,
        })
      }

      next(error)
    }
  }

/**
 * Type definition for a request handler that validates and processes requests
 * @param fn - The request handler function to be executed
 * @returns A middleware function that wraps the handler with error handling
 */
export const validateRequest =
  (fn: (req: Request, res: Response, next?: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
