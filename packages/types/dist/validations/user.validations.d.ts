import { z } from 'zod';
export declare const registerUserSchema: z.ZodObject<{
    name: z.ZodString;
    providerId: z.ZodString;
    providerName: z.ZodString;
    providerAvatar: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    providerAvatar: string;
    providerId: string;
    providerName: string;
}, {
    name: string;
    providerAvatar: string;
    providerId: string;
    providerName: string;
}>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
