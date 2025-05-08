"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Application_1 = __importDefault(require("../models/Application"));
const router = express_1.default.Router();
// POST /api/applications - submit a new loan application
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const application = new Application_1.default(req.body);
        yield application.save();
        res.status(201).json({ message: 'Application submitted successfully', application });
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to submit application', details: error });
    }
}));
// GET /api/applications/stats - get dashboard statistics
router.get('/stats', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const total = yield Application_1.default.countDocuments();
        const approved = yield Application_1.default.countDocuments({ status: 'approved' });
        const rejected = yield Application_1.default.countDocuments({ status: 'rejected' });
        const pending = yield Application_1.default.countDocuments({ status: 'pending' });
        const averageAmountResult = yield Application_1.default.aggregate([
            { $group: { _id: null, average: { $avg: '$amount' } } }
        ]);
        const averageAmount = ((_a = averageAmountResult[0]) === null || _a === void 0 ? void 0 : _a.average) || 0;
        const successRate = total ? ((approved / total) * 100).toFixed(2) : 0;
        res.json({
            totalApplications: total,
            approved,
            rejected,
            pending,
            averageLoanAmount: averageAmount,
            applicationSuccessRate: `${successRate}%`
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch statistics', details: error });
    }
}));
exports.default = router;
