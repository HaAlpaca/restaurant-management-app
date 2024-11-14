import { pool } from "../../../config/db.js";
import { StatusCodes } from "http-status-codes";

export const createBill = async (req, res, next) => {
  try {
    const { orders_id, staff_id } = req.body;

    // Kiểm tra thông tin đơn hàng
    const orderQuery = {
      text: "SELECT * FROM Orders WHERE orders_id = $1",
      values: [orders_id],
    };
    const orderResult = await pool.query(orderQuery);
    if (orderResult.rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Order not found" });
    }

    // Kiểm tra thông tin nhân viên
    const staffQuery = {
      text: "SELECT * FROM Staff WHERE staff_id = $1",
      values: [staff_id],
    };
    const staffResult = await pool.query(staffQuery);
    if (staffResult.rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Staff not found" });
    }

    // Lấy thông tin items trong đơn hàng
    const itemQuery = {
      text: `
        SELECT i.name, oi.quantity, i.price
        FROM Orders_Items oi
        JOIN Items i ON oi.items_id = i.items_id
        WHERE oi.orders_id = $1
      `,
      values: [orders_id],
    };
    const itemResult = await pool.query(itemQuery);

    // Tính tổng tiền cho đơn hàng
    const totalQuery = {
      text: `
        SELECT SUM(oi.quantity * i.price) AS total_amount
        FROM Orders_Items oi
        JOIN Items i ON oi.items_id = i.items_id
        WHERE oi.orders_id = $1
        GROUP BY oi.orders_id;
      `,
      values: [orders_id],
    };
    const totalResult = await pool.query(totalQuery);

    const totalAmount = totalResult.rows[0]?.total_amount || 0; // Nếu không có, gán giá trị mặc định là 0

    // Tạo hóa đơn
    const assignBillQuery = {
      text: "INSERT INTO Bill (total, orders_id, staff_id) VALUES ($1, $2, $3) RETURNING *",
      values: [totalAmount, orders_id, staff_id],
    };
    const assignBillResult = await pool.query(assignBillQuery);

    // Trả về dữ liệu hóa đơn
    res.status(StatusCodes.CREATED).json({
      bill_id: assignBillResult.rows[0].bill_id,
      staff: staffResult.rows[0]?.name || "N/A",
      items: itemResult.rows,
      total: totalAmount,
      created_at: assignBillResult.rows[0].created_at,
    });
  } catch (error) {
    next(error);
  }
};
export const getBillById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Lấy thông tin hóa đơn
    const billQuery = {
      text: "SELECT * FROM Bill WHERE bill_id = $1",
      values: [id],
    };
    const billResult = await pool.query(billQuery);
    if (billResult.rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Bill not found" });
    }

    const billData = billResult.rows[0];

    // Lấy thông tin nhân viên liên quan đến hóa đơn
    const staffQuery = {
      text: "SELECT * FROM Staff WHERE staff_id = $1",
      values: [billData.staff_id],
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
      values: [billData.orders_id],
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

    // Chuyển đổi đối tượng thành mảng duy nhất các item
    const uniqueItems = Object.values(aggregatedItems);

    // Trả về dữ liệu hóa đơn
    res.status(StatusCodes.OK).json({
      bill_id: billData.bill_id,
      staff: staffResult.rows[0]?.name || "N/A", // Nếu không tìm thấy nhân viên, trả về "N/A"
      items: uniqueItems,
      total: billData.total,
      created_at: billData.created_at,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBill = async (req, res, next) => {
  try {
    // Lấy tất cả hóa đơn
    const billsQuery = {
      text: "SELECT * FROM Bill",
    };
    const billsResult = await pool.query(billsQuery);

    // Nếu không có hóa đơn nào
    if (billsResult.rows.length === 0) {
      return res.status(StatusCodes.OK).json({ message: "No bills found" });
    }

    // Mảng để lưu thông tin hóa đơn
    const billsData = [];

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

      // Chuyển đổi đối tượng thành mảng duy nhất các item
      const uniqueItems = Object.values(aggregatedItems);

      // Đẩy thông tin hóa đơn vào mảng
      billsData.push({
        bill_id: bill.bill_id,
        staff: staffResult.rows[0]?.name || "N/A", // Nếu không tìm thấy nhân viên, trả về "N/A"
        items: uniqueItems,
        total: bill.total,
        created_at: bill.created_at,
      });
    }

    // Trả về danh sách hóa đơn
    res.status(StatusCodes.OK).json(billsData);
  } catch (error) {
    next(error);
  }
};
export const deleteBillById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem hóa đơn có tồn tại không
    const billQuery = {
      text: "SELECT * FROM Bill WHERE bill_id = $1",
      values: [id],
    };
    const billResult = await pool.query(billQuery);

    // Nếu không tìm thấy hóa đơn
    if (billResult.rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Bill not found" });
    }

    // Thực hiện xóa hóa đơn
    const deleteQuery = {
      text: "DELETE FROM Bill WHERE bill_id = $1",
      values: [id],
    };
    await pool.query(deleteQuery);
    // Trả về thông báo thành công
    res.status(StatusCodes.OK).json({ message: "Bill deleted successfully" });
  } catch (error) {
    next(error);
  }
};
