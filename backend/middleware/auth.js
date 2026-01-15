const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// JWT token oluştur
const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: '7d' // Token 7 gün geçerli
    });
};

// JWT token doğrula (middleware)
const verifyToken = (req, res, next) => {
    try {
        // Token'ı header'dan al
        const token = req.headers.authorization?.split(' ')[1]; // "Bearer TOKEN" formatı
        
        if (!token) {
            return res.status(401).json({ 
                error: 'Erişim reddedildi', 
                message: 'Token bulunamadı' 
            });
        }

        // Token'ı doğrula
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId; // userId'yi request'e ekle
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                error: 'Token süresi dolmuş', 
                message: 'Lütfen tekrar giriş yapın' 
            });
        }
        return res.status(401).json({ 
            error: 'Geçersiz token', 
            message: 'Token doğrulanamadı' 
        });
    }
};

module.exports = {
    generateToken,
    verifyToken
};
