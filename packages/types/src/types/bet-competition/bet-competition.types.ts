import { BetCompetition } from '../../database.types'

export type BetCompetitionWithLeagues = BetCompetition & {
  leagueIds: string[]
}
