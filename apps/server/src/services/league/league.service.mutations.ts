import { InsertLeague } from '@f-stats-bets/types'
import { db } from '../../db'
import { getLeagueDetails } from './league.service.helpers'
import { InsertLeagueToDbProps } from './league.service.types'

export const insertLeagueToDb = async ({ leagueData, season }: InsertLeagueToDbProps) => {
  const { type, groupStage, supported, national, federation, organization } = getLeagueDetails(
    leagueData.league.id,
  )

  const data: InsertLeague = {
    season,
    externalLeagueId: leagueData.league.id,
    country: leagueData.country.code || leagueData.country.name,
    flag: leagueData.country.flag || '',
    logo: leagueData.league.logo,
    name: leagueData.league.name,
    dateStart: leagueData.seasons[0]!.start,
    dateEnd: leagueData.seasons[0]!.end,
    gamesPlayed: 0,
    groupStage,
    type,
    supported,
    national,
    federation,
    organization,
  }

  const added = await db
    .insertInto('League')
    .values(data)
    .onConflict(oc => oc.columns(['season', 'externalLeagueId']).doUpdateSet(data))
    .returningAll()
    .executeTakeFirst()

  return added
}
