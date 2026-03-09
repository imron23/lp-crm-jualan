require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

const prisma = new PrismaClient();
const app = express();

// Security Headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'self'"],
            "script-src": ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
            "style-src": ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
            "font-src": ["'self'", "https://cdnjs.cloudflare.com", "https://fonts.gstatic.com"],
            "img-src": ["'self'", "data:", "https://*"],
            "connect-src": ["'self'"]
        }
    }
}));

// Rate Limiting (Prevent Brute Force)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { success: false, error: 'Terlalu banyak permintaan dari IP ini, coba lagi nanti.' }
});
app.use('/api/', apiLimiter);

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

// Submit Lead (Public) with Validation & Sanitization
app.post('/api/leads', [
    body('name').trim().isLength({ min: 2 }).escape(),
    body('phone').trim().isLength({ min: 10, max: 15 }).escape(),
    body('location').trim().escape(),
    body('position').trim().escape(),
    body('expected_features').trim().escape(),
], async (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

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

        // Extra layer of protection for DB interactions
        const lead = await prisma.lead.create({
            data: {
                name: String(name).substring(0, 100), // Enforce length limits
                phone: String(phone).substring(0, 20),
                location: String(location).substring(0, 150),
                position: String(position),
                adsBudget: String(ads_budget),
                pilgrimsCount: parseInt(pilgrims_count) || null,
                obstacles: Array.isArray(obstacles) ? obstacles.join(', ') : String(obstacles),
                expectedFeatures: String(expected_features).substring(0, 500),
                meetingTime: String(meeting_time),
                agreed: !!agree
            }
        });

        res.status(201).json({ success: true, lead });
    } catch (error) {
        console.error('CRITICAL: Error creating lead:', error);
        res.status(500).json({ success: false, error: 'Sistem sedang sibuk, gagal menyimpan data.' });
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
    if (q.length < 2) {
        return res.json({ success: true, data: [] });
    }

    const matched = wilayahData.filter(item =>
        item.kecamatan.toLowerCase().includes(q) ||
        item.kota.toLowerCase().includes(q)
    ).slice(0, 20); // Limit to top 20 results

    res.json({ success: true, data: matched });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
});
