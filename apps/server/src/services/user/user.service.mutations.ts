import { InsertUserSettings, RegisterUserInput } from '@f-stats-bets/types'
import { db } from 'src/db'
import { CreateUserSettingsInput } from './user.service.types'

export const registerUser = async (data: RegisterUserInput) => {
  const user = await db
    .insertInto('User')
    .values({ ...data, id: data.providerId, name: data.providerName })
    .returningAll()
    .executeTakeFirstOrThrow()

  return user
}

export const createUserSettings = async (input: CreateUserSettingsInput) => {
  const userSettings: InsertUserSettings = {
    providerId: input.providerId,
    userId: input.userId,
  }

  const added = await db
    .insertInto('UserSettings')
    .values(userSettings)
    .returningAll()
    .executeTakeFirstOrThrow()

  return added
}
