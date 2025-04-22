"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateItemSchema = exports.createItemSchema = void 0;
const zod_1 = require("zod");
exports.createItemSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
});
exports.updateItemSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
});
