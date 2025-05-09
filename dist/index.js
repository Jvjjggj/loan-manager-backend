"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const applicationRoutes_1 = __importDefault(require("./routes/applicationRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api', applicationRoutes_1.default);
// Root endpoint
app.get('/', (req, res) => {
    res.send('Loan Manager Backend is running');
});
// Connect to MongoDB
mongoose_1.default.connect(process.env.MONGO_URI || '')
    .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
    .catch(err => {
    console.error('MongoDB connection error:', err);
});
