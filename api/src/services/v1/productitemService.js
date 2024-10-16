// Hàm filter và sort danh sách các mục theo đơn hàng
export const filterAndSortItemsByProduct = async (
  pool,
  productId,
  filter,
  sort
) => {
  let query = `
          SELECT i.*, pi.quantity as quantity_used
          FROM Products_Items pi
          JOIN items i ON pi.items_id = i.items_id
          WHERE pi.products_id = $1
        `;

  const queryParams = [productId]; // Khởi tạo với orderId

  // Nếu có filter, thêm điều kiện vào query
  if (filter) {
    query += ` AND (i.name ILIKE '%' || $2 || '%' OR oi.description ILIKE '%' || $2 || '%')`;
    queryParams.push(filter); // Chỉ thêm filter vào queryParams khi nó tồn tại
  }

  // Sắp xếp theo thời gian tạo
  query += ` ORDER BY pi.created_at ${sort === "desc" ? "DESC" : "ASC"}`;

  try {
    const result = await pool.query(query, queryParams);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const filterAndSortProductsByItem = async (
  pool,
  itemId,
  filter,
  sort
) => {
  let query = `
            SELECT p.*, pi.quantity as quantity_used
            FROM Products_Items pi
            JOIN products p ON p.products_id = pi.products_id
            WHERE pi.items_id = $1
          `;
  // Nếu có filter, thêm điều kiện vào query
  if (filter === "pending") {
    query += ` AND o.status = 'pending'`;
  } else if (filter === "completed") {
    query += ` AND o.status = 'completed'`;
  }

  // Sắp xếp theo thời gian tạo đơn hàng
  query += ` ORDER BY pi.created_at ${sort === "desc" ? "DESC" : "ASC"}`;

  try {
    const result = await pool.query(query, [itemId]);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};
