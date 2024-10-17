import { pool } from "../../../config/db.js";
import { faker } from "@faker-js/faker";
import { StatusCodes } from "http-status-codes";

export const SeedItemData = async (req, res, next) => {
  try {
    const count = parseInt(req.params.id, 10); // Chuyển đổi count thành số nguyên
    for (let i = 0; i < count; i++) {
      const name = faker.food.dish(); // Tên sản phẩm
      const image_url = faker.image.avatar();
      const unit = faker.helpers.arrayElement(["kg", "g", "l", "pcs"]); // Đơn vị
      const category = faker.helpers.arrayElement(["Main Course", "Fast Food"]); // Đơn vị
      const price = parseFloat(faker.commerce.price(100, 200, 2)); // Giá sản phẩm

      const arr = [name, image_url, unit, category, price];
    //   console.log(arr);
      //   Thực hiện chèn dữ liệu vào bảng Items
      await pool.query(
        `
            INSERT INTO Items (name, image_url, unit, category, price)
            VALUES ($1, $2, $3, $4, $5)
          `,
        arr
      );
    }

    res
      .status(StatusCodes.OK)
      .json({ message: "Seeded item data successfully" });
  } catch (error) {
    next(error);
  }
};
