const mongoose = require('mongoose');

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("Connect Successfully to MongoDB");
    }
    catch (err) {
        console.error("Connect Failed to MongoDB");
    }

}