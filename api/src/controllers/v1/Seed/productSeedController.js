import { pool } from "../../../config/db.js";
import { faker } from "@faker-js/faker";
import { StatusCodes } from "http-status-codes";

export const SeedProductData = async (req, res, next) => {
  try {
    const count = parseInt(req.params.id, 10); // Chuyển đổi count thành số nguyên
    for (let i = 0; i < count; i++) {
      const name = faker.food.ingredient(); // Tên sản phẩm
      const image_url = faker.image.avatar(); // URL hình ảnh sản phẩm
      const color = faker.color.human(); // Màu sắc sản phẩm
      const quantity = faker.number.int({ min: 1, max: 100 }); // Số lượng sản phẩm
      const category = faker.helpers.arrayElement(["ingredient"]); // Danh mục sản phẩm
      const unit = faker.helpers.arrayElement(["kg", "g", "l", "pcs"]); // Đơn vị
      const total_price = parseFloat(faker.commerce.price(1, 100, 2)); // Giá tổng
      const customer_price = total_price + total_price * 0.2; // Giá khách hàng (giả định lãi 20%)
      const description = "";

      const arr = [
        name,
        image_url,
        color,
        quantity,
        category,
        unit,
        total_price,
        customer_price,
        description,
      ];
      //   console.log(arr);
      //   // Thực hiện chèn dữ liệu vào bảng Products
      await pool.query(
        `
            INSERT INTO Products (name, image_url, color, quantity, category, unit, total_price, customer_price, description)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          `,
        arr
      );
    }

    res
      .status(StatusCodes.OK)
      .json({ message: "Seeded product data successfully" });
  } catch (error) {
    next(error);
  }
};
