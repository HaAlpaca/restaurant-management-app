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
      `SELECT s.*
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
      ...staffResult.rows[0],
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

const getAllShift = async (req, res) => {
  const filter = req.query.filter || ""; // Lấy giá trị filter từ query params (mặc định là rỗng nếu không có)
  const sort = req.query.sort || "asc"; // Lấy giá trị sort (mặc định là "asc" nếu không có)

  try {
    // Truy vấn để lấy thông tin tất cả các cột của nhân viên
    const staffResult = await pool.query(
      `SELECT s.staff_id,s.name
         FROM staff s 
      `
    );

    const staffs = staffResult.rows; // Mảng chứa thông tin của các nhân viên
    const staffShiftData = [];

    // Sử dụng Promise.all để đảm bảo xử lý async cho từng nhân viên
    await Promise.all(
      staffs.map(async (staff) => {
        // Lấy thông tin ca làm việc của nhân viên
        const staffShifts = await filterShiftsByStaff(
          pool,
          staff.staff_id,
          filter,
          sort
        );

        // Tổ chức dữ liệu theo định dạng yêu cầu, bao gồm tất cả thông tin từ bảng staff
        const staffData = {
          ...staff, // Lấy tất cả các trường của nhân viên từ bảng staff
          shifts: staffShifts,
        };

        staffShiftData.push(staffData); // Thêm vào mảng dữ liệu cuối cùng
      })
    );

    // Trả về kết quả cho client
    res.status(StatusCodes.OK).json(staffShiftData);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

// Hàm xóa ca làm khỏi nhân viên
const removeById = async (req, res) => {
  const { id } = req.params; // Lấy id từ params

  try {
    // Kiểm tra xem ID có tồn tại không
    const checkResult = await pool.query(
      "SELECT * FROM staff_shift WHERE staff_shift_id = $1",
      [id]
    );

    if (checkResult.rowCount === 0) {
      // Nếu không tìm thấy bản ghi với ID tương ứng
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy lịch làm việc với ID này" });
    }

    // Nếu ID tồn tại, tiến hành xóa
    await pool.query("DELETE FROM staff_shift WHERE staff_shift_id = $1", [id]);

    res
      .status(StatusCodes.OK)
      .json({ message: "Xoá lịch làm việc thành công" });
  } catch (error) {
    // Xử lý lỗi
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const updateAttendance = async (req, res) => {
  const { id } = req.params; // Lấy staff_shift_id từ params

  try {
    // Kiểm tra xem ID có tồn tại không
    const checkResult = await pool.query(
      "SELECT is_attendance FROM staff_shift WHERE staff_shift_id = $1",
      [id]
    );

    if (checkResult.rowCount === 0) {
      // Nếu không tìm thấy bản ghi với ID tương ứng
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy lịch làm việc với ID này" });
    }

    // Kiểm tra nếu ca làm việc đã được điểm danh
    if (checkResult.rows[0].is_attendance) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Ca làm việc này đã được điểm danh rồi" });
    }

    // Nếu chưa điểm danh, tiến hành cập nhật is_attendance
    await pool.query(
      "UPDATE staff_shift SET is_attendance = true WHERE staff_shift_id = $1",
      [id]
    );

    res.status(StatusCodes.OK).json({ message: "Điểm danh thành công" });
  } catch (error) {
    // Xử lý lỗi
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export {
  assign,
  getShiftsByStaff,
  getStaffByShift,
  remove,
  getAllShift,
  removeById,
  updateAttendance,
};
