"use strict";
/**
 * This file exports database types with Selectable, Insertable, and Updateable wrappers.
 * These types are derived from the generated types.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationType = exports.LogType = exports.LeagueType = exports.FederationType = exports.BetResultType = void 0;
// Export enums
var BetResultType;
(function (BetResultType) {
    BetResultType["AWAY_WIN"] = "AWAY_WIN";
    BetResultType["DRAW"] = "DRAW";
    BetResultType["HOME_WIN"] = "HOME_WIN";
})(BetResultType || (exports.BetResultType = BetResultType = {}));
var FederationType;
(function (FederationType) {
    FederationType["AFRICA"] = "AFRICA";
    FederationType["ASIA"] = "ASIA";
    FederationType["EUROPE"] = "EUROPE";
    FederationType["NORTH_CENTRAL_AMERICA"] = "NORTH_CENTRAL_AMERICA";
    FederationType["OCEANIA"] = "OCEANIA";
    FederationType["SOUTH_AMERICA"] = "SOUTH_AMERICA";
    FederationType["WORLD"] = "WORLD";
})(FederationType || (exports.FederationType = FederationType = {}));
var LeagueType;
(function (LeagueType) {
    LeagueType["CLUB_TOURNAMENT"] = "ClubTournament";
    LeagueType["FRIENDLY"] = "Friendly";
    LeagueType["LEAGUE"] = "League";
    LeagueType["LEAGUE_CUP"] = "LeagueCup";
    LeagueType["NATIONAL_TOURNAMENT"] = "NationalTournament";
    LeagueType["TOTALS"] = "Totals";
    LeagueType["UNASSIGNED"] = "Unassigned";
})(LeagueType || (exports.LeagueType = LeagueType = {}));
var LogType;
(function (LogType) {
    LogType["ERROR"] = "ERROR";
    LogType["INFO"] = "INFO";
    LogType["WARNING"] = "WARNING";
})(LogType || (exports.LogType = LogType = {}));
var OrganizationType;
(function (OrganizationType) {
    OrganizationType["AFC"] = "AFC";
    OrganizationType["AUSTRIA"] = "AUSTRIA";
    OrganizationType["BELGIUM"] = "BELGIUM";
    OrganizationType["CAF"] = "CAF";
    OrganizationType["CONCACAF"] = "CONCACAF";
    OrganizationType["CONMEBOL"] = "CONMEBOL";
    OrganizationType["CZECH"] = "CZECH";
    OrganizationType["ENGLAND"] = "ENGLAND";
    OrganizationType["FIFA"] = "FIFA";
    OrganizationType["FRANCE"] = "FRANCE";
    OrganizationType["GERMANY"] = "GERMANY";
    OrganizationType["ITALY"] = "ITALY";
    OrganizationType["NETHERLANDS"] = "NETHERLANDS";
    OrganizationType["OFC"] = "OFC";
    OrganizationType["PORTUGAL"] = "PORTUGAL";
    OrganizationType["SPAIN"] = "SPAIN";
    OrganizationType["TURKEY"] = "TURKEY";
    OrganizationType["UEFA"] = "UEFA";
})(OrganizationType || (exports.OrganizationType = OrganizationType = {}));
