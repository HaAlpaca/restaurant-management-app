import { pool } from "../../../config/db.js";
import { StatusCodes } from "http-status-codes";
import {
  filterProductsByProvider,
  filterProviderByProduct,
} from "../../../services/v1/transactionService.js";

// Hàm lấy tất cả giao dịch
const getAllTransactions = async (req, res, next) => {
  try {
    const { start_date, end_date, sort = "DESC" } = req.query;

    // Tạo điều kiện lọc cho khoảng thời gian nếu start_date và end_date được cung cấp
    const timeFilter =
      start_date && end_date ? `created_at BETWEEN $1 AND $2` : "TRUE";

    // Xác định thứ tự sắp xếp (ASC hoặc DESC)
    const sortOrder = sort.toUpperCase() === "ASC" ? "ASC" : "DESC";

    // Xây dựng câu truy vấn với điều kiện lọc thời gian và sắp xếp
    const transactionsQuery = {
      text: `
        SELECT * 
        FROM Transactions
        WHERE ${timeFilter}
        ORDER BY created_at ${sortOrder}
      `,
      values: start_date && end_date ? [start_date, end_date] : [],
    };

    const result = await pool.query(transactionsQuery);

    // Nếu không có giao dịch nào
    if (result.rowCount === 0) {
      return res
        .status(StatusCodes.OK)
        .json({ message: "No transactions found" });
    }

    res.status(StatusCodes.OK).json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getAllTransactionsForReport = async (req, res, next) => {
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

    // Truy vấn lấy tất cả các giao dịch với bộ lọc, sắp xếp và giới hạn
    const transactionsQuery = {
      text: `
        SELECT *
        FROM Transactions t
        WHERE ${timeFilter}
        ORDER BY t.created_at ${sortOrder}
        ${limitClause}
      `,
      values: limit ? [date, limit] : [date],
    };

    const transactionsResult = await pool.query(transactionsQuery);

    // Nếu không có giao dịch nào
    if (transactionsResult.rowCount === 0) {
      return res
        .status(StatusCodes.OK)
        .json({ message: "No transactions found" });
    }

    const transactionsData = [];
    const dailyTotals = {}; // Đối tượng để lưu tổng giá trị theo ngày
    let totalCompleted = 0; // Tổng giá trị cho giao dịch "Hoàn thành"
    let totalPending = 0; // Tổng giá trị cho giao dịch "Đang chờ"
    let totalCancelled = 0; // Tổng giá trị cho giao dịch "Đã huỷ"
    let totalSum = 0; // Tổng giá trị cho tất cả các giao dịch

    for (const transaction of transactionsResult.rows) {
      const transactionTotal = parseFloat(transaction.price) || 0;
      const transactionDate = transaction.created_at
        .toISOString()
        .split("T")[0]; // Lấy ngày từ created_at

      // Cộng dồn tổng giá trị cho từng ngày
      if (!dailyTotals[transactionDate]) {
        dailyTotals[transactionDate] = 0;
      }
      dailyTotals[transactionDate] += transactionTotal;

      // Cộng tổng giá trị dựa trên trạng thái
      if (transaction.status === "Hoàn thành") {
        totalCompleted += transactionTotal;
      } else if (transaction.status === "Đang chờ") {
        totalPending += transactionTotal;
      } else if (transaction.status === "Đã huỷ") {
        totalCancelled += transactionTotal;
      }

      // Cộng tổng giá trị của tất cả giao dịch
      totalSum += transactionTotal;

      // Đẩy thông tin giao dịch vào mảng
      transactionsData.push({
        transaction_id: transaction.transactions_id,
        staff_id: transaction.staff_id,
        providers_id: transaction.providers_id,
        products_id: transaction.products_id,
        status: transaction.status,
        name: transaction.name,
        quantity: transaction.quantity,
        unit: transaction.unit,
        price: transaction.price,
        description: transaction.description,
        created_at: transaction.created_at,
        updated_at: transaction.updated_at,
      });
    }

    // Trả về danh sách giao dịch, tổng giá trị cho từng trạng thái, tổng giá trị theo ngày và tổng giá trị tổng cộng
    res.status(StatusCodes.OK).json({
      transactions: transactionsData,
      totalCompleted, // Tổng giá trị cho các giao dịch "Hoàn thành"
      totalPending, // Tổng giá trị cho các giao dịch "Đang chờ"
      totalCancelled, // Tổng giá trị cho các giao dịch "Đã huỷ"
      dailyTotals, // Tổng giá trị theo từng ngày
      totalSum, // Tổng giá trị tổng cộng của tất cả các giao dịch
    });
  } catch (error) {
    next(error);
  }
};

const assignTransactions = async (req, res, next) => {
  try {
    const {
      staff_id,
      providers_id,
      products_id,
      status,
      name,
      quantity,
      unit,
      price,
      description,
    } = req.body;


    const staffExists = await pool.query(
      `SELECT 1 FROM Staff WHERE staff_id = $1`,
      [staff_id]
    );
    if (staffExists.rowCount === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: `Staff ID ${staff_id} does not exist` });
    }

    const providerExists = await pool.query(
      `SELECT 1 FROM Providers WHERE providers_id = $1`,
      [providers_id]
    );
    if (providerExists.rowCount === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: `Provider ID ${providers_id} does not exist` });
    }

    // Kiểm tra `products_id` có tồn tại không
    const productExists = await pool.query(
      `SELECT * FROM Products WHERE products_id = $1`,
      [products_id]
    );
    if (productExists.rowCount === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: `Product ID ${products_id} does not exist` });
    }
    // console.log(productExists.rows[0]);
    // So sánh `unit` của product và transaction
    const productUnit = productExists.rows[0].unit;
    if (productUnit !== unit) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: `Unit mismatch: Product unit is '${productUnit}', but transaction unit is '${unit}'`,
      });
    }
    const result = await pool.query(
      `INSERT INTO Transactions (staff_id, providers_id, products_id, status, name, quantity, unit, price, description)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
      [
        staff_id,
        providers_id,
        products_id,
        status,
        name,
        quantity,
        unit,
        price,
        description,
      ]
    );
    // console.log(result);
    res.status(StatusCodes.CREATED).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fieldsToUpdate = req.body;

    // Kiểm tra nếu không có fields để cập nhật
    if (Object.keys(fieldsToUpdate).length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "No fields provided to update" });
    }

    // Tạo các phần query động để cập nhật chỉ những fields được cung cấp
    const setClause = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(fieldsToUpdate)) {
      setClause.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }

    values.push(id); // Thêm transactions_id vào cuối để dùng trong điều kiện WHERE

    const query = `
      UPDATE Transactions
      SET ${setClause.join(", ")}
      WHERE transactions_id = $${index}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    // Nếu không tìm thấy transaction với transactions_id đã cho
    if (result.rowCount === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `Transaction ID ${id} not found` });
    }

    res.status(StatusCodes.OK).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Truy vấn để lấy transaction theo id
    const transactionQuery = `
      SELECT *
      FROM Transactions
      WHERE transactions_id = $1
    `;

    const transactionResult = await pool.query(transactionQuery, [id]);

    // Nếu không tìm thấy transaction, trả về lỗi
    if (transactionResult.rowCount === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `Transaction with ID ${id} not found` });
    }

    // Trả về transaction nếu tìm thấy
    res.status(StatusCodes.OK).json(transactionResult.rows[0]);
  } catch (error) {
    next(error);
  }
};

