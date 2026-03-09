require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const app = express();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';

// Load Wilayah Data
const wilayahData = require('./wilayah.json');

app.use(express.json());
app.use(express.static(__dirname));

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ success: false, error: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ success: false, error: 'Forbidden' });
        req.user = user;
        next();
    });
};

// Login Endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
        return res.json({ success: true, token });
    }

    res.status(401).json({ success: false, error: 'Invalid credentials' });
});

// Submit Lead (Public)
app.post('/api/leads', async (req, res) => {
    try {
        const {
            name,
            phone,
            location,
            position,
            ads_budget,
            pilgrims_count,
            obstacles,
            expected_features,
            meeting_time,
            agree
        } = req.body;

        const lead = await prisma.lead.create({
            data: {
                name,
                phone,
                location,
                position,
                adsBudget: ads_budget,
                pilgrimsCount: parseInt(pilgrims_count) || null,
                obstacles: Array.isArray(obstacles) ? obstacles.join(', ') : obstacles,
                expectedFeatures: expected_features,
                meetingTime: meeting_time,
                agreed: !!agree
            }
        });

        res.status(201).json({ success: true, lead });
    } catch (error) {
        console.error('Error creating lead:', error);
        res.status(500).json({ success: false, error: 'Failed to save lead' });
    }
});

// Get Leads (Protected)
app.get('/api/leads', authenticateToken, async (req, res) => {
    try {
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch leads' });
    }
});

// Search Wilayah (Public)
app.get('/api/wilayah/search', (req, res) => {
    const q = req.query.q ? req.query.q.toLowerCase() : '';
    if (q.length < 3) {
        return res.json({ success: true, data: [] });
    }

    const matched = wilayahData.filter(item =>
        item.kecamatan.toLowerCase().includes(q) ||
        item.kota.toLowerCase().includes(q)
    ).slice(0, 20); // Limit to top 20 results

    res.json({ success: true, data: matched });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
});
