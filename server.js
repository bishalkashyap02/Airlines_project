const express = require('express');
const fs = require('fs');
const cors = require('cors');
const history = require('connect-history-api-fallback');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jsonServer = require('json-server');
const path = require('path');
const { verifyToken, verifyAdmin, secretKey } = require('./authMiddleware');

const enableHttps = false;
const ssloptions = {};
if (enableHttps) {
    ssloptions.cert = fs.readFileSync('./ssl/airlines_project.crt');
    ssloptions.key = fs.readFileSync('./ssl/airlines_project.pem');
}

const app = express();
app.use(cors());
app.use(express.json());

/* ---------------- JSON SERVER SETUP ---------------- */
const router = jsonServer.router('./data.json');
const db = router.db;

/* ---------------- AUTH ROUTES ---------------- */
app.post('/api/signup', (req, res) => {
    const { name, address, username, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return res.status(400).send({ message: 'Passwords do not match' });
    }
    if (db.get('users').find({ username }).value()) {
        return res.status(400).send({ message: 'Username already exists' });
    }
    const hashed = bcrypt.hashSync(password, 8);
    const newUser = { id: Date.now(), name, address, username, password: hashed, role: 'user' };
    db.get('users').push(newUser).write();
    res.send({ message: 'Signup successful' });
});

app.post('/api/signin', (req, res) => {
    const { username, password } = req.body;
    const user = db.get('users').find({ username }).value();
    if (!user) return res.status(400).send({ message: 'User not found' });
    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(400).send({ message: 'Invalid password' });
    }
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, secretKey, { expiresIn: '5h' });
    res.send({ token, role: user.role, id: user.id });
});

/* ---------------- FLIGHTS ---------------- */
app.get('/api/flights', (req, res) => res.send(db.get('planedetails').value()));
app.post('/api/flights', verifyToken, verifyAdmin, (req, res) => {
    db.get('planedetails').push(req.body).write();
    res.send({ message: 'Flight added' });
});
app.put('/api/flights/:id', verifyToken, verifyAdmin, (req, res) => {
    db.get('planedetails').find({ planeid: Number(req.params.id) }).assign(req.body).write();
    res.send({ message: 'Flight updated' });
});
app.delete('/api/flights/:id', verifyToken, verifyAdmin, (req, res) => {
    db.get('planedetails').remove({ planeid: Number(req.params.id) }).write();
    res.send({ message: 'Flight deleted' });
});

/* ---------------- BOOKINGS ---------------- */
app.post('/api/bookings', verifyToken, (req, res) => {
    const booking = { id: Date.now(), userId: req.user.id, username: req.user.username, ...req.body };
    db.get('bookings').push(booking).write();
    res.send({ message: 'Booking successful' });
});
app.get('/api/bookings', verifyToken, (req, res) => {
    let bookings = db.get('bookings').value();
    if (req.user.role !== 'admin') {
        bookings = bookings.filter(b => b.userId === req.user.id);
    }
    res.send(bookings);
});
app.delete('/api/bookings/:id', verifyToken, (req, res) => {
    const booking = db.get('bookings').find({ id: Number(req.params.id) }).value();
    if (!booking) return res.status(404).send({ message: 'Booking not found' });
    if (req.user.role !== 'admin' && booking.userId !== req.user.id) {
        return res.status(403).send({ message: 'Access denied' });
    }
    db.get('bookings').remove({ id: Number(req.params.id) }).write();
    res.send({ message: 'Booking canceled' });
});

/* ---------------- USERS ---------------- */
app.get('/api/users/:id', verifyToken, (req, res) => {
    const user = db.get('users').find({ id: Number(req.params.id) }).value();
    if (!user) return res.status(404).send({ message: 'User not found' });
    if (req.user.role !== 'admin' && req.user.id !== user.id) {
        return res.status(403).send({ message: 'Access denied' });
    }
    res.send(user);
});
app.get('/api/users', verifyToken, verifyAdmin, (req, res) => res.send(db.get('users').value()));

/* ---------------- ANGULAR APP ---------------- */
app.use(history());
app.use('/', express.static(path.join(__dirname, 'dist/airline/browser')));

/* ---------------- START SERVER ---------------- */
const PORT = 80;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

if (enableHttps) {
    const https = require('https');
    https.createServer(ssloptions, app).listen(443, () => console.log('✅ HTTPS server running on port 443'));
} else {
    console.log('⚠️ HTTPS disabled');
}
