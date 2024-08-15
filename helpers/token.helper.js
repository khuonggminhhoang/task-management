const jwt = require('jsonwebtoken');

module.exports = (payload, secretKey, expiresIn) => {
    return jwt.sign(payload, secretKey, {expiresIn: expiresIn});
} 