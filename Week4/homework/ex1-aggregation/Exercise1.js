const mongoose = require('mongoose');
const csvtojson = require('csvtojson');
const path = require('path');
require('dotenv').config(); 
console.log('MongoDB URI:', process.env.DB_URL);

// MongoDB connection URI with database name specified
const uri = process.env.DB_URL

// Define the schema
const populationSchema = new mongoose.Schema({
  Country: { type: String, required: true },
  Year: { type: Number, required: true },
  Age: { type: String, required: true },
  M: { type: Number, required: true },
  F: { type: Number, required: true }
}, { versionKey: false });

// Create a model
const Population = mongoose.model('Population', populationSchema);

// Path to the CSV file
const csvFilePath = '../databases-cohort48/Week4/homework/ex1-aggregation/population_pyramid_1950-2022.csv';

// Function to connect to MongoDB
async function connectToMongoDB() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit if connection fails
  }
}

// Function to import CSV data
async function importCSVData() {
  try {
    // Convert CSV to JSON format
    const jsonArray = await csvtojson().fromFile(csvFilePath);

    // Insert the JSON data using the Mongoose model
    await Population.insertMany(jsonArray);
    await Population.updateMany({}, { $unset: { "__v": 1 } });

    console.log('Data successfully inserted into the database.');
  } catch (error) {
    console.error('Error importing data:', error);
  }
}

// Function to get the total population per year for a given country
async function getTotalPopulationByYear(country) {
  try {
    const result = await Population.aggregate([
      {
        $match: { Country: country }
      },
      {
        $group: {
          _id: "$Year", // Group by year
          totalPopulation: { $sum: { $add: ["$M", "$F"] } } // Sum the M and F values
        }
      },
      {
        $sort: { _id: 1 } // Sort by year in ascending order
      }
    ]);

    // Format the output to return the result as an array of total populations by year
    return result.map(item => ({
      _id: item._id,
      countPopulation: item.totalPopulation
    }));
  } catch (error) {
    console.error('Error in aggregation:', error);
    throw error;
  }
}

// New Function to get all information for a given year and age field with TotalPopulation
async function getInformationByYearAndAge(year, age) {
  try {
    const result = await Population.aggregate([
      {
        $match: {
          Year: year,
          Age: age
        }
      },
      {
        $group: {
          _id: { Country: "$Country", Year: "$Year", Age: "$Age" }, // Group by Country, Year, and Age
          M: { $sum: "$M" }, // Sum M values
          F: { $sum: "$F" }, // Sum F values
          TotalPopulation: { $sum: { $add: ["$M", "$F"] } } // Calculate TotalPopulation
        }
      },
      {
        $sort: { "_id.Country": 1 } // Sort by Country
      },
      {
        $project: {
          _id: 0, // Exclude MongoDB's _id field from output
          Country: "$_id.Country",
          Year: "$_id.Year",
          Age: "$_id.Age",
          M: 1,
          F: 1,
          TotalPopulation: 1
        }
      }
    ]);

    // Return the formatted output
    return result;
  } catch (error) {
    console.error('Error in aggregation:', error);
    throw error;
  }
}

// Execute the workflow
async function run() {
  await connectToMongoDB();
  await importCSVData();

  // Replace with the desired country for total population by year
  const country = 'Netherlands';
  try {
    const populationData = await getTotalPopulationByYear(country);
    console.log('Total Population by Year:', populationData);
  } catch (err) {
    console.error('Error in getting population:', err);
  }

  // Replace with the desired year and age for detailed information
  const year = 2020;
  const age = "100+"; // Adjust as needed
  try {
    const infoData = await getInformationByYearAndAge(year, age);
    console.log('Information by Year and Age:', infoData);
  } catch (err) {
    console.error('Error in getting information:', err);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
}

run();
