import { z } from 'zod';
export declare const createBetSchema: z.ZodObject<{
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
}, {
    name: string;
}>;
export type CreateBetSchema = z.infer<typeof createBetSchema>;
export declare const updateBetSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
}, {
    id: string;
    name: string;
}>;
export type UpdateBetSchema = z.infer<typeof updateBetSchema>;
