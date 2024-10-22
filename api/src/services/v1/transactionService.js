export const filterTransaction = async (pool, transactionId) => {
  try {
    const result = await pool.query(query, [transactionId]);
    return result.rows[0];
  } catch (error) {
    throw new Error(error.message);
  }
};

export const filterProductsByProvider = async (pool, providerId) => {
  const query = `
    SELECT p.*
    FROM Products p
    JOIN Transactions t ON p.products_id = t.products_id
    WHERE t.providers_id = $1
  `;

  try {
    const result = await pool.query(query, [providerId]);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const filterProviderByProduct = async (pool, productId) => {
  const query = `
    SELECT p.* 
    FROM Providers p
    JOIN Transactions t ON p.providers_id = t.providers_id
    WHERE t.products_id = $1
  `;

  try {
    const result = await pool.query(query, [productId]);

    return result.rows; // Trả về nhà cung cấp đầu tiên được tìm thấy
  } catch (error) {
    throw new Error(error.message);
  }
};

// export const filterTransaction = async (pool, transactionId) => {
//   try {
//     // Lấy thông tin giao dịch
//     const transactionQuery = `
//       SELECT
//           transactions_id,
//           staff_id,
//           providers_id,
//           products_id,
//           status,
//           quantity AS quantity_used,
//           unit,
//           price,
//           description,
//           created_at,
//           updated_at
//       FROM Transactions
//       WHERE transactions_id = $1
//     `;

//     const transactionResult = await pool.query(transactionQuery, [
//       transactionId,
//     ]);

//     // Kiểm tra xem giao dịch có tồn tại không
//     if (transactionResult.rows.length === 0) {
//       throw new Error("Transaction not found");
//     }

//     const transaction = transactionResult.rows[0];

//     // Lấy thông tin nhân viên
//     const staffResult = await pool.query(
//       `SELECT * FROM Staff WHERE staff_id = $1`,
//       [transaction.staff_id]
//     );

//     // Lấy thông tin nhà cung cấp
//     const providerResult = await pool.query(
//       `SELECT * FROM Providers WHERE providers_id = $1`,
//       [transaction.providers_id]
//     );

//     // Lấy thông tin sản phẩm
//     const productResult = await pool.query(
//       `SELECT * FROM Products WHERE products_id = $1`,
//       [transaction.products_id]
//     );

//     return {
//       ...transaction,
//       staff: staffResult.rows[0] || null, // Trả về nhân viên hoặc null nếu không tìm thấy
//       provider: providerResult.rows[0] || null, // Trả về nhà cung cấp hoặc null nếu không tìm thấy
//       product: productResult.rows[0] || null, // Trả về sản phẩm hoặc null nếu không tìm thấy
//     };
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };
