const User = require('./../models/user.model');

module.exports.detail = async (req, res) => {
    const idUser = req.user.id;
    try {
        const currUser = await User.findOne({_id: idUser, deleted: false}).select('-password -deleted');
        res.json(currUser);
    }
    catch(err) {
        res.status(500).json({message: "Internal Server Error"});
    }

}