import { BetCompetitionWithLeagues, GetBetCompetitionsSchema } from '@f-stats-bets/types'
import { rawQueryArray, rawQuerySingle } from '../../lib'

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
