import { z } from 'zod';
export declare const userBetsSchema: z.ZodObject<{
    userId: z.ZodString;
    dateFrom: z.ZodString;
    dateTo: z.ZodString;
}, "strip", z.ZodTypeAny, {
    userId: string;
    dateFrom: string;
    dateTo: string;
}, {
    userId: string;
    dateFrom: string;
    dateTo: string;
}>;
export type UserBetsSchema = z.infer<typeof userBetsSchema>;
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
