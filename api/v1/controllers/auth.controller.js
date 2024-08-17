const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { totp } = require('otplib');

const User = require('./../models/user.model');

const tokenHelper = require('./../../../helpers/token.helper');
const sendMailHelper = require('./../../../helpers/sendMail.helper');

// [POST] /api/v1/auth/register
module.exports.register = async (req, res) => {
    const existEmail = await User.findOne({ email: req.body.email, deleted: false });
    if (existEmail) {
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
    const user = await User.findOne({ email: email, deleted: false });
    if (!user) {
        res.json({
            code: 400,
            message: "Email is not valid"
        });
        return;
    }

    const check = await bcrypt.compare(req.body.password, user.password);
    if (!check) {
        res.json({
            code: 400,
            message: "Error Password"
        });
        return;
    }

    const { password, ...other } = user._doc;

    const accessToken = tokenHelper({
        id: user.id,
        email: user.email
    }, process.env.KEY_ACCESS_TOKEN, 60 * 15);

    const refreshToken = tokenHelper({
        id: user.id,
        email: user.email
    }, process.env.KEY_REFRESH_TOKEN, '7d');

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
        if (err) {
            res.json({
                code: 401,
                message: "Unauthorized"
            });
            return;
        }
        const accessToken = tokenHelper({
            id: decoded.id,
            email: decoded.email
        }, process.env.KEY_ACCESS_TOKEN, 60 * 15);      // 30s hết hạn

        res.json({
            code: 200,
            message: "OK",
            accessToken: accessToken
        });
    });
}

// [POST] /api/v1/auth/password/forgot
module.exports.forgotPassword = async (req, res) => {
    const email = req.body.email;
    const existed = await User.findOne({ email: email });
    if (!existed) {
        res.json({
            code: 400,
            message: "Email is not existed"
        });
        return;
    }

    const secret = process.env.SECRET_KEY + email;
    totp.options = { digits: 8, step: 60 };
    const otp = totp.generate(secret);

    const toEmail = email;
    const subject = '[TASK] OTP đổi mật khẩu'
    const html = `
                Mã OTP của bạn: 
                <b>${otp}</b>. 
                <br>
                Lưu ý: OTP chỉ có hiệu lực trong 60s
                <hr>
                FACEBOOK: <a href='https://www.facebook.com/khuongminhminh.hoang/'> [ADMIN_TASK]
        `
    sendMailHelper.sendMail(toEmail, subject, html);

    res.json({
        code: 200,
        message: "OK",
        email: email,
    });
}

// [POST] /api/v1/auth/password/otp
module.exports.otpPassword = (req, res) => {
    const otp = req.body.otp;
    const email = req.body.email;
    const verify  = totp.verify({token: otp, secret: process.env.SECRET_KEY + email});
    if(verify) {
        res.json({
            code: 200,
            message: "OK",
            email: email,
            isOtpVerified: true
        });
        return;
    }

    res.json({
        code: 401,
        message: "Unauthorized"
    });
}

// [POST] /api/v1/auth/password/reset
module.exports.resetPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        
        const user = await User.findOne({email: email, deleted: false});

        const isOtpVerified = req.headers.isotpverified;
        if(!isOtpVerified) {
            res.json({
                code: 401,
                message: "Unauthorized action"
            });
            return;
        }

        if(!user) {
            res.json({
                code: 404,
                message: "User not found"
            });
            return;
        }
        
        const check = await bcrypt.compare(password, user.password);
        if(check) {
            res.json({
                code: 400,
                message: "New password cannot be the same as the current password"
            });
            return;
        }
        
        user.password = await bcrypt.hash(password, 10);
        await user.save();
        res.json({
            code: 200,
            message: "OK"
        });
    }
    catch(err) {
        res.json({
            code: 500,
            message: "Internal Server Error"
        });
    }   
}

