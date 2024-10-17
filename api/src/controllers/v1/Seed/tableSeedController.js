import { pool } from "../../../config/db.js";
import { faker } from "@faker-js/faker";
import { StatusCodes } from "http-status-codes";

export const SeedTableData = async (req, res, next) => {
  try {
    const count = parseInt(req.params.id, 10); // Chuyển đổi count thành số nguyên
    for (let i = 0; i < count; i++) {
      const name = `Table Fake ${i + 100}`; // Tạo tên bàn
      const quantity = faker.number.int({ min: 2, max: 12 }); // Số ghế ngẫu nhiên từ 2 đến 12
      const location = faker.location.direction(); // Vị trí bàn là địa chỉ ngẫu nhiên
      const status = faker.helpers.arrayElement(["Available", "Occupied"]); // Trạng thái bàn

      const arr = [name, quantity, location, status];

      // Thực hiện chèn dữ liệu vào bảng Tables
      await pool.query(
        `
          INSERT INTO Tables (name, quantity, location, status)
          VALUES ($1, $2, $3, $4)
        `,
        arr
      );
    }

    res.status(StatusCodes.OK).json({ message: "Seeded table data successfully" });
  } catch (error) {
    next(error);
  }
};
