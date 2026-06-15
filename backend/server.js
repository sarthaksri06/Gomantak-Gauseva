const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'database.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..')));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure database file exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ donations: [], adoptions: [], contacts: [] }, null, 2));
}

// Read database
function readDB() {
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (e) {
        return { donations: [], adoptions: [], contacts: [] };
    }
}

// Write database
function writeDB(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Generate ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// ========== DONATION API ==========
app.post('/api/donate', (req, res) => {
    const { name, email, phone, amount, message, paymentId } = req.body;

    if (!name || !email || !phone || !amount) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const db = readDB();
    const donation = {
        id: generateId(),
        name, email, phone, amount: parseInt(amount), message: message || '',
        paymentId: paymentId || '', status: paymentId ? 'success' : 'pending',
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    db.donations.push(donation);
    writeDB(db);

    res.json({ success: true, message: 'Donation recorded', data: donation });
});

app.get('/api/donate', (req, res) => {
    const db = readDB();
    res.json({ success: true, data: db.donations });
});

// ========== ADOPTION API ==========
app.post('/api/adopt', (req, res) => {
    const { cowName, cowAge, cowHealth, name, email, phone, address, monthlyAmount, message } = req.body;

    if (!name || !email || !phone || !address || !monthlyAmount) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const db = readDB();
    const adoption = {
        id: generateId(),
        cowName, cowAge, cowHealth, name, email, phone, address,
        monthlyAmount: parseInt(monthlyAmount), message: message || '',
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    db.adoptions.push(adoption);
    writeDB(db);

    res.json({ success: true, message: 'Adoption request recorded', data: adoption });
});

app.get('/api/adopt', (req, res) => {
    const db = readDB();
    res.json({ success: true, data: db.adoptions });
});

// ========== CONTACT API ==========
app.post('/api/contact', (req, res) => {
    const { name, email, phone, subject, subjectLabel, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const db = readDB();
    const contact = {
        id: generateId(),
        name, email, phone: phone || '', subject, subjectLabel: subjectLabel || subject, message,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    db.contacts.push(contact);
    writeDB(db);

    res.json({ success: true, message: 'Message recorded', data: contact });
});

app.get('/api/contact', (req, res) => {
    const db = readDB();
    res.json({ success: true, data: db.contacts });
});

// ========== STATS API ==========
app.get('/api/stats', (req, res) => {
    const db = readDB();
    const totalDonations = db.donations.reduce((sum, d) => sum + (d.amount || 0), 0);

    res.json({
        success: true,
        data: {
            totalDonations,
            donationCount: db.donations.length,
            adoptionCount: db.adoptions.length,
            contactCount: db.contacts.length
        }
    });
});

// ========== DELETE APIs ==========
app.delete('/api/donate/:id', (req, res) => {
    const db = readDB();
    db.donations = db.donations.filter(d => d.id !== req.params.id);
    writeDB(db);
    res.json({ success: true, message: 'Donation deleted' });
});

app.delete('/api/adopt/:id', (req, res) => {
    const db = readDB();
    db.adoptions = db.adoptions.filter(a => a.id !== req.params.id);
    writeDB(db);
    res.json({ success: true, message: 'Adoption deleted' });
});

app.delete('/api/contact/:id', (req, res) => {
    const db = readDB();
    db.contacts = db.contacts.filter(c => c.id !== req.params.id);
    writeDB(db);
    res.json({ success: true, message: 'Contact deleted' });
});

// ========== START SERVER ==========
app.listen(PORT, () => {
    console.log(`\n🐄 Gomantak Gausevak Mahasang Server`);
    console.log(`=====================================`);
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Frontend: http://localhost:${PORT}/index.html`);
    console.log(`Admin: http://localhost:${PORT}/admin/login.html`);
    console.log(`=====================================\n`);
});

module.exports = app;
