// Hàm filter và sort danh sách các bàn theo đặt bàn
export const filterTablesByReservation = async (
  pool,
  reservationId,
  filter,
  sort
) => {
  let query = `
    SELECT t.tables_id, t.name AS table_name, t.location, t.status
    FROM tables t
    JOIN tables_reservations tr ON t.tables_id = tr.tables_id
    WHERE tr.reservations_id = $1
  `;

  if (filter === "available") {
    query += ` AND t.status = 'available'`;
  }

  query += ` ORDER BY tr.created_at ${sort === "desc" ? "DESC" : "ASC"}`;

  try {
    const result = await pool.query(query, [reservationId]);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const filterReservationsByTable = async (
  pool,
  tableId,
  filter,
  sort
) => {
  let query = `
    SELECT r.reservations_id, r.name AS reservation_name,r.quantity, r.phone, r.email, r.time
    FROM reservations r
    JOIN tables_reservations tr ON r.reservations_id = tr.reservations_id
    WHERE tr.tables_id = $1
  `;

  if (filter === "today") {
    query += ` AND r.time::date = CURRENT_DATE`;
  } else if (filter === "future") {
    query += ` AND r.time::date > CURRENT_DATE`;
  } else if (filter === "past") {
    query += ` AND r.time::date < CURRENT_DATE`;
  }

  query += ` ORDER BY r.time ${sort === "desc" ? "DESC" : "ASC"}`;

  try {
    const result = await pool.query(query, [tableId]);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};
