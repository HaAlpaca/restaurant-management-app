export const filterShiftsByStaff = async (
  pool,
  staffId,
  filter = "",
  sort = "asc"
) => {
  let filterCondition = "";
  const filterParams = [staffId];

  // Xử lý các trường hợp filter khác nhau
  if (filter === "today") {
    filterCondition = "AND ss.date = CURRENT_DATE";
  } else if (filter === "past") {
    filterCondition = "AND ss.date < CURRENT_DATE";
  } else if (filter === "future") {
    filterCondition = "AND ss.date > CURRENT_DATE";
  }

  // Xác định thứ tự sắp xếp
  let sortCondition = "ASC"; // Mặc định là sắp xếp tăng dần
  if (sort === "desc") {
    sortCondition = "DESC"; // Nếu có yêu cầu sắp xếp giảm dần
  }

  // Truy vấn các ca làm việc của nhân viên với điều kiện lọc và sắp xếp
  const shiftsResult = await pool.query(
    `SELECT ss.staff_shift_id, sh.name AS shift_name, sh.start_time, sh.end_time, ss.date, ss.is_attendance
         FROM shift sh
         JOIN staff_shift ss ON sh.shift_id = ss.shift_id
         WHERE ss.staff_id = $1 ${filterCondition}
         ORDER BY ss.date ${sortCondition}`, // Sắp xếp theo ngày
    filterParams
  );

  return shiftsResult.rows; // Trả về danh sách các ca làm
};

// Hàm để xử lý filter nhân viên trong một ca làm việc với sắp xếp
export const filterStaffByShift = async (
  pool,
  shiftId,
  filter = "",
  sort = "asc"
) => {
  // Tạo điều kiện lọc dựa trên filter (nếu có)
  let filterCondition = "";
  const filterParams = [shiftId];

  // Xử lý các trường hợp filter khác nhau
  if (filter === "today") {
    filterCondition = "AND ss.date = CURRENT_DATE";
  } else if (filter === "past") {
    filterCondition = "AND ss.date < CURRENT_DATE";
  } else if (filter === "future") {
    filterCondition = "AND ss.date > CURRENT_DATE";
  }

  // Xác định thứ tự sắp xếp
  let sortCondition = "ASC"; // Mặc định là sắp xếp tăng dần
  if (sort === "desc") {
    sortCondition = "DESC"; // Nếu có yêu cầu sắp xếp giảm dần
  }

  // Truy vấn để lấy danh sách nhân viên theo ca làm việc với điều kiện lọc và sắp xếp
  const staffResult = await pool.query(
    `SELECT st.*, ss.date
         FROM staff st
         JOIN staff_shift ss ON st.staff_id = ss.staff_id
         WHERE ss.shift_id = $1 ${filterCondition}
         ORDER BY ss.date ${sortCondition}`,
    filterParams
  );

  return staffResult.rows; // Trả về danh sách các nhân viên
};
