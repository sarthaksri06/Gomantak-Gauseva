const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'database.json');

function readDB() {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeDB(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

router.get('/', (req, res) => {
    const db = readDB();
    res.json({ success: true, data: db.adoptions });
});

router.post('/', (req, res) => {
    const db = readDB();
    const adoption = {
        id: Date.now().toString(),
        ...req.body,
        timestamp: new Date().toISOString()
    };
    db.adoptions.push(adoption);
    writeDB(db);
    res.json({ success: true, data: adoption });
});

module.exports = router;
