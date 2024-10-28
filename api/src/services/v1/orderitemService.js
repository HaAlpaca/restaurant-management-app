// Hàm filter và sort danh sách các mục theo đơn hàng
export const filterAndSortItemsByOrder = async (
  pool,
  orderId,
  filter,
  sort
) => {
  let query = `
        SELECT i.*, oi.quantity as quantity_used,oi.orders_items_id
        FROM orders_items oi
        JOIN items i ON oi.items_id = i.items_id
        WHERE oi.orders_id = $1
      `;

  const queryParams = [orderId]; // Khởi tạo với orderId

  // Nếu có filter, thêm điều kiện vào query
  if (filter) {
    query += ` AND (i.name ILIKE '%' || $2 || '%' OR oi.description ILIKE '%' || $2 || '%')`;
    queryParams.push(filter); // Chỉ thêm filter vào queryParams khi nó tồn tại
  }

  // Sắp xếp theo thời gian tạo
  query += ` ORDER BY oi.created_at ${sort === "desc" ? "DESC" : "ASC"}`;

  try {
    const result = await pool.query(query, queryParams); // Truyền đúng số lượng tham số
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const filterAndSortOrdersByItem = async (pool, itemId, filter, sort) => {
  let query = `
          SELECT o.*, oi.quantity as quantity_used,oi.orders_items_id
          FROM orders_items oi
          JOIN orders o ON o.orders_id = oi.orders_id
          WHERE oi.items_id = $1
        `;
  // Nếu có filter, thêm điều kiện vào query
  if (filter === "pending") {
    query += ` AND o.status = 'pending'`;
  } else if (filter === "completed") {
    query += ` AND o.status = 'completed'`;
  }

  // Sắp xếp theo thời gian tạo đơn hàng
  query += ` ORDER BY o.created_at ${sort === "desc" ? "DESC" : "ASC"}`;

  try {
    const result = await pool.query(query, [itemId]);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};
