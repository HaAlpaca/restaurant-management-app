import { pool } from "../../../config/db.js";
import { faker } from "@faker-js/faker";
import { StatusCodes } from "http-status-codes";

export const SeedStaffData = async (req, res, next) => {
  try {
    const count = parseInt(req.params.id, 10); // Chuyển đổi count thành số nguyên
    for (let i = 0; i < count; i++) {
      const name = faker.person.fullName();
      const gender = faker.helpers.arrayElement(["male", "female"]);
      const birthday = faker.date.birthdate({ min: 18, max: 60, mode: "age" });
      const image_url = faker.image.avatar();
      const phone = faker.phone.number({ style: "international" });
      const citizen_id = faker.string.numeric(12);
      const role = faker.helpers.arrayElement([
        "Manager",
        "Waiter",
        "Chef",
        "Inventory Management",
        "Receptionist",
      ]);

      // Điều chỉnh lương theo USD
      const salary = faker.finance.amount(2000, 7000, 2);
      const wage = faker.finance.amount(15, 50, 2);

      const username = faker.internet.userName();
      const password_hash = faker.internet.password();
      const email = faker.internet.email();
      const arr = [
        name,
        gender,
        birthday,
        image_url,
        phone,
        citizen_id,
        role,
        salary,
        wage,
        username,
        password_hash,
        email,
      ];
      //   console.log(arr);
      // Thực hiện chèn dữ liệu vào bảng Staff
      await pool.query(
        `
            INSERT INTO Staff (name, gender, birthday, image_url, phone, citizen_id, role, salary, wage, username, password_hash, email)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          `,
        arr
      );
    }

    res.status(StatusCodes.OK).json({ message: "Seeded staff data successfully" });
  } catch (error) {
    next(error);
  }
};
