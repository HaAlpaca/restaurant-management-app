// ***************** import dependencies *******************************
import express from "express";
import dotenv from "dotenv";

// swagger
import swaggerUi from 'swagger-ui-express';


//import routes
import userRoutes from './routes/userRoutes.js'
import reservationRoutes from './routes/reservationRoutes.js'
import tableRoutes from './routes/tableRoutes.js'


//dotenv
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(express.urlencoded({ extended: false })); // parse form data in the req.body

// routes


// get docs
// app.get('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use("/api/users",userRoutes);
app.use("/api/reservation",reservationRoutes);
app.use("/api/table",tableRoutes);


app.listen(PORT,console.log(`Server start at http://localhost:${PORT}`))