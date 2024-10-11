import { pool } from "../../../config/db.js";
import { StatusCodes } from "http-status-codes";

export const sumItem = async (req, res) => {
  try {
    const { date, filter, sort = "DESC", limit } = req.query;
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

    // Đảm bảo sort chỉ nhận giá trị là ASC hoặc DESC
    const sortOrder = sort.toUpperCase() === "ASC" ? "ASC" : "DESC";

    // Kiểm tra nếu `limit` được truyền vào, nếu không thì không giới hạn kết quả
    const limitClause = limit ? `LIMIT $2` : "";

    // Truy vấn cơ sở dữ liệu để tính tổng số lượng món đã bán và sắp xếp kết quả
    const query = {
      text: `
        SELECT i.items_id, i.name, i.category, SUM(oi.quantity) AS total_quantity_sold
        FROM items i
        JOIN orders_items oi ON i.items_id = oi.items_id
        JOIN bill b ON oi.orders_id = b.orders_id
        WHERE ${timeFilter}
        GROUP BY i.items_id, i.name, i.category
        ORDER BY total_quantity_sold ${sortOrder}
        ${limitClause};  
      `,
      values: limit ? [date, limit] : [date], // Truyền ngày và limit (nếu có) vào trong câu truy vấn
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

export const sumBill = async (req, res) => {
  try {
    const { date, filter } = req.query;
    let timeFilter = "";

    // Xác định điều kiện lọc theo tuần, tháng hoặc năm dựa trên giá trị của filter
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

    // Truy vấn cơ sở dữ liệu để tính tổng tiền của các bill
    const query = {
      text: `
        SELECT SUM(b.total) AS total_revenue
        FROM bill b
        WHERE ${timeFilter};
      `,
      values: [date], // Truyền ngày hoặc ngày bắt đầu của tuần/tháng vào trong câu truy vấn
    };

    const result = await pool.query(query);
    res.status(StatusCodes.OK).json({
      date: date,
      ...result.rows[0],
    }); // Trả về tổng tiền thu được
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

export const sumBillForChart = async (req, res) => {
  try {
    const { date, filter } = req.query;
    let timeFilter = "";
    let groupByClause = "";

    // Xác định điều kiện lọc theo tuần, tháng hoặc năm dựa trên giá trị của filter
    if (filter === "week") {
      timeFilter = `date_trunc('week', b.created_at) = date_trunc('week', $1::date)`;
      groupByClause = `GROUP BY date_trunc('day', b.created_at)`; // Nhóm theo từng ngày
    } else if (filter === "month") {
      timeFilter = `date_trunc('month', b.created_at) = date_trunc('month', $1::date)`;
      groupByClause = `GROUP BY date_trunc('day', b.created_at)`; // Nhóm theo từng ngày
    } else if (filter === "year") {
      timeFilter = `date_trunc('year', b.created_at) = date_trunc('year', $1::date)`;
      groupByClause = `GROUP BY date_trunc('month', b.created_at)`; // Nhóm theo từng tháng
    } else {
      // Mặc định là lọc theo ngày
      timeFilter = `b.created_at::date = $1`;
      groupByClause = `GROUP BY b.created_at::date`; // Nhóm theo ngày
    }

    // Truy vấn cơ sở dữ liệu để tính tổng tiền của các bill theo từng ngày
    const query = {
      text: `
        SELECT date_trunc('day', b.created_at) AS day, SUM(b.total) AS total_revenue
        FROM bill b
        WHERE ${timeFilter}
        ${groupByClause}
        ORDER BY day ASC; -- Sắp xếp theo ngày
      `,
      values: [date], // Truyền ngày hoặc ngày bắt đầu của tuần/tháng vào trong câu truy vấn
    };

    const result = await pool.query(query);
    res.status(StatusCodes.OK).json(result.rows); // Trả về danh sách tổng tiền theo ngày
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

export const tableStatusOccupied = async (req, res) => {
  try {
    const query = `
        SELECT tables_id, name, quantity, location, status, created_at, updated_at
          FROM public.tables
        where status = 'occupied'
    `;

    const result = await pool.query(query);

    // Trả về kết quả
    res.status(StatusCodes.OK).json(result.rows);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};
export const sumProductfromProvider = async (req, res) => {
  try {
    const query = `
        SELECT 
          p.providers_id, 
          p.name, 
          p.description,
          SUM(t.quantity) AS total_products, 
          SUM(CASE WHEN t.status = 'pending' THEN t.quantity ELSE 0 END) AS total_pending_products, -- Tổng số sản phẩm đang ở trạng thái 'pending'
          SUM(CASE WHEN t.status = 'completed' THEN t.quantity ELSE 0 END) AS total_completed_products -- Tổng số sản phẩm đã 'completed'
        FROM providers p
        JOIN transactions t ON p.providers_id = t.providers_id
        GROUP BY p.providers_id, p.name, p.description
        ORDER BY total_products DESC;
    `;

    const result = await pool.query(query);

    // Trả về kết quả
    res.status(StatusCodes.OK).json(result.rows);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};
