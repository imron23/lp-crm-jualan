const express = require('express');
const { PrismaClient } = require('@prisma/client');
const path = require('path');

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// Submit Lead
app.post('/api/leads', async (req, res) => {
    try {
        const {
            name,
            phone,
            location,
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

// Get Leads (for Dashboard)
app.get('/api/leads', async (req, res) => {
    try {
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch leads' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
});
