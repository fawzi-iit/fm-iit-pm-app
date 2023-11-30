const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // Add other mongoose options here as needed
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
