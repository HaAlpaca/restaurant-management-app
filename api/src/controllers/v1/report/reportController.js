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
        where status = 'Đang sử dụng'
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

export const getAllBillWithFilter = async (req, res, next) => {
  try {
    const { date, filter, sort = "DESC", limit } = req.query;
    let timeFilter = "";

    // Xác định điều kiện lọc theo tuần, tháng, năm, hoặc ngày
    if (filter === "week") {
      timeFilter = `date_trunc('week', b.created_at) = date_trunc('week', $1::date)`;
    } else if (filter === "month") {
      timeFilter = `date_trunc('month', b.created_at) = date_trunc('month', $1::date)`;
    } else if (filter === "year") {
      timeFilter = `date_trunc('year', b.created_at) = date_trunc('year', $1::date)`;
    } else {
      // Mặc định lọc theo ngày
      timeFilter = `b.created_at::date = $1`;
    }

    // Đảm bảo sort chỉ nhận giá trị ASC hoặc DESC
    const sortOrder = sort.toUpperCase() === "ASC" ? "ASC" : "DESC";

    // Tạo mệnh đề LIMIT nếu có
    const limitClause = limit ? `LIMIT $2` : "";

    // Truy vấn để lấy tất cả hóa đơn kèm điều kiện lọc, sắp xếp, và giới hạn
    const billsQuery = {
      text: `
        SELECT * 
        FROM Bill b
        WHERE ${timeFilter}
        ORDER BY b.created_at ${sortOrder}
        ${limitClause}
      `,
      values: limit ? [date, limit] : [date], // Thêm giá trị limit nếu có
    };

    const billsResult = await pool.query(billsQuery);

    // Nếu không có hóa đơn nào
    if (billsResult.rowCount === 0) {
      return res.status(StatusCodes.OK).json({ message: "No bills found" });
    }

    // Mảng để lưu thông tin hóa đơn
    const billsData = [];
    let totalSum = 0; // Biến để tính tổng giá trị của tất cả hóa đơn

    // Lặp qua từng hóa đơn để lấy thông tin chi tiết
    for (const bill of billsResult.rows) {
      // Lấy thông tin nhân viên liên quan đến hóa đơn
      const staffQuery = {
        text: "SELECT * FROM Staff WHERE staff_id = $1",
        values: [bill.staff_id],
      };
      const staffResult = await pool.query(staffQuery);

      // Lấy thông tin items trong đơn hàng liên quan đến hóa đơn
      const itemQuery = {
        text: `
          SELECT i.items_id, i.name, oi.quantity, i.price
          FROM Orders_Items oi
          JOIN Items i ON oi.items_id = i.items_id
          JOIN Orders o ON oi.orders_id = o.orders_id
          WHERE o.orders_id = $1
        `,
        values: [bill.orders_id],
      };
      const itemResult = await pool.query(itemQuery);

      // Tính tổng số lượng cho các items có cùng items_id
      const aggregatedItems = {};
      itemResult.rows.forEach((item) => {
        if (!aggregatedItems[item.items_id]) {
          aggregatedItems[item.items_id] = { ...item, quantity: 0 };
        }
        aggregatedItems[item.items_id].quantity += item.quantity;
      });

      // Chuyển đổi đối tượng thành mảng
      const uniqueItems = Object.values(aggregatedItems);

      // Chuyển đổi total từ chuỗi sang số và tính tổng
      totalSum += parseFloat(bill.total) || 0;

      // Đẩy thông tin hóa đơn vào mảng
      billsData.push({
        bill_id: bill.bill_id,
        staff: staffResult.rows[0]?.name || "N/A", // Nếu không tìm thấy nhân viên, trả về "N/A"
        items: uniqueItems,
        total: bill.total,
        created_at: bill.created_at,
      });
    }

    // Trả về danh sách hóa đơn và tổng giá trị
    res.status(StatusCodes.OK).json({
      bills: billsData,
      totalSum,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBillWith2Filter = async (req, res, next) => {
  try {
    const { start_date, end_date, sort = "DESC", limit } = req.query;

    // Xác định điều kiện lọc theo khoảng thời gian start_date và end_date
    const timeFilter = `b.created_at BETWEEN $1 AND $2`;

    // Đảm bảo `sort` chỉ nhận giá trị ASC hoặc DESC
    const sortOrder = sort.toUpperCase() === "ASC" ? "ASC" : "DESC";

    // Tạo mệnh đề LIMIT nếu có
    const limitClause = limit ? `LIMIT $3` : "";

    // Truy vấn để lấy tất cả hóa đơn kèm điều kiện lọc, sắp xếp, và giới hạn
    const billsQuery = {
      text: `
        SELECT * 
        FROM Bill b
        WHERE ${timeFilter}
        ORDER BY b.created_at ${sortOrder}
        ${limitClause}
      `,
      values: limit ? [start_date, end_date, limit] : [start_date, end_date],
    };

    const billsResult = await pool.query(billsQuery);

    // Nếu không có hóa đơn nào
    if (billsResult.rowCount === 0) {
      return res.status(StatusCodes.OK).json({ message: "No bills found" });
    }

    // Mảng để lưu thông tin hóa đơn
    const billsData = [];
    let totalSum = 0; // Biến để tính tổng giá trị của tất cả hóa đơn

    // Lặp qua từng hóa đơn để lấy thông tin chi tiết
    for (const bill of billsResult.rows) {
      // Lấy thông tin nhân viên liên quan đến hóa đơn
      const staffQuery = {
        text: "SELECT * FROM Staff WHERE staff_id = $1",
        values: [bill.staff_id],
      };
      const staffResult = await pool.query(staffQuery);

      // Lấy thông tin items trong đơn hàng liên quan đến hóa đơn
      const itemQuery = {
        text: `
          SELECT i.items_id, i.name, oi.quantity, i.price
          FROM Orders_Items oi
          JOIN Items i ON oi.items_id = i.items_id
          JOIN Orders o ON oi.orders_id = o.orders_id
          WHERE o.orders_id = $1
        `,
        values: [bill.orders_id],
      };
      const itemResult = await pool.query(itemQuery);

      // Tạo một đối tượng để lưu trữ tổng số lượng của mỗi item dựa trên items_id
      const aggregatedItems = {};
      itemResult.rows.forEach((item) => {
        if (!aggregatedItems[item.items_id]) {
          aggregatedItems[item.items_id] = { ...item, quantity: 0 };
        }
        aggregatedItems[item.items_id].quantity += item.quantity;
      });

      // Chuyển đổi đối tượng thành mảng
      const uniqueItems = Object.values(aggregatedItems);

      // Chuyển đổi total từ chuỗi sang số và tính tổng
      totalSum += parseFloat(bill.total) || 0;

      // Đẩy thông tin hóa đơn vào mảng
      billsData.push({
        bill_id: bill.bill_id,
        staff: staffResult.rows[0]?.name || "N/A", // Nếu không tìm thấy nhân viên, trả về "N/A"
        items: uniqueItems,
        total: bill.total,
        created_at: bill.created_at,
      });
    }

    // Trả về danh sách hóa đơn và tổng giá trị
    res.status(StatusCodes.OK).json({
      bills: billsData,
      totalSum,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTransactionsWithFilter = async (req, res, next) => {
  try {
    const { date, filter, sort = "DESC", limit } = req.query;
    let timeFilter = "";

    // Xác định điều kiện lọc theo tuần, tháng, năm, hoặc ngày
    if (filter === "week") {
      timeFilter = `date_trunc('week', t.created_at) = date_trunc('week', $1::date)`;
    } else if (filter === "month") {
      timeFilter = `date_trunc('month', t.created_at) = date_trunc('month', $1::date)`;
    } else if (filter === "year") {
      timeFilter = `date_trunc('year', t.created_at) = date_trunc('year', $1::date)`;
    } else {
      // Mặc định lọc theo ngày
      timeFilter = `t.created_at::date = $1`;
    }

    // Đảm bảo sort chỉ nhận giá trị ASC hoặc DESC
    const sortOrder = sort.toUpperCase() === "ASC" ? "ASC" : "DESC";

    // Tạo mệnh đề LIMIT nếu có
    const limitClause = limit ? `LIMIT $2` : "";

    // Truy vấn để lấy tất cả các giao dịch kèm điều kiện lọc, sắp xếp, và giới hạn
    const transactionsQuery = {
      text: `
        SELECT t.*, p.name as product_name
        FROM Transactions t
        JOIN Products p on p.products_id = t.products_id
        WHERE ${timeFilter}
        ORDER BY t.created_at ${sortOrder}
        ${limitClause}
      `,
      values: limit ? [date, limit] : [date], // Thêm giá trị limit nếu có
    };

    const transactionsResult = await pool.query(transactionsQuery);

    // Nếu không có giao dịch nào
    if (transactionsResult.rows.length === 0) {
      return res
        .status(StatusCodes.OK)
        .json({ message: "No transactions found" });
    }

    // Biến để lưu tổng tiền theo các trạng thái
    let total_pending = 0;
    let total_complete = 0;
    let total = 0;

    // Tính tổng dựa vào từng transaction
    transactionsResult.rows.forEach((transaction) => {
      total += parseFloat(transaction.price);
      if (transaction.status === "Đang chờ") {
        total_pending += parseFloat(transaction.price);
      } else if (transaction.status === "Hoàn thành") {
        total_complete += parseFloat(transaction.price);
      }
    });

    // Trả về danh sách giao dịch cùng với các tổng đã tính toán
    res.status(StatusCodes.OK).json({
      transactions: transactionsResult.rows,
      total_pending,
      total_complete,
      total,
    });
  } catch (error) {
    next(error);
  }
};

export const getStaffSalaryWithFilter = async (req, res, next) => {
  try {
    const { date, filter } = req.query;
    let timeFilter = "";

    // Xác định điều kiện lọc theo tuần, tháng, năm hoặc ngày
    if (filter === "week") {
      timeFilter = `date_trunc('week', ss.date) = date_trunc('week', $1::date)`;
    } else if (filter === "month") {
      timeFilter = `date_trunc('month', ss.date) = date_trunc('month', $1::date)`;
    } else if (filter === "year") {
      timeFilter = `date_trunc('year', ss.date) = date_trunc('year', $1::date)`;
    } else {
      // Mặc định lọc theo ngày
      timeFilter = `ss.date::date = $1`;
    }

    // Truy vấn tính tổng tiền lương cho mỗi nhân viên
    const salaryQuery = {
      text: `
        SELECT 
          s.*,
          (s.wage * COALESCE(SUM(EXTRACT(EPOCH FROM (sh.end_time - sh.start_time)) / 3600), 0)) AS salary
        FROM 
          Staff s
        LEFT JOIN 
          Staff_Shift ss ON s.staff_id = ss.staff_id
        LEFT JOIN 
          Shift sh ON ss.shift_id = sh.shift_id
        WHERE 
          ${timeFilter}
          AND ss.is_attendance = TRUE
        GROUP BY 
          s.staff_id
      `,
      values: [date], // Giá trị cho tham số $1
    };

    // Thực hiện truy vấn
    const salaryResult = await pool.query(salaryQuery);

    // Kiểm tra kết quả
    if (salaryResult.rows.length === 0) {
      return res.status(StatusCodes.OK).json({ message: "No salaries found" });
    }

    // Trả về danh sách lương
    res.status(StatusCodes.OK).json(salaryResult.rows);
  } catch (error) {
    next(error);
  }
};
