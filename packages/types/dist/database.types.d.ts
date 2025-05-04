/**
 * This file exports database types with Selectable, Insertable, and Updateable wrappers.
 * These types are derived from the generated types.
 */
import type { Selectable, Insertable, Updateable, ColumnType } from 'kysely';
import type { DB } from './generated.types';
export type FederationType = "AFRICA" | "ASIA" | "EUROPE" | "NORTH_CENTRAL_AMERICA" | "OCEANIA" | "SOUTH_AMERICA" | "WORLD";
export type LeagueType = "ClubTournament" | "Friendly" | "League" | "LeagueCup" | "NationalTournament" | "Totals" | "Unassigned";
export type OrganizationType = "AFC" | "AUSTRIA" | "BELGIUM" | "CAF" | "CONCACAF" | "CONMEBOL" | "CZECH" | "ENGLAND" | "FIFA" | "FRANCE" | "GERMANY" | "ITALY" | "NETHERLANDS" | "OFC" | "PORTUGAL" | "SPAIN" | "TURKEY" | "UEFA";
export type Timestamp = ColumnType<Date, Date | string, Date | string>;
export interface DatabaseTypes {
    Bet: Selectable<DB['Bet']>;
    Fixture: Selectable<DB['Fixture']>;
    League: Selectable<DB['League']>;
    Nation: Selectable<DB['Nation']>;
    Season: Selectable<DB['Season']>;
    User: Selectable<DB['User']>;
    UserSettings: Selectable<DB['UserSettings']>;
}
export type Bet = Selectable<DB['Bet']>;
export type InsertBet = Insertable<DB['Bet']>;
export type UpdateBet = Updateable<DB['Bet']>;
export type Fixture = Selectable<DB['Fixture']>;
export type InsertFixture = Insertable<DB['Fixture']>;
export type UpdateFixture = Updateable<DB['Fixture']>;
export type League = Selectable<DB['League']>;
export type InsertLeague = Insertable<DB['League']>;
export type UpdateLeague = Updateable<DB['League']>;
export type Nation = Selectable<DB['Nation']>;
export type InsertNation = Insertable<DB['Nation']>;
export type UpdateNation = Updateable<DB['Nation']>;
export type Season = Selectable<DB['Season']>;
export type InsertSeason = Insertable<DB['Season']>;
export type UpdateSeason = Updateable<DB['Season']>;
export type User = Selectable<DB['User']>;
export type InsertUser = Insertable<DB['User']>;
export type UpdateUser = Updateable<DB['User']>;
export type UserSettings = Selectable<DB['UserSettings']>;
export type InsertUserSettings = Insertable<DB['UserSettings']>;
export type UpdateUserSettings = Updateable<DB['UserSettings']>;
