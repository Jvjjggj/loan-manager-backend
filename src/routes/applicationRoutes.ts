import express, { Request, Response } from 'express';
import LoanApplication from '../models/Application';

const router = express.Router();

// POST /api/applications - submit a new loan application
router.post('/applications', async (req: Request, res: Response) => {
  console.log('Body received:', req.body);
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
  console.log("Hi")
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

router.post('/test-post', (req: Request, res: Response) => {
  res.json({ message: 'POST to test-post is working', body: req.body });
});


// GET /api/applications/pending - fetch all pending applications
router.get('/applications/pending', async (req: Request, res: Response) => {
  try {
    const pendingApps = await LoanApplication.find({ status: 'pending' });
    res.json(pendingApps);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pending applications', error });
  }
});

// PATCH /api/applications/:id/verify - mark application as verified
router.patch('/applications/:id/verify', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const application = await LoanApplication.findByIdAndUpdate(
      id,
      { status: 'verified' }, // or 'approved'
      { new: true }
    );

    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return 
    }

    res.json({ message: 'Application status updated to verified', application });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status', error });
  }
});


// PATCH /api/applications/:id/reject - mark application as rejected
router.patch('/applications/:id/reject', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const application = await LoanApplication.findByIdAndUpdate(
      id,
      { status: 'rejected' },
      { new: true }
    );

    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return 
    }

    res.json({ message: 'Application status updated to rejected', application });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reject application', error });
  }
});


router.get('/applications', async (req: Request, res: Response) => {
  try {
    const allApplications = await LoanApplication.find();
    res.json(allApplications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch all applications', error });
  }
});


export default router;
