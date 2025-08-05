/**
 * This file exports database types with Selectable, Insertable, and Updateable wrappers.
 * These types are derived from the generated types.
 */

import type { Selectable, Insertable, Updateable, ColumnType } from 'kysely'
import type { DB } from './generated.types'

// Export custom types
export type Timestamp = ColumnType<Date, Date | string, Date | string>

// Export enums
export enum BetResultType {
  AWAY_WIN = "AWAY_WIN",
  DRAW = "DRAW",
  HOME_WIN = "HOME_WIN",
  
}

export enum FederationType {
  AFRICA = "AFRICA",
  ASIA = "ASIA",
  EUROPE = "EUROPE",
  NORTH_CENTRAL_AMERICA = "NORTH_CENTRAL_AMERICA",
  OCEANIA = "OCEANIA",
  SOUTH_AMERICA = "SOUTH_AMERICA",
  WORLD = "WORLD",
  
}

export enum LeagueType {
  CLUB_TOURNAMENT = "ClubTournament",
  FRIENDLY = "Friendly",
  LEAGUE = "League",
  LEAGUE_CUP = "LeagueCup",
  NATIONAL_TOURNAMENT = "NationalTournament",
  TOTALS = "Totals",
  UNASSIGNED = "Unassigned",
  
}

export enum LogType {
  ERROR = "ERROR",
  INFO = "INFO",
  WARNING = "WARNING",
  
}

export enum OrganizationType {
  AFC = "AFC",
  AUSTRIA = "AUSTRIA",
  BELGIUM = "BELGIUM",
  CAF = "CAF",
  CONCACAF = "CONCACAF",
  CONMEBOL = "CONMEBOL",
  CZECH = "CZECH",
  ENGLAND = "ENGLAND",
  FIFA = "FIFA",
  FRANCE = "FRANCE",
  GERMANY = "GERMANY",
  ITALY = "ITALY",
  NETHERLANDS = "NETHERLANDS",
  OFC = "OFC",
  PORTUGAL = "PORTUGAL",
  SPAIN = "SPAIN",
  TURKEY = "TURKEY",
  UEFA = "UEFA",
  
}

export interface DatabaseTypes {
  Bet: Selectable<DB['Bet']>
  BetCompetition: Selectable<DB['BetCompetition']>
  BetCompetitionToLeague: Selectable<DB['BetCompetitionToLeague']>
  BetEvaluated: Selectable<DB['BetEvaluated']>
  Fixture: Selectable<DB['Fixture']>
  FixtureRound: Selectable<DB['FixtureRound']>
  League: Selectable<DB['League']>
  Log: Selectable<DB['Log']>
  Nation: Selectable<DB['Nation']>
  Player: Selectable<DB['Player']>
  PlayerToTeam: Selectable<DB['PlayerToTeam']>
  Season: Selectable<DB['Season']>
  Team: Selectable<DB['Team']>
  TeamToLeague: Selectable<DB['TeamToLeague']>
  User: Selectable<DB['User']>
  UserSettings: Selectable<DB['UserSettings']>
  UserToBetCompetition: Selectable<DB['UserToBetCompetition']>
}

export type Bet = Selectable<DB['Bet']>
export type InsertBet = Insertable<DB['Bet']>
export type UpdateBet = Updateable<DB['Bet']>

export type BetCompetition = Selectable<DB['BetCompetition']>
export type InsertBetCompetition = Insertable<DB['BetCompetition']>
export type UpdateBetCompetition = Updateable<DB['BetCompetition']>

export type BetCompetitionToLeague = Selectable<DB['BetCompetitionToLeague']>
export type InsertBetCompetitionToLeague = Insertable<DB['BetCompetitionToLeague']>
export type UpdateBetCompetitionToLeague = Updateable<DB['BetCompetitionToLeague']>

export type BetEvaluated = Selectable<DB['BetEvaluated']>
export type InsertBetEvaluated = Insertable<DB['BetEvaluated']>
export type UpdateBetEvaluated = Updateable<DB['BetEvaluated']>

export type Fixture = Selectable<DB['Fixture']>
export type InsertFixture = Insertable<DB['Fixture']>
export type UpdateFixture = Updateable<DB['Fixture']>

export type FixtureRound = Selectable<DB['FixtureRound']>
export type InsertFixtureRound = Insertable<DB['FixtureRound']>
export type UpdateFixtureRound = Updateable<DB['FixtureRound']>

export type League = Selectable<DB['League']>
export type InsertLeague = Insertable<DB['League']>
export type UpdateLeague = Updateable<DB['League']>

export type Log = Selectable<DB['Log']>
export type InsertLog = Insertable<DB['Log']>
export type UpdateLog = Updateable<DB['Log']>

export type Nation = Selectable<DB['Nation']>
export type InsertNation = Insertable<DB['Nation']>
export type UpdateNation = Updateable<DB['Nation']>

export type Player = Selectable<DB['Player']>
export type InsertPlayer = Insertable<DB['Player']>
export type UpdatePlayer = Updateable<DB['Player']>

export type PlayerToTeam = Selectable<DB['PlayerToTeam']>
export type InsertPlayerToTeam = Insertable<DB['PlayerToTeam']>
export type UpdatePlayerToTeam = Updateable<DB['PlayerToTeam']>

export type Season = Selectable<DB['Season']>
export type InsertSeason = Insertable<DB['Season']>
export type UpdateSeason = Updateable<DB['Season']>

export type Team = Selectable<DB['Team']>
export type InsertTeam = Insertable<DB['Team']>
export type UpdateTeam = Updateable<DB['Team']>

export type TeamToLeague = Selectable<DB['TeamToLeague']>
export type InsertTeamToLeague = Insertable<DB['TeamToLeague']>
export type UpdateTeamToLeague = Updateable<DB['TeamToLeague']>

export type User = Selectable<DB['User']>
export type InsertUser = Insertable<DB['User']>
export type UpdateUser = Updateable<DB['User']>

export type UserSettings = Selectable<DB['UserSettings']>
export type InsertUserSettings = Insertable<DB['UserSettings']>
export type UpdateUserSettings = Updateable<DB['UserSettings']>

export type UserToBetCompetition = Selectable<DB['UserToBetCompetition']>
export type InsertUserToBetCompetition = Insertable<DB['UserToBetCompetition']>
export type UpdateUserToBetCompetition = Updateable<DB['UserToBetCompetition']>

