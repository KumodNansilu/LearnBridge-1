const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Atlas Error: ${error.message}`);
    console.log('Attempting to connect to mongodb-memory-server as a fallback...');
    try {
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const fallbackConn = await mongoose.connect(mongoUri);
      console.log(`In-Memory MongoDB Connected at: ${mongoUri}`);
    } catch (localError) {
      console.error(`In-Memory MongoDB Error: ${localError.message}`);
      console.log('Could not connect to any MongoDB instance. Please check your DB connection.');
      // Do not exit process completely so the app still runs, but API calls relying on DB will fail
    }
  }
};

module.exports = connectDB;
