import { pool } from "../../../config/db.js";
import { faker } from "@faker-js/faker";
import { StatusCodes } from "http-status-codes";

export const SeedOrderData = async (req, res, next) => {
  try {
    const count = parseInt(req.params.id, 10); // Chuyển đổi count thành số nguyên
    for (let i = 0; i < count; i++) {
      const status = faker.helpers.arrayElement(["Pending", "Completed"]); // Tình trạng đơn hàng
      const description = faker.lorem.sentence(); // Mô tả đơn hàng

      const arr = [status, description];

      // Thực hiện chèn dữ liệu vào bảng Orders
      await pool.query(
        `
          INSERT INTO Orders (status, description)
          VALUES ($1, $2)
        `,
        arr
      );
    }

    res
      .status(StatusCodes.OK)
      .json({ message: "Seeded order data successfully" });
  } catch (error) {
    next(error);
  }
};
