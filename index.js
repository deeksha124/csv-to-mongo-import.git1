const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
const csvParser = require('csv-parser');


const mongoURL = 'mongodb+srv://test:test123@deeksha.ermas.mongodb.net/';


mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define the user schema and model
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String
});

const User = mongoose.model('User', userSchema);

// Function to insert data from CSV into MongoDB
const insertDataFromCSV = async (csvFilePath) => {
  try {
    const results = [];
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        for (const record of results) {
          const user = new User({
            name: record.name,
            age: parseInt(record.age, 10),
            email: record.email
          });
          await user.save();
        }
        console.log('Data successfully inserted into MongoDB');
        mongoose.connection.close();
      });
  } catch (error) {
    console.error('Error inserting data:', error);
  }
};

// Correctly specify the path to your CSV file
const csvFilePath = path.join(__dirname, 'file.csv'); // Adjust this path to your actual file location

// Call the function with the correct file path
insertDataFromCSV(csvFilePath);
