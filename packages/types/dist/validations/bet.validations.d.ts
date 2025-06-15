import { z } from 'zod';
import { BetResultType } from '../database.types';
export declare const getBetsSchema: z.ZodObject<z.objectUtil.extendShape<{
    userId: z.ZodString;
}, {
    cursor: z.ZodOptional<z.ZodString>;
    take: z.ZodOptional<z.ZodString>;
}>, "strip", z.ZodTypeAny, {
    userId: string;
    cursor?: string | undefined;
    take?: string | undefined;
}, {
    userId: string;
    cursor?: string | undefined;
    take?: string | undefined;
}>;
export type GetBetsSchema = z.infer<typeof getBetsSchema>;
export declare const userBetsFromFixtureIdsSchema: z.ZodObject<{
    userId: z.ZodString;
    dateFrom: z.ZodString;
    dateTo: z.ZodString;
    betCompetitionId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    dateFrom: string;
    dateTo: string;
    betCompetitionId?: string | undefined;
}, {
    userId: string;
    dateFrom: string;
    dateTo: string;
    betCompetitionId?: string | undefined;
}>;
export type UserBetsFromFixtureIdsSchema = z.infer<typeof userBetsFromFixtureIdsSchema>;
export declare const createBetSchema: z.ZodObject<{
    fixtureId: z.ZodNumber;
    leagueId: z.ZodString;
    season: z.ZodNumber;
    userId: z.ZodString;
    betCompetitionId: z.ZodString;
    fixtureResultBet: z.ZodNativeEnum<typeof BetResultType>;
}, "strip", z.ZodTypeAny, {
    betCompetitionId: string;
    fixtureId: number;
    fixtureResultBet: BetResultType;
    leagueId: string;
    season: number;
    userId: string;
}, {
    betCompetitionId: string;
    fixtureId: number;
    fixtureResultBet: BetResultType;
    leagueId: string;
    season: number;
    userId: string;
}>;
export type CreateBetSchema = z.infer<typeof createBetSchema>;
export declare const updateBetSchema: z.ZodObject<{
    betId: z.ZodString;
    fixtureResultBet: z.ZodNativeEnum<typeof BetResultType>;
}, "strip", z.ZodTypeAny, {
    betId: string;
    fixtureResultBet: BetResultType;
}, {
    betId: string;
    fixtureResultBet: BetResultType;
}>;
export type UpdateBetSchema = z.infer<typeof updateBetSchema>;
export declare const deleteBetSchema: z.ZodObject<{
    betId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    betId: string;
}, {
    betId: string;
}>;
export type DeleteBetSchema = z.infer<typeof deleteBetSchema>;
