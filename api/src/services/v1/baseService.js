import { pool } from "../../config/db.js";
import cloudinary from "../../config/cloudinary.js";

const baseService = (tableName, idColumn, fields, imageField = null) => ({
  // Kiểm tra sự tồn tại của ID trong bảng
  checkExistenceById: async (id) => {
    const query = {
      text: `SELECT 1 FROM ${tableName} WHERE ${idColumn} = $1 LIMIT 1`,
      values: [id],
    };
    const result = await pool.query(query);
    return result.rowCount > 0;
  },

  create: async (data = {}, imagePath = null) => {
    if (Object.keys(data).length === 0) {
      // Nếu data không có gì, chèn một bản ghi mới với DEFAULT VALUES
      const query = {
        text: `INSERT INTO ${tableName} DEFAULT VALUES RETURNING *`,
      };
      console.log(query);
      const result = await pool.query(query);
      return result.rows[0];
    }

    let imageUrl = null;

    // Nếu có hình ảnh, tiến hành upload lên Cloudinary
    if (imageField && imagePath) {
      const uploadResponse = await cloudinary.uploader.upload(imagePath, {
        folder: `RestaurantManagementSystemApp/images/${tableName}`,
      });
      imageUrl = uploadResponse.secure_url;
    }

    // Tạo mảng giá trị từ dữ liệu dựa trên các field
    const values = fields.map((field) => data[field]);
    // Nếu có trường hình ảnh, chèn imageUrl vào đúng vị trí
    if (imageField && imageUrl) {
      values[fields.indexOf(imageField)] = imageUrl;
    }

    const query = {
      text: `INSERT INTO ${tableName}(${fields.join(", ")}) VALUES(${values
        .map((_, i) => `$${i + 1}`)
        .join(", ")}) RETURNING *`,
      values,
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  getById: async (id) => {
    const query = {
      text: `SELECT * FROM ${tableName} WHERE ${idColumn} = $1`,
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows[0];
  },

  getAll: async (filters = {}, sort = null) => {
    const filterConditions = [];
    const values = [];
    let index = 1;

    // Xử lý filter: Tạo điều kiện WHERE từ filters
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && key !== "sort") {
        // Loại bỏ 'sort' khỏi filter
        filterConditions.push(`${key} ILIKE '%' || $${index} || '%'`);
        values.push(value);
        index++;
      }
    }

    // Xử lý sort: Tạo câu lệnh ORDER BY từ sort
    let sortClause = "";
    if (sort) {
      sortClause = `ORDER BY ${sort}`;
    }

    // Kết hợp filterConditions và sortClause vào query
    const query = {
      text: `SELECT * FROM ${tableName} ${
        filterConditions.length > 0
          ? `WHERE ${filterConditions.join(" AND ")}`
          : ""
      } ${sortClause}`,
      values,
    };

    const result = await pool.query(query);
    return result.rows;
  },

  updateById: async (id, data, imagePath = null) => {
    let imageUrl = null;
    const updatedValues = [];
    const setClause = [];

    // Nếu có hình ảnh mới, upload lên Cloudinary
    if (imageField && imagePath) {
      const uploadResponse = await cloudinary.uploader.upload(imagePath, {
        folder: `RestaurantManagementSystemApp/images/${tableName}`,
      });
      imageUrl = uploadResponse.secure_url;
    }

    // Lấy các giá trị từ data để tạo câu truy vấn động
    let index = 1;
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        setClause.push(`${key} = $${index}`);
        updatedValues.push(value);
        index++;
      }
    }

    // Nếu có imageUrl, thêm vào truy vấn
    if (imageField && imageUrl) {
      setClause.push(`${imageField} = $${index}`);
      updatedValues.push(imageUrl);
    }

    // Nếu không có gì để cập nhật, báo lỗi
    if (setClause.length === 0) {
      throw new ApiError(400, "No valid fields to update.");
    }

    // Thêm id vào cuối updatedValues để sử dụng trong WHERE clause
    updatedValues.push(id);

    const query = {
      text: `UPDATE ${tableName} SET ${setClause.join(
        ", "
      )} WHERE ${idColumn} = $${updatedValues.length} RETURNING *`,
      values: updatedValues,
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  deleteById: async (id) => {
    const query = {
      text: `DELETE FROM ${tableName} WHERE ${idColumn} = $1 RETURNING *`,
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows[0];
  },
});

export default baseService;
