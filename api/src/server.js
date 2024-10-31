// ***************** import dependencies *******************************
import express from "express";

// import environment
import { env } from "./config/environment.js";
import { pool } from "./config/db.js";
// swagger

//import routes
import demoRoutes from "./routes/demoRoutes/demoRoutes.js";
//import main table
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware.js";
// import demo table

import { APIs_v1 } from "./routes/v1/_index.js";
import { checkCloudinary } from "./config/cloudinary.js";
import cors from "cors";
import { jwtCheck } from "./middlewares/jwt.js";

//dotenv
const START_SERVER = () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false })); // parse form data in the req.body
  app.use(
    cors({
      origin: "*",
    })
  );
  app.use(jwtCheck);
  // demo table
  // routes
  app.use("/api", APIs_v1);

  // app.use("/api/demo", demoRoutes);

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
    // await pool.connect();
    console.log("Connect to Database!");
    console.log("Environement build mode:", env.BUILD_MODE);

    START_SERVER(); // Khởi động server sau khi kết nối thành công
    await checkCloudinary();
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // Thoát ứng dụng nếu không kết nối được với cơ sở dữ liệu
  }
};

// Gọi hàm khởi động
startApp();
