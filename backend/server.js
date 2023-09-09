if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const DataModel = require('./dataModel');
const connecToDb = require('./config/connecToDb');
const express = require("express");
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
connecToDb();


app.get('/api/data', async (req, res) => {
    try {
      const data = await DataModel.find();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching data' });
    }
  });
  
app.get('/', (req, res)=>{
  res.send('<h2>Server Running</h2>')
})
app.listen(process.env.PORT);
