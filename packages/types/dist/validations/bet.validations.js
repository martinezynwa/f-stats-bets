"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBetSchema = exports.updateBetSchema = exports.createBetSchema = exports.userBetsFromFixtureIdsSchema = exports.getBetsSchema = void 0;
const zod_1 = require("zod");
const database_types_1 = require("../database.types");
const shared_validations_1 = require("./shared.validations");
exports.getBetsSchema = zod_1.z
    .object({
    userId: zod_1.z.string(),
})
    .merge(shared_validations_1.paginationProps);
exports.userBetsFromFixtureIdsSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    dateFrom: zod_1.z.string(),
    dateTo: zod_1.z.string(),
    betCompetitionId: zod_1.z.string().optional(),
});
exports.createBetSchema = zod_1.z.object({
    fixtureId: zod_1.z.number(),
    leagueId: zod_1.z.string(),
    season: zod_1.z.number(),
    userId: zod_1.z.string(),
    betCompetitionId: zod_1.z.string(),
    fixtureResultBet: zod_1.z.nativeEnum(database_types_1.BetResultType),
});
exports.updateBetSchema = zod_1.z.object({
    betId: zod_1.z.string(),
    fixtureResultBet: zod_1.z.nativeEnum(database_types_1.BetResultType),
});
exports.deleteBetSchema = zod_1.z.object({
    betId: zod_1.z.string(),
});
