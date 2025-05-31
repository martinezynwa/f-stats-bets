"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userBetsSchema = void 0;
const zod_1 = require("zod");
exports.userBetsSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    dateFrom: zod_1.z.string(),
    dateTo: zod_1.z.string(),
});
