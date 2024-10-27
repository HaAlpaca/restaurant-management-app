// Hàm filter và sort danh sách các bàn theo đơn hàng
export const filterTablesByOrder = async (pool, orderId, filter, sort) => {
  let query = `
    SELECT t.*
    FROM tables t
    JOIN orders_tables ot ON t.tables_id = ot.tables_id
    WHERE ot.orders_id = $1
  `;

  if (filter === "Đang sử dụng") {
    query += ` AND t.status = 'Đang sử dụng'`;
  } else if (filter === "Có sẵn") {
    query += ` AND t.status = 'Có sẵn'`;
  }

  query += ` ORDER BY ot.created_at ${sort === "desc" ? "DESC" : "ASC"}`;

  try {
    const result = await pool.query(query, [orderId]);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Hàm filter và sort danh sách các đơn hàng theo bàn (chỉ pending và completed)
export const filterOrdersByTable = async (pool, tableId, filter, sort) => {
  let query = `
    SELECT o.*
    FROM orders o
    JOIN orders_tables ot ON o.orders_id = ot.orders_id
    WHERE ot.tables_id = $1
  `;

  if (filter === "Đang chờ") {
    query += ` AND o.status = 'Đang chờ'`;
  } else if (filter === "Hoàn thành") {
    query += ` AND o.status = 'Hoàn thành'`;
  }

  query += ` ORDER BY ot.created_at ${sort === "desc" ? "DESC" : "ASC"}`;

  try {
    const result = await pool.query(query, [tableId]);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};
