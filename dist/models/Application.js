"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/Application.ts
const mongoose_1 = __importDefault(require("mongoose"));
const applicationSchema = new mongoose_1.default.Schema({
    fullName: { type: String, required: true },
    amount: { type: Number, required: true },
    tenure: { type: Number, required: true },
    employmentStatus: { type: String, required: true },
    loanReason: { type: String, required: true },
    employmentAddress: { type: String, required: true },
    status: { type: String, default: 'pending' }
}, { timestamps: true });
exports.default = mongoose_1.default.model('LoanApplication', applicationSchema);
