import { pool } from "../../../config/db.js";
import { faker } from "@faker-js/faker";
import { StatusCodes } from "http-status-codes";

export const SeedReservationData = async (req, res, next) => {
  try {
    const count = parseInt(req.params.id, 10); // Chuyển đổi count thành số nguyên
    for (let i = 0; i < count; i++) {
      const quantity = faker.number.int({ min: 1, max: 20 });
      const name = faker.person.fullName();
      const phone = faker.phone.number({ style: "international" });
      const email = faker.internet.email();
      const status = faker.helpers.arrayElement([
        "Pending",
        "Confirmed",
        "Cancelled",
      ]);
      const time = faker.date.future();

      const arr = [quantity, name, phone, email, status, time];

      // Thực hiện chèn dữ liệu vào bảng Reservations
      await pool.query(
        `
          INSERT INTO Reservations (quantity, name, phone, email, status, time)
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
        arr
      );
    }

    res.status(StatusCodes.OK).json({ message: "Seeded reservation data successfully" });
  } catch (error) {
    next(error);
  }
};
