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
export declare const mockBetsSchema: z.ZodObject<{
    userId: z.ZodString;
    dateFrom: z.ZodString;
    dateTo: z.ZodString;
    deletePreviousBets: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    dateFrom: string;
    dateTo: string;
    deletePreviousBets?: boolean | undefined;
}, {
    userId: string;
    dateFrom: string;
    dateTo: string;
    deletePreviousBets?: boolean | undefined;
}>;
export type MockBetsSchema = z.infer<typeof mockBetsSchema>;
