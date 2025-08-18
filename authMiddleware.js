const jwt = require('jsonwebtoken');
const secretKey = 'supersecretkey';

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).send({ message: 'Token required' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(401).send({ message: 'Invalid or expired token' });
        req.user = decoded;
        next();
    });
}

function verifyAdmin(req, res, next) {
    if (req.user.role !== 'admin') return res.status(403).send({ message: 'Admin only' });
    next();
}

module.exports = { verifyToken, verifyAdmin, secretKey };
