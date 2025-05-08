import express from 'express';
import Application from '../models/Application';

const router = express.Router();

// POST /api/applications - submit a new loan application
router.post('/', async (req, res) => {
  try {
    const application = new Application(req.body);
    await application.save();
    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    res.status(400).json({ error: 'Failed to submit application', details: error });
  }
});


// GET /api/applications/stats - get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const total = await Application.countDocuments();
    const approved = await Application.countDocuments({ status: 'approved' });
    const rejected = await Application.countDocuments({ status: 'rejected' });
    const pending = await Application.countDocuments({ status: 'pending' });

    const averageAmountResult = await Application.aggregate([
      { $group: { _id: null, average: { $avg: '$amount' } } }
    ]);

    const averageAmount = averageAmountResult[0]?.average || 0;
    const successRate = total ? ((approved / total) * 100).toFixed(2) : 0;

    res.json({
      totalApplications: total,
      approved,
      rejected,
      pending,
      averageLoanAmount: averageAmount,
      applicationSuccessRate: `${successRate}%`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics', details: error });
  }
});


export default router;