const getProductByProvider = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem transaction có tồn tại không
    const providerResult = await pool.query(
      `SELECT * FROM Providers WHERE providers_id = $1`,
      [id]
    );
    if (providerResult.rowCount === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: `Provider ID ${id} does not exist` });
    }
    const productResult = await filterProductsByProvider(pool, id);
    const transactionResult = await pool.query(
      "SELECT * FROM transactions WHERE providers_id = $1",
      [id]
    );
    // Trả về transaction nếu tìm thấy
    res.status(StatusCodes.OK).json({
      ...providerResult.rows[0],
      transactions: transactionResult.rows,
      products: productResult,
    });
  } catch (error) {
    next(error);
  }
};
const getProviderByProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem sản phẩm có tồn tại không
    const productResult = await pool.query(
      `SELECT * FROM Products WHERE products_id = $1`,
      [id]
    );
    if (productResult.rowCount === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: `Product ID ${id} does not exist` });
    }

    // Lấy thông tin nhà cung cấp từ sản phẩm qua bảng Transactions
    const providerResult = await filterProviderByProduct(pool, id);
    if (providerResult.rowCount === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `No provider found for Product ID ${id}` });
    }

    // Lấy các giao dịch liên quan đến sản phẩm
    const transactionResult = await pool.query(
      "SELECT * FROM Transactions WHERE products_id = $1",
      [id]
    );

    // Trả về thông tin nhà cung cấp, các giao dịch, và sản phẩm
    res.status(StatusCodes.OK).json({
      ...productResult.rows[0],
      transactions: transactionResult.rows,
      providers: providerResult,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem transaction có tồn tại không
    const transactionResult = await pool.query(
      `SELECT * FROM Transactions WHERE transactions_id = $1`,
      [id]
    );
    if (transactionResult.rowCount === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `Transaction ID ${id} does not exist` });
    }

    // Xóa transaction
    await pool.query(`DELETE FROM Transactions WHERE transactions_id = $1`, [
      id,
    ]);

    // Trả về phản hồi thành công
    res
      .status(StatusCodes.OK)
      .json({ message: `Transaction ID ${id} deleted successfully` });
  } catch (error) {
    next(error);
  }
};

export {
  getAllTransactionsForReport,
  getAllTransactions,
  assignTransactions,
  getTransactionById,
  getProductByProvider,
  getProviderByProduct,
  deleteTransaction,
  updateTransaction,
};
