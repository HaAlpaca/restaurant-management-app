import { pool } from "../../../config/db.js";
import { StatusCodes } from "http-status-codes";

export const sumItem = async (req, res) => {
  try {
    const { date, filter } = req.query;
    let timeFilter = "";

    // Xác định điều kiện lọc theo tuần hoặc tháng dựa trên giá trị của filter
    if (filter === "week") {
      timeFilter = `date_trunc('week', b.created_at) = date_trunc('week', $1::date)`;
    } else if (filter === "month") {
      timeFilter = `date_trunc('month', b.created_at) = date_trunc('month', $1::date)`;
    } else if (filter === "year") {
      timeFilter = `date_trunc('year', b.created_at) = date_trunc('year', $1::date)`;
    } else {
      // Mặc định là lọc theo ngày
      timeFilter = `b.created_at::date = $1`;
    }

    // Truy vấn cơ sở dữ liệu để tính tổng số lượng món đã bán
    const query = {
      text: `
        SELECT i.items_id, i.name, i.category, SUM(oi.quantity) AS total_quantity_sold
        FROM items i
        JOIN orders_items oi ON i.items_id = oi.items_id
        JOIN bill b ON oi.orders_id = b.orders_id
        WHERE ${timeFilter}
        GROUP BY i.items_id, i.name, i.category;
      `,
      values: [date], // Truyền ngày hoặc ngày bắt đầu của tuần/tháng vào trong câu truy vấn
    };

    const result = await pool.query(query);
    res.status(StatusCodes.OK).json(result.rows);
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};
 