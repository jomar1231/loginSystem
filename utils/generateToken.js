const jwt = require('jsonwebtoken');

const generateToken = (payload, res) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'default_secret', { expiresIn: '3d' });
    res.cookie("jwt", token, {
        httpOnly: true,
        secured : process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge : 1000 * 60 * 60,
    });
    return token;
};

module.exports = generateToken; 