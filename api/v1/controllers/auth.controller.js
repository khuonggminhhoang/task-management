const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('./../models/user.model');

const tokenHelper = require('./../../../helpers/token.helper');

// [POST] /api/v1/auth/register
module.exports.register = async (req, res) => {
    const existEmail = await User.findOne({email: req.body.email, deleted: false});
    if(existEmail) {
        res.json({
            code: 409,
            message: 'Email existed'
        });
        return;
    }

    const saltRounds = 10;
    const plainTextPassword = req.body.password;

    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(plainTextPassword, salt);
    
    const obj = {
        fullName: req.body.fullName,
        email: req.body.email,
        password: hashPassword
    }
    const newUser = new User(obj);
    await newUser.save();

    res.json({
        code: 200,
        message: "OK",
        userInfo: newUser._doc
    });
}

// [POST] /api/v1/auth/login
module.exports.login = async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({email: email, deleted: false});
    if(!user) {
        res.json({
            code: 400,
            message: "Email is not valid"
        });
        return;
    }

    const check = await bcrypt.compare(req.body.password, user.password);
    if(!check) {
        res.json({
            code: 400,
            message: "Error Password"
        });
        return;
    }

    const {password, ...other} = user._doc;

    const accessToken = tokenHelper({
        id: user.id,
        email: user.email
    }, process.env.KEY_ACCESS_TOKEN, ' 30s');

    const refreshToken = tokenHelper({
        id: user.id,
        email: user.email
    }, process.env.KEY_REFRESH_TOKEN, '20s');

    res.json({
        code: 200,
        message: "OK",
        userInfo: other,
        accessToken: accessToken,
        refreshToken: refreshToken
    });
}

// [POST] /api/v1/auth/refresh-token
module.exports.refreshTokenRequired = (req, res) => {
    const refreshToken = req.headers.refresh_token;
    jwt.verify(refreshToken, process.env.KEY_REFRESH_TOKEN, (err, decoded) => {
        if(err) {
            res.json({
                code: 401,
                message: "Unauthorized"
            });
            return;
        }
        const accessToken = tokenHelper({
            id: decoded.id,
            email: decoded.email
        }, process.env.KEY_REFRESH_TOKEN, '30s');      // 30s hết hạn
        
        res.json({
            code: 200,
            message: "OK",
            accessToken: accessToken
        });
    });
}