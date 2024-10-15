import { pool } from "../../../config/db.js";
import { filterShiftsByStaff } from "../../../services/v1/staffShiftService.js";
import { filterStaffByShift } from "../../../services/v1/staffShiftService.js";
import { StatusCodes } from "http-status-codes";

// Hàm phân công ca làm việc cho nhân viên
const assign = async (req, res) => {
  const { staff_id, shift_id, date } = req.body;

  try {
    await pool.query(
      "INSERT INTO staff_shift (staff_id, shift_id, date) VALUES ($1, $2, $3)",
      [staff_id, shift_id, date]
    );

    // Truy vấn để lấy tên nhân viên và giờ làm
    const result = await pool.query(
      `SELECT st.name, s.start_time, s.end_time
         FROM staff st
         JOIN shift s ON s.shift_id = $1
         WHERE st.staff_id = $2`,
      [shift_id, staff_id]
    );

    if (result.rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Staff or shift not found" });
    }

    res.status(StatusCodes.CREATED).json({
      staffName: result.rows[0].name,
      startTime: result.rows[0].start_time,
      endTime: result.rows[0].end_time,
      date: date,
      staff_id: staff_id,
      shift_id: shift_id,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

// Hàm lấy danh sách ca làm việc theo nhân viên
const getShiftsByStaff = async (req, res) => {
  const id = req.params.id;
  const filter = req.query.filter || ""; // Lấy giá trị filter từ query params (mặc định là rỗng nếu không có)
  const sort = req.query.sort || "asc"; // Lấy giá trị sort (mặc định là "asc" nếu không có)

  try {
    // Truy vấn để lấy thông tin nhân viên
    const staffResult = await pool.query(
      `SELECT s.name, s.role
         FROM staff s 
         WHERE s.staff_id = $1`,
      [id]
    );

    if (staffResult.rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Staff not found" });
    }

    const shifts = await filterShiftsByStaff(pool, id, filter, sort);

    res.status(StatusCodes.OK).json({
      name: staffResult.rows[0].name,
      role: staffResult.rows[0].role,
      shifts: shifts, // Danh sách các ca làm việc đã được lọc và sắp xếp
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

// Hàm lấy danh sách nhân viên theo ca làm
const getStaffByShift = async (req, res) => {
  const id = req.params.id;
  const filter = req.query.filter || ""; // Lấy giá trị filter từ query params (mặc định là rỗng nếu không có)
  const sort = req.query.sort || "asc"; // Lấy giá trị sort (mặc định là "asc" nếu không có)

  try {
    // Truy vấn để lấy thông tin về ca làm việc
    const shiftResult = await pool.query(
      `SELECT s.name AS shift_name, s.start_time, s.end_time
         FROM shift s 
         WHERE s.shift_id = $1`,
      [id]
    );

    if (shiftResult.rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Shift not found" });
    }

    // Gọi hàm filter từ service để lấy danh sách nhân viên trong ca làm việc với điều kiện lọc và sắp xếp
    const staff = await filterStaffByShift(pool, id, filter, sort);

    res.status(StatusCodes.OK).json({
      shift_name: shiftResult.rows[0].shift_name,
      start_time: shiftResult.rows[0].start_time,
      end_time: shiftResult.rows[0].end_time,
      staff: staff, // Danh sách các nhân viên trong ca làm
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

// Hàm xóa ca làm khỏi nhân viên
const remove = async (req, res) => {
  const { staff_id, shift_id } = req.body;

  try {
    const result = await pool.query(
      "DELETE FROM staff_shift WHERE staff_id = $1 AND shift_id = $2",
      [staff_id, shift_id]
    );

    if (result.rowCount === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Shift or staff not found" });
    }

    res.status(StatusCodes.OK).json({ success: true });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export { assign, getShiftsByStaff, getStaffByShift, remove };
