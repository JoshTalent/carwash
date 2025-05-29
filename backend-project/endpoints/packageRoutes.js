import express from 'express';
import { pool } from '../middleware.js';

const router = express.Router();

// Get all packages
router.get('/', async (req, res) => {
    try {
        const [packages] = await pool.query('SELECT * FROM Package');
        res.json(packages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching packages' });
    }
});

// Add new package
router.post('/', async (req, res) => {
    try {
        const { PackageName, PackageDescription, PackagePrice } = req.body;
        
        // Validate required fields
        if (!PackageName || !PackageDescription || !PackagePrice) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Insert new package
        const [result] = await pool.query(
            'INSERT INTO Package (PackageName, PackageDescription, PackagePrice) VALUES (?, ?, ?)',
            [PackageName, PackageDescription, PackagePrice]
        );

        // Get the inserted package
        const [newPackage] = await pool.query(
            'SELECT * FROM Package WHERE PackageNumber = ?',
            [result.insertId]
        );

        res.status(201).json(newPackage[0]);
    } catch (error) {
        console.error('Error adding package:', error);
        res.status(500).json({ message: 'Error adding package' });
    }
});

export default router;