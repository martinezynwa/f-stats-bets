import { LogType } from '@packages/types'
import { db } from 'src/db'

interface LoggerProps {
  action: string
  message: string
  userId?: string
  additionalData?: Record<string, string | number | boolean | Date>
  type: LogType
}

export const logger = async ({
  userId,
  action,
  message,
  type,
  additionalData,
}: LoggerProps): Promise<void> => {
  await db.insertInto('Log').values({
    userId: userId ?? 'job',
    type,
    action,
    message,
    additionalData: additionalData ? JSON.stringify(additionalData) : null,
  })
}
