"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserSchema = void 0;
const zod_1 = require("zod");
exports.registerUserSchema = zod_1.z.object({
    providerId: zod_1.z.string(),
    providerName: zod_1.z.string(),
    providerAvatar: zod_1.z.string(),
});
