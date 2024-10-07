// Hàm filter và sort danh sách các bàn theo đặt bàn
export const filterTablesByReservation = async (
  pool,
  reservationId,
  filter,
  sort
) => {
  // Tạo câu truy vấn động dựa trên filter và sort
  let query = `
    SELECT t.name AS table_name, t.location, t.status
    FROM tables t
    JOIN tables_reservations tr ON t.tables_id = tr.tables_id
    WHERE tr.reservations_id = $1
  `;

  // Thêm điều kiện filter nếu có
  if (filter === "available") {
    query += ` AND t.status = 'available'`;
  }

  // Thêm điều kiện sort
  query += ` ORDER BY tr.created_at ${sort === "desc" ? "DESC" : "ASC"}`;

  try {
    // Thực hiện truy vấn và trả về kết quả
    const result = await pool.query(query, [reservationId]);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Hàm filter và sort danh sách các đặt bàn theo bàn
export const filterReservationsByTable = async (
  pool,
  tableId,
  filter,
  sort
) => {
  // Tạo câu truy vấn động dựa trên filter và sort
  let query = `
    SELECT r.name AS reservation_name, r.phone, r.email, r.time
    FROM reservations r
    JOIN tables_reservations tr ON r.reservations_id = tr.reservations_id
    WHERE tr.tables_id = $1
  `;

  // Thêm điều kiện filter nếu có
  if (filter === "today") {
    query += ` AND r.time::date = CURRENT_DATE`; // Lọc các bản ghi trong ngày hôm nay
  } else if (filter === "future") {
    query += ` AND r.time::date > CURRENT_DATE`; // Lọc các bản ghi trong tương lai
  } else if (filter === "past") {
    query += ` AND r.time::date < CURRENT_DATE`; // Lọc các bản ghi trong quá khứ
  }

  // Thêm điều kiện sort
  query += ` ORDER BY r.time ${sort === "desc" ? "DESC" : "ASC"}`;

  try {
    // Thực hiện truy vấn và trả về kết quả
    const result = await pool.query(query, [tableId]);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};
