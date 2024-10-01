import { pool } from "../config/db.js";
import ApiError from "../utils/apiError.js";
import { StatusCodes } from "http-status-codes"; // Import HTTP status codes

const joinTable2Service = (
  joinTableName,
  firstTable,
  secondTable,
  firstColumn,
  secondColumn
) => ({
  addEntries: async (firstId, data) => {
    try {
      // Kiểm tra xem tất cả các mục đều có `quantity` và `description`
      data.forEach((entry) => {
        if (entry.quantity === undefined || entry.description === undefined) {
          throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Each entry must have both quantity and description"
          );
        }
      });

      let values = []; // Danh sách các giá trị cho các bản ghi
      let params = [firstId]; // Tham số đầu tiên là `firstId`
      let paramIndex = 2; // Bắt đầu từ $2 vì $1 là firstId

      // Duyệt qua từng mục trong `data`
      data.forEach((entry) => {
        values.push(
          `($1, $${paramIndex++}, $${paramIndex++}, $${paramIndex++})`
        );
        params.push(entry.itemId, entry.quantity, entry.description); // Thêm itemId, quantity và description vào params
      });

      // Xây dựng câu truy vấn
      const query = `
        INSERT INTO ${joinTableName} 
        (${firstColumn}, ${secondColumn}, quantity, description) 
        VALUES ${values.join(", ")} 
        RETURNING *;
      `;

      // Thực hiện truy vấn
      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Error adding entries: ${error.message}`
      );
    }
  },

  getEntries: async (firstTableId) => {
    try {
      const query = `
        SELECT c2.name,c2.image_url,c2.unit, mid.quantity ,c2.price, mid.description
        FROM ${joinTableName} mid
        JOIN ${secondTable} c2 ON mid.${secondColumn} = c2.${secondColumn}
        JOIN ${firstTable} c1 ON mid.${firstColumn} = c1.${firstColumn}
        WHERE mid.${firstColumn} = $1;
      `;
      const result = await pool.query(query, [firstTableId]);

      if (result.rowCount === 0) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          `No tables found for ${firstTableId} ID`
        );
      }

      return result.rows;
    } catch (error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Error fetching tables by reservation ID: ${error.message}`
      );
    }
  },

  updateEntries: async (firstId, data) => {
    try {
      // Xóa các bản ghi cũ dựa trên firstId
      const deleteQuery = `
        DELETE FROM ${joinTableName} 
        WHERE ${firstColumn} = $1;
      `;
      await pool.query(deleteQuery, [firstId]);

      // Kiểm tra xem tất cả các mục đều có `quantity` và `description`
      data.forEach((entry) => {
        if (entry.quantity === undefined || entry.description === undefined) {
          throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Each entry must have both quantity and description"
          );
        }
      });

      let values = []; // Danh sách các giá trị cho các bản ghi
      let params = [firstId]; // Tham số đầu tiên là `firstId`
      let paramIndex = 2; // Bắt đầu từ $2 vì $1 là firstId

      // Duyệt qua từng mục trong `data`
      data.forEach((entry) => {
        values.push(
          `($1, $${paramIndex++}, $${paramIndex++}, $${paramIndex++})`
        );
        params.push(entry.itemId, entry.quantity, entry.description); // Thêm itemId, quantity và description vào params
      });

      // Xây dựng câu truy vấn
      const query = `
        INSERT INTO ${joinTableName} 
        (${firstColumn}, ${secondColumn}, quantity, description) 
        VALUES ${values.join(", ")} 
        RETURNING *;
      `;

      // Thực hiện truy vấn
      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Error updating entries: ${error.message}`
      );
    }
  },

  deleteEntries: async (firstId) => {
    try {
      const query = `
        DELETE FROM ${joinTableName} 
        WHERE ${firstColumn} = $1
        RETURNING *;
      `;
      const params = [firstId];

      const result = await pool.query(query, params);

      if (result.rowCount === 0) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          `No entries found to delete for ${firstColumn} ID ${firstId}`
        );
      }

      return {
        message: `Successfully deleted ${result.rowCount} entries for ${firstColumn} ID ${firstId}.`,
      };
    } catch (error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Error deleting entries: ${error.message}`
      );
    }
  },
});

export default joinTable2Service;
