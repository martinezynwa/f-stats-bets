"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBetSchema = exports.createBetSchema = void 0;
const zod_1 = require("zod");
exports.createBetSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
});
exports.updateBetSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
});
