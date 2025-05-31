import { InsertLeague } from '@f-stats-bets/types'
import { getSupportedLeagueDetail } from 'src/assets/league-data'
import { db } from '../../db'
import { InsertLeagueToDbProps } from './league.service.types'

export const insertLeagueToDb = async ({ leagueData, season }: InsertLeagueToDbProps) => {
  const leagueDetail = getSupportedLeagueDetail(leagueData.league.id)

  if (!leagueDetail) {
    throw new Error(`League ${leagueData.league.id} not supported`)
  }

  const { type, variant, federation, organization } = leagueDetail

  const data: InsertLeague = {
    season,
    externalLeagueId: leagueData.league.id,
    country: leagueData.country.code || leagueData.country.name,
    flag: leagueData.country.flag || '',
    logo: leagueData.league.logo,
    name: leagueData.league.name,
    dateStart: leagueData.seasons[0]!.start,
    dateEnd: leagueData.seasons[0]!.end,
    type,
    federation,
    organization,
    national: variant === 'nation',
    supported: true, //TODO, allow unsupported leagues
    gamesPlayed: 0, //TODO
    groupStage: false, //TODO
  }

  const added = await db
    .insertInto('League')
    .values(data)
    .onConflict(oc => oc.columns(['season', 'externalLeagueId']).doUpdateSet(data))
    .returningAll()
    .executeTakeFirst()

  return added
}
