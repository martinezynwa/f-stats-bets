import {
  BetCompetitionWithLeagues,
  GetBetCompetitionsSchema,
  GetBetCompetitionStandingsSchema,
  UserWithName,
} from '@f-stats-bets/types'
import { rawQueryArray, rawQuerySingle } from '../../lib'
import { getPaginationInfo } from '../../lib/pagination'
import { getBetsEvaluated } from '../bet-evaluate/bet-evaluate.service.queries'
import { countPointsForStandings } from './bet-competition.service.helpers'

export const getBetCompetitions = async (input: GetBetCompetitionsSchema) => {
  const { userId, isGlobal, isPrivate } = input

  const betCompetitions = await rawQueryArray<BetCompetitionWithLeagues>(`
    SELECT 
      bc.*,
      array_agg(bcl."leagueId") as "leagueIds"
    FROM "BetCompetition" bc
    LEFT JOIN "BetCompetitionToLeague" bcl ON bc."betCompetitionId" = bcl."betCompetitionId"
    WHERE 1=1
    ${userId ? `AND bc."userId" = '${userId}'` : ''}
    ${isGlobal !== undefined ? `AND bc."isGlobal" = ${isGlobal}` : ''}
    ${isPrivate !== undefined ? `AND bc."private" = ${isPrivate}` : ''}
    GROUP BY bc."betCompetitionId"
    ORDER BY bc."createdAt" DESC
  `)

  return betCompetitions
}

export const getJoinedBetCompetitions = async (userId: string) => {
  const betCompetitions = await rawQueryArray<BetCompetitionWithLeagues>(`
    SELECT 
      bc.*,
      array_agg(bcl."leagueId") as "leagueIds"
    FROM "BetCompetition" bc
    LEFT JOIN "BetCompetitionToLeague" bcl ON bc."betCompetitionId" = bcl."betCompetitionId"
    INNER JOIN "UserToBetCompetition" ubc ON bc."betCompetitionId" = ubc."betCompetitionId"
    WHERE ubc."userId" = '${userId}'
    GROUP BY bc."betCompetitionId"
    ORDER BY bc."createdAt" DESC
  `)

  return betCompetitions
}

export const getBetCompetition = async (id: string) => {
  const betCompetition = await rawQuerySingle<BetCompetitionWithLeagues>(`
    SELECT 
      bc.*,
      array_agg(bcl."leagueId") as "leagueIds"
    FROM "BetCompetition" bc
    LEFT JOIN "BetCompetitionToLeague" bcl ON bc."betCompetitionId" = bcl."betCompetitionId"
    WHERE bc."betCompetitionId" = '${id}'
    GROUP BY bc."betCompetitionId"
  `)

  return betCompetition
}

export const getUserNamesOfBetCompetition = async (betCompetitionId: string) => {
  const users = await rawQueryArray<UserWithName>(`
    SELECT 
      u."providerId" as "userId",
      u."name"
    FROM "User" u
    INNER JOIN "UserToBetCompetition" ubc ON u."id" = ubc."userId"
    WHERE ubc."betCompetitionId" = '${betCompetitionId}'
  `)

  return users
}

export const getBetCompetitionStandings = async (input: GetBetCompetitionStandingsSchema) => {
  const { betCompetitionId } = input

  const betsEvaluated = await getBetsEvaluated({ betCompetitionId })

  const countedAndSorted = countPointsForStandings(betsEvaluated)

  const users = await getUserNamesOfBetCompetition(betCompetitionId)
  const usersMap = new Map(users.map(user => [user.userId, user.name]))

  const updatedArray = countedAndSorted.map(({ userId, fixtureResultPoints }, index) => ({
    userId,
    userName: usersMap.get(userId),
    position: index + 1,
    points: fixtureResultPoints || 0,
  }))

  const { startIndex, endIndex, totalPages, totalItems } = getPaginationInfo({
    totalItems: updatedArray.length,
    ...input,
  })

  const items = updatedArray.slice(startIndex, endIndex)

  return { items, totalPages, totalItems, users }
}
