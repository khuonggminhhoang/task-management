module.exports.register = (req, res, next) => {
    if(!req.body.fullName || !req.body.password){
        res.json({
            code: 400,
            message: "Username and password are required"
        });
        return;
    }

    if(!req.body.email) {
        res.json({
            code: 400,
            message: "Email is required"
        });
        return;
    }

    next();
}

module.exports.login = (req, res, next) => {
    if(!req.body.email || !req.body.password){
        res.json({
            code: 400,
            message: "Username and password are required"
        });
        return;
    }

    if(req.body.password.length < 8) {
        res.json({
            code: 400,
            message: "Password must be at least 8 characters"
        });
        return;
    }

    next();
}

