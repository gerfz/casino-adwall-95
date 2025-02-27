const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

const uri = process.env.MONGO_URI;
const logOutput = `Attempting to connect to MongoDB with URI: ${uri}\n`;
fs.writeFileSync('mongo-connection-test.log', logOutput);

mongoose.connect(uri)
  .then(() => {
    const successMsg = 'MongoDB connection successful!\n';
    fs.appendFileSync('mongo-connection-test.log', successMsg);
    console.log(successMsg);
    process.exit(0);
  })
  .catch(err => {
    const errorMsg = `MongoDB connection error: ${err.toString()}\n`;
    fs.appendFileSync('mongo-connection-test.log', errorMsg);
    console.error(errorMsg);
    process.exit(1);
  });
