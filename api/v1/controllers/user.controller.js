const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('./../models/user.model');

// [POST] /api/v1/user/register
module.exports.register = async (req, res) => {
    const existEmail = await User.findOne({email: req.body.email});
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

    res.cookie('pass', hashPassword);

    res.json({
        code: 200,
        message: "OK",
        userInfo: newUser._doc
    });
}

