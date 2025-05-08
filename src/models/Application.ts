// src/models/Application.ts
import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  amount: { type: Number, required: true },
  tenure: { type: Number, required: true },
  employmentStatus: { type: String, required: true },
  loanReason: { type: String, required: true },
  employmentAddress: { type: String, required: true },
  status: { type: String, default: 'pending' }
}, { timestamps: true });

export default mongoose.model('LoanApplication', applicationSchema);
