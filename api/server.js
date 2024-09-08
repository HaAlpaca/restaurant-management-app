// ***************** import dependencies *******************************
import express from "express";
import dotenv from "dotenv";

// swagger
import swaggerUi from "swagger-ui-express";

//import routes
import demoRoutes from "./routes/demoRoutes.js";
import providerRoutes from "./routes/providerRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import tableRoutes from "./routes/tableRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
//dotenv
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false })); // parse form data in the req.body

// routes

// get docs
// app.get('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use("/api/demo", demoRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/item", itemRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/table", tableRoutes);
app.use("/api/reservation", reservationRoutes);

app.listen(PORT, console.log(`Server start at http://localhost:${PORT}`));
