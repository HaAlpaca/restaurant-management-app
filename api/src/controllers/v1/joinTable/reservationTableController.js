import { pool } from "../../../config/db.js";
import {
  filterAllReservationsByTable,
  filterAllTablesByReservation,
  filterReservationsByTable,
  filterTablesByReservation,
} from "../../../services/reservationTableService.js";
import { StatusCodes } from "http-status-codes";

// Hàm xử lý lấy danh sách các bàn theo đặt bàn
const getTablesByReservation = async (req, res) => {
  const reservationId = req.params.id;
  const filter = req.query.filter || ""; // Lấy giá trị filter từ query params (mặc định là rỗng nếu không có)
  const sort = req.query.sort || "asc"; // Lấy giá trị sort (mặc định là "asc" nếu không có)

  try {
    // Truy vấn để lấy thông tin về đặt bàn
    const reservationResult = await pool.query(
      `SELECT r.name AS reservation_name, r.time
         FROM reservations r 
         WHERE r.reservations_id = $1`,
      [reservationId]
    );

    // Kiểm tra nếu không tìm thấy đặt bàn
    if (reservationResult.rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Reservation not found" });
    }

    // Gọi hàm filter từ service để lấy danh sách các bàn liên quan đến đặt bàn
    const tables = await filterTablesByReservation(
      pool,
      reservationId,
      filter,
      sort
    );

    // Trả về dữ liệu bao gồm cả thông tin đặt bàn và danh sách các bàn
    res.status(StatusCodes.OK).json({
      reservation_name: reservationResult.rows[0].reservation_name,
      reservation_date: reservationResult.rows[0].date,
      tables: tables, // Danh sách các bàn liên quan đến đặt bàn
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
const getAllTablesByReservation = async (req, res) => {
  const filter = req.query.filter || ""; // Lấy giá trị filter từ query params (mặc định là rỗng nếu không có)
  const sort = req.query.sort || "asc"; // Lấy giá trị sort (mặc định là "asc" nếu không có)

  try {
    // Gọi hàm filter từ service để lấy danh sách các bàn liên quan đến đặt bàn
    const tables = await filterAllTablesByReservation(pool, filter, sort);

    // Trả về dữ liệu bao gồm cả thông tin đặt bàn và danh sách các bàn
    res.status(StatusCodes.OK).json({
      tables: tables, // Danh sách các bàn liên quan đến đặt bàn
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Hàm xử lý lấy danh sách các đặt bàn theo bàn
const getReservationsByTable = async (req, res) => {
  const tableId = req.params.id;
  const filter = req.query.filter || ""; // Lấy giá trị filter từ query params (mặc định là rỗng nếu không có)
  const sort = req.query.sort || "asc"; // Lấy giá trị sort (mặc định là "asc" nếu không có)

  try {
    // Truy vấn để lấy thông tin về bàn
    const tableResult = await pool.query(
      `SELECT t.name AS table_name, t.location, t.status
         FROM tables t 
         WHERE t.tables_id = $1`,
      [tableId]
    );

    // Kiểm tra nếu không tìm thấy bàn
    if (tableResult.rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Table not found" });
    }

    // Gọi hàm filter từ service để lấy danh sách các đặt bàn liên quan đến bàn
    const reservations = await filterReservationsByTable(
      pool,
      tableId,
      filter,
      sort
    );

    // Trả về dữ liệu bao gồm cả thông tin bàn và danh sách các đặt bàn
    res.status(StatusCodes.OK).json({
      table_name: tableResult.rows[0].table_name,
      table_location: tableResult.rows[0].location,
      table_status: tableResult.rows[0].status,
      reservations: reservations, // Danh sách các đặt bàn liên quan đến bàn
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
const getAllReservationsByTable = async (req, res) => {
  const filter = req.query.filter || ""; // Lấy giá trị filter từ query params (mặc định là rỗng nếu không có)
  const sort = req.query.sort || "asc"; // Lấy giá trị sort (mặc định là "asc" nếu không có)

  try {
    // Gọi hàm filter từ service để lấy danh sách các đặt bàn liên quan đến bàn
    const reservations = await filterAllReservationsByTable(pool, filter, sort);

    // Trả về dữ liệu bao gồm cả thông tin bàn và danh sách các đặt bàn
    res.status(StatusCodes.OK).json({
      reservations: reservations, // Danh sách các đặt bàn liên quan đến bàn
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Hàm thêm mối quan hệ giữa table và reservation
const add = async (req, res) => {
  const { reservations_id, tables_id } = req.body;

  try {
    // Kiểm tra nếu không đủ thông tin
    if (!reservations_id || !tables_id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Missing table or reservation ID" });
    }

    // Thêm mối quan hệ giữa table và reservation
    const result = await pool.query(
      "INSERT INTO tables_reservations (reservations_id, tables_id) VALUES ($1, $2) RETURNING *",
      [reservations_id, tables_id]
    );

    // Lấy thông tin chi tiết của reservation
    const reservationDetails = await pool.query(
      "SELECT * FROM reservations WHERE reservations_id = $1",
      [reservations_id]
    );

    // Lấy thông tin chi tiết của table
    const tableDetails = await pool.query(
      "SELECT * FROM tables WHERE tables_id = $1",
      [tables_id]
    );

    res.status(StatusCodes.CREATED).json({
      message: "Table added to reservation successfully",
      table: tableDetails.rows[0],
      reservation: reservationDetails.rows[0],
      relation: result.rows[0], // Quan hệ vừa được tạo
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Hàm xóa mối quan hệ giữa table và reservation
const remove = async (req, res) => {
  const { reservations_id, tables_id } = req.body;

  try {
    // Kiểm tra nếu không đủ thông tin
    if (!reservations_id || !tables_id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Missing table or reservation ID" });
    }

    // Xóa mối quan hệ giữa table và reservation
    const result = await pool.query(
      "DELETE FROM tables_reservations WHERE reservations_id = $1 AND tables_id = $2",
      [reservations_id, tables_id]
    );

    if (result.rowCount === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Table or reservation not found" });
    }

    res
      .status(StatusCodes.OK)
      .json({ message: "Table removed from reservation successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getall = async (req, res) => {
  try {
    // Truy vấn để lấy thông tin về bàn
    const result = await pool.query(
      `SELECT *
         FROM tables_reservations
      `
    );
    res.status(StatusCodes.OK).json(result.rows);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export {
  getTablesByReservation,
  getReservationsByTable,
  getAllTablesByReservation,
  getAllReservationsByTable,
  remove,
  add,
  getall,
};
