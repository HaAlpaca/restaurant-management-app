// Hàm filter và sort danh sách các bàn theo đơn hàng
export const filterTablesByOrder = async (pool, orderId, filter, sort) => {
  let query = `
    SELECT t.name AS table_name, t.location, t.status
    FROM tables t
    JOIN orders_tables ot ON t.tables_id = ot.tables_id
    WHERE ot.orders_id = $1
  `;

  if (filter === "available") {
    query += ` AND t.status = 'available'`;
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
    SELECT o.status, o.created_at, o.updated_at
    FROM orders o
    JOIN orders_tables ot ON o.orders_id = ot.orders_id
    WHERE ot.tables_id = $1
  `;

  if (filter === "pending") {
    query += ` AND o.status = 'pending'`;
  } else if (filter === "completed") {
    query += ` AND o.status = 'completed'`;
  }

  query += ` ORDER BY o.created_at ${sort === "desc" ? "DESC" : "ASC"}`;

  try {
    const result = await pool.query(query, [tableId]);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};
