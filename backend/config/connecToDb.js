const mongoose = require("mongoose");
const fs = require("fs");
const DataModel = require("../dataModel"); // Import the DataModel schema

const jsonData = JSON.parse(fs.readFileSync("./jsondata.json", "utf8")); // Replace with your JSON file path

async function connecToDb() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Database Connected");

    // Example: Check if data already exists based on a unique field like 'url'
    // for (const data of jsonData) {
    //     const existingData = await DataModel.findOne({ url: data.url });
    //     if (!existingData) {
    //         await DataModel.create(data);
    //     }
    // }


    // await DataModel.insertMany(jsonData);
    // mongoose.connection.close();
    // console.log("Data inserted successfully");


    // Delete all data from the collection
    // const deleteResult = await DataModel.deleteMany({});
    // console.log(`${deleteResult.deletedCount} documents deleted`)

    
  } catch (err) {
    console.log("Not Connected", err);
  }
}

module.exports = connecToDb;
