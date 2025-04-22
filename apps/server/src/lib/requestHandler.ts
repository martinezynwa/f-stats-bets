import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

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
      console.log('req', req.body)
      const validatedData = schema.parse(req.body)

      req.body = validatedData

      await handler(req as TypedRequestBody<z.infer<T>>, res, next)
    } catch (error) {
      const errors = (error as z.ZodError).errors

      if (!!errors) {
        const formattedErrors = errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        }))
        console.error(formattedErrors)
        return res.status(400).json(formattedErrors)
      } else {
        console.error(error)
        return res.status(400).json('Error occurred')
      }
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
