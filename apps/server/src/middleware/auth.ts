import { NextFunction, Request, Response } from 'express'
import { supabase } from '../lib/supabase'

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' })
    }

    const token = authHeader.replace('Bearer ', '')

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (error) {
      console.error(error)
      return res.status(401).json({ error: 'Invalid token' })
    }

    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }

    req.user = user

    next()
  } catch (error) {
    console.error('Auth error:', error)
    return res.status(401).json({ error: 'Authentication failed' })
  }
}
