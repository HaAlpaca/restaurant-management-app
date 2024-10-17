import { pool } from "../../../config/db.js";
import { faker } from "@faker-js/faker";
import { StatusCodes } from "http-status-codes";

export const SeedProviderData = async (req, res, next) => {
  try {
    const count = parseInt(req.params.id, 10); // Chuyển đổi count thành số nguyên
    for (let i = 0; i < count; i++) {
      const name = faker.company.name(); // Tên nhà cung cấp
      const image_url = faker.image.avatar(); // URL hình ảnh nhà cung cấp
      const address = faker.location.streetAddress(); // Địa chỉ
      const phone = faker.phone.number({ style: "international" }); // Số điện thoại
      const email = faker.internet.email(); // Email
      const description = faker.lorem.sentences(2); // Mô tả
      const is_actived = faker.datatype.boolean(); // Trạng thái kích hoạt

      const arr = [
        name,
        image_url,
        address,
        phone,
        email,
        description,
        is_actived,
      ];
      //   console.log(arr);
      //   Thực hiện chèn dữ liệu vào bảng Providers
      await pool.query(
        `
            INSERT INTO Providers (name, image_url, address, phone, email, description, is_actived)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
          `,
        arr
      );
    }

    res
      .status(StatusCodes.OK)
      .json({ message: "Seeded provider data successfully" });
  } catch (error) {
    next(error);
  }
};
