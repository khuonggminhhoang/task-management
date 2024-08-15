const jwt = require('jsonwebtoken');

module.exports.verifyToken = (req, res, next) => {
    const accessToken = req.headers.access_token;
    jwt.verify(accessToken, process.env.KEY_ACCESS_TOKEN, (err, decoded) => {
        if(err) {
            res.json({
                code: 401,
                message: "You ane not authenticated",
                error: err
            });
            return;
        }

        req.user = decoded;
        next();
    });
};