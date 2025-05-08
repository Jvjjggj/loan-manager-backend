import express, { Request, Response } from 'express';
import LoanApplication from '../models/Application';

const router = express.Router();

// POST /api/applications - submit a new loan application
router.post('/applications', async (req: Request, res: Response) => {
  try {
    const { fullName, amount, tenure, employmentStatus, loanReason, employmentAddress } = req.body;

    // Validate required fields
    if (!fullName || !amount || !tenure || !employmentStatus || !loanReason || !employmentAddress) {
      res.status(400).json({ message: 'All fields are required' })
      return;
    }

    const application = await LoanApplication.create({
      fullName,
      amount,
      tenure,
      employmentStatus,
      loanReason,
      employmentAddress,
    });

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/applications/stats - get dashboard statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const total = await LoanApplication.countDocuments();
    const approved = await LoanApplication.countDocuments({ status: 'approved' });
    const rejected = await LoanApplication.countDocuments({ status: 'rejected' });
    const pending = await LoanApplication.countDocuments({ status: 'pending' });

    const averageAmountResult = await LoanApplication.aggregate([
      { $group: { _id: null, average: { $avg: '$amount' } } },
    ]);

    const averageAmount = averageAmountResult[0]?.average || 0;
    const successRate = total ? ((approved / total) * 100).toFixed(2) : 0;

    res.json({
      totalApplications: total,
      approved,
      rejected,
      pending,
      averageLoanAmount: averageAmount,
      applicationSuccessRate: `${successRate}%`,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics', details: error });
  }
});

export default router;
