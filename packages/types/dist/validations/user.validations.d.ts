import { z } from 'zod';
export declare const registerUserSchema: z.ZodObject<{
    providerId: z.ZodString;
    providerName: z.ZodString;
    providerAvatar: z.ZodString;
}, "strip", z.ZodTypeAny, {
    providerAvatar: string;
    providerId: string;
    providerName: string;
}, {
    providerAvatar: string;
    providerId: string;
    providerName: string;
}>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
