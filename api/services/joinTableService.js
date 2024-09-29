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

  getEntries: async (firstTableId) => {
    try {
      const query = `
        SELECT c2.*  
        FROM ${joinTableName} mid
        JOIN ${secondTable} c2 ON mid.${secondColumn} = c2.${secondColumn}
        JOIN ${firstTable} c1 ON mid.${firstColumn} = c1.${firstColumn}
        WHERE mid.${firstColumn} = $1;
      `;
      const result = await pool.query(query, [firstTableId]);

      if (result.rowCount === 0) {
        throw new ApiError(404, `No tables found for ${firstTableId} ID`);
      }

      return result.rows;
    } catch (error) {
      throw new ApiError(
        500,
        `Error fetching tables by reservation ID: ${error.message}`
      );
    }
  },

  updateEntries: async (firstId, secondIds) => {
    try {
      const deleteQuery = `
        DELETE FROM ${joinTableName} 
        WHERE ${firstColumn} = $1;
      `;
      await pool.query(deleteQuery, [firstId]);

      const values = secondIds
        .map((_, index) => `($1, $${index + 2})`)
        .join(", ");

      const insertQuery = `
        INSERT INTO ${joinTableName} (${firstColumn}, ${secondColumn})
        VALUES ${values} RETURNING *;
      `;
      const params = [firstId, ...secondIds];
      const result = await pool.query(insertQuery, params);

      return result.rows;
    } catch (error) {
      throw new ApiError(500, `Error updating entries: ${error.message}`);
    }
  },

  // Phương thức xóa các bản ghi trong bảng trung gian
  deleteEntries: async (firstId, secondIds = null) => {
    try {
      let query;
      const params = [firstId];

      // Xoá nhiều hàng dựa trên danh sách secondIds nếu có
      if (secondIds && secondIds.length > 0) {
        const placeholders = secondIds
          .map((_, index) => `$${index + 2}`)
          .join(", ");
        query = `
          DELETE FROM ${joinTableName} 
          WHERE ${firstColumn} = $1 AND ${secondColumn} IN (${placeholders})
          RETURNING *;
        `;
        params.push(...secondIds);
      } else {
        // Xoá tất cả bản ghi dựa trên firstId nếu không truyền secondIds
        query = `
          DELETE FROM ${joinTableName} 
          WHERE ${firstColumn} = $1
          RETURNING *;
        `;
      }

      const result = await pool.query(query, params);

      if (result.rowCount === 0) {
        throw new ApiError(404, `No entries found to delete for ${firstId}`);
      }

      // Trả về thông báo thành công
      return {
        message: `Successfully deleted ${
          result.rowCount
        } entries for ${firstColumn} ID ${firstId}${
          secondIds ? ` and ${secondColumn} IDs ${secondIds.join(", ")}` : ""
        }.`,
      };
    } catch (error) {
      throw new ApiError(500, `Error deleting entries: ${error.message}`);
    }
  },
});

export default joinTableService;
