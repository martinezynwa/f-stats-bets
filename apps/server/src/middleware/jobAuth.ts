import { NextFunction, Request, Response } from 'express'

export const requireJobAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (authHeader !== process.env.CRON_SECRET) {
      return res.status(401).json({ error: 'Not authorized' })
    }

    next()
  } catch (error) {
    console.error('Job auth error:', error)
    return res.status(401).json({ error: 'Authentication failed' })
  }
}
