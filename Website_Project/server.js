const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.post('/register', (req, res) => {
    const { studentNumber, fullName, email, password } = req.body;

    const sql = "INSERT INTO users (student_number, full_name, email, password) VALUES (?, ?, ?, ?)";
    db.query(sql, [studentNumber, fullName, email, password], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Registration failed." });
        }
        console.log("New student registered successfully!");
        res.json({ message: "Registration successful!" });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});