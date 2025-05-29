import express from 'express';
import { pool } from '../middleware.js';

const router = express.Router();

// GET /report/daily?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
router.get('/daily', async (req, res) => {
    try {
        const startDate = req.query.startDate || new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];
        const endDate = req.query.endDate || new Date().toISOString().split('T')[0];

        const [report] = await pool.query(`
            SELECT 
                py.RecordNumber,
                c.PlateNumber,
                p.PackageName,
                p.PackageDescription,
                py.AmountPaid,
                py.PaymentDate
            FROM Payment py
            LEFT JOIN ServicePackage sp ON py.RecordNumber = sp.RecordNumber
            LEFT JOIN Car c ON sp.PlateNumber = c.PlateNumber
            LEFT JOIN Package p ON sp.PackageNumber = p.PackageNumber
            WHERE DATE(py.PaymentDate) BETWEEN ? AND ?
            ORDER BY py.PaymentDate DESC
        `, [startDate, endDate]);

        res.json({
            startDate,
            endDate,
            count: report.length,
            data: report
        });
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ message: 'Error generating report' });
    }
});

export default router;
