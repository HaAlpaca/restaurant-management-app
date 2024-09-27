// ***************** import dependencies *******************************
import express from "express";

// import environment
import { env } from "./config/environment.js";
import { pool } from "./config/db.js";
// swagger
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

//import routes
import demoRoutes from "./routes/demoRoutes/demoRoutes.js";
//import main table
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware.js";
// import demo table

import { APIs_v1 } from "./routes/v1/_index.js";
import { checkCloudinary } from "./config/cloudinary.js";

//dotenv
const START_SERVER = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false })); // parse form data in the req.body

  const swaggerOptions = {
    swaggerDefinition: {
      info: {
        version: "1.0.0",
        title: "Customer API",
        description: "Customer API Information",
        contact: {
          name: "Developer",
        },
        servers: [`http://localhost:${env.PORT || 5000}`],
      },
    },
    // ['.routes/*.js']
    apis: ["server.js"],
  };

  const swaggerDocs = swaggerJSDoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  // demo table
  // routes
  app.use("/api", APIs_v1);

  app.use("/api/demo", demoRoutes);

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
