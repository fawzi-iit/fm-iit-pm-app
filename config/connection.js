const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.AZURE_COSMOS_CONNECTIONSTRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // other options if needed
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
