import { pool } from "../config/db.js";
import ApiError from "../utils/apiError.js";

const joinTableService = (
  joinTableName,
  firstTable,
  secondTable,
  firstColumn,
  secondColumn
) => ({
  addEntries: async (firstId, secondIds) => {
    try {
      const values = secondIds
        .map((_, index) => `($1, $${index + 2})`)
        .join(", ");

      const query = `
        INSERT INTO ${joinTableName} (${firstColumn}, ${secondColumn})
        VALUES ${values} RETURNING *;
      `;

      const params = [firstId, ...secondIds];
      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      throw new ApiError(500, `Error adding entries: ${error.message}`);
    }
  },

  getTablesByReservationId: async (reservationId) => {
    try {
      const query = `
        SELECT c2.*  -- Chọn tất cả các trường từ bảng tables
        FROM ${joinTableName} mid
        JOIN ${secondTable} c2 ON mid.${secondColumn} = c2.${secondColumn}
        JOIN ${firstTable} c1 ON mid.${firstColumn} = c1.${firstColumn}
        WHERE mid.${firstColumn} = $1;
      `;
      const result = await pool.query(query, [reservationId]);

      if (result.rowCount === 0) {
        throw new ApiError(
          404,
          `No tables found for reservation ID ${reservationId}`
        );
      }

      return result.rows; // Trả về tất cả thông tin của các bàn
    } catch (error) {
      throw new ApiError(
        500,
        `Error fetching tables by reservation ID: ${error.message}`
      );
    }
  },
});

export default joinTableService;
