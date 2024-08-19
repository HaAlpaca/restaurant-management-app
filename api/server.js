import express from "express";
import dotenv from "dotenv";

import connectDB from "./db/ConnectDb.js";

//import routes
import userRoutes from './routes/userRoutes.js'

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(express.urlencoded({ extended: false })); // parse form data in the req.body

// routes
app.get('/', (req, res) => {
    res.send('Welcome restaurant management system api')
  })
app.use("/api/users",userRoutes);
app.listen(PORT,console.log(`Server start at http://localhost:${PORT}`))