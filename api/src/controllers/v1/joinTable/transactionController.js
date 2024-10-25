import { pool } from "../../../config/db.js";
import { StatusCodes } from "http-status-codes";
import {
  filterProductsByProvider,
  filterProviderByProduct,
} from "../../../services/v1/transactionService.js";

// Hàm lấy tất cả giao dịch
const getAllTransactions = async (req, res, next) => {
  try {
    const result = await pool.query(`SELECT * FROM Transactions`);
    // console.log(result);
    res.status(StatusCodes.OK).json(result.rows);
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

    if (
      !staff_id ||
      !providers_id ||
      !products_id ||
      !status ||
      !name ||
      !quantity ||
      !unit ||
      !price
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Missing required fields" });
    }
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
  getAllTransactions,
  assignTransactions,
  getTransactionById,
  getProductByProvider,
  getProviderByProduct,
  deleteTransaction,
};
