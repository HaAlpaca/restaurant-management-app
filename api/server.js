// ***************** import dependencies *******************************
import express from "express";

// import environment
import { env } from "./config/environment.js";
import { pool } from "./config/db.js";
// swagger
import swaggerUi from "swagger-ui-express";

//import routes
import demoRoutes from "./routes/demoRoutes/demoRoutes.js";
//import main table
import providerRoutes from "./routes/providerRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import tableRoutes from "./routes/tableRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import shiftRoutes from "./routes/shiftRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware.js";
// import demo table

import { APIs_v1 } from "./routes/v1/_index.js";

//dotenv
const START_SERVER = () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false })); // parse form data in the req.body

  // routes

  // get docs
  // app.get('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerDocument))

  // demo table
  app.use("/v1", APIs_v1);

  app.use("/api/demo", demoRoutes);

  // main table
  app.use("/api/provider", providerRoutes);
  app.use("/api/item", itemRoutes);
  app.use("/api/product", productRoutes);
  app.use("/api/order", orderRoutes);
  app.use("/api/table", tableRoutes);
  app.use("/api/reservation", reservationRoutes);
  app.use("/api/bill", billRoutes);
  app.use("/api/staff", staffRoutes);
  app.use("/api/shift", shiftRoutes);

  // join table

  // errror handling
  app.use(errorHandlingMiddleware);

  app.listen(
    env.PORT,
    console.log(`Server start at http://localhost:${env.PORT || 5000}`)
  );
};

// Hàm khởi động server và kết nối với cơ sở dữ liệu
const startApp = async () => {
  try {
    await pool.connect();
    console.log("Connect to Database!");
    START_SERVER(); // Khởi động server sau khi kết nối thành công
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // Thoát ứng dụng nếu không kết nối được với cơ sở dữ liệu
  }
};

// Gọi hàm khởi động
startApp();
