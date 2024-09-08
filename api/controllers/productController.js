import { pool, client } from "../db/ConnectDb.js";

const createProduct = async (req, res) => {
  try {
    const {
      name,
      quantity,
      category,
      weight,
      unit,
      total_price,
      customer_price,
      description,
    } = req.body;
    const query = {
      text: `INSERT INTO  products( name, quantity, category, weight, unit, total_price, customer_price, description) 
        VALUES($1, $2, $3, $4, $5,$6,$7,$8) RETURNING * `,
      values: [
        name,
        quantity,
        category,
        weight,
        unit,
        total_price,
        customer_price,
        description,
      ],
    };
    const ans = await pool.query(query);
    console.log(ans);

    if (ans.rowCount === 0) {
      res.status(400).json({ message: "Error in creating product" });
    } else {
      const newProduct = ans.rows[0];
      res.status(200).json(newProduct);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ message: "Invalid product ID. ID must be a number." });
    }
    const query = {
      text: "SELECT * FROM products WHERE products_id = $1",
      values: [id],
    };

    const ans = await pool.query(query);

    if (ans.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    const product = ans.rows[0];
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error(err);
  }
};
const getAllProduct = async (req, res) => {
  try {
    const query = {
      text: "SELECT * FROM products ",
      values: [],
    };

    const ans = await pool.query(query);

    if (ans.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    const product = ans.rows;
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const deleteProductById = async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ message: "Invalid product ID. ID must be a number." });
    }
    const query = {
      text: "SELECT * FROM products WHERE products_id = $1",
      values: [id],
    };

    const ans = await pool.query(query);

    if (ans.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const query2 = {
      text: "DELETE FROM products WHERE products_id = $1",
      values: [id],
    };

    const ans2 = await pool.query(query2);

    if (ans2.rowCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const updateProductById = async (req, res) => {
  try {
    const {
      name,
      quantity,
      category,
      weight,
      unit,
      total_price,
      customer_price,
      description,
    } = req.body;

    const id = req.params.id;
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ message: "Invalid product ID. ID must be a number." });
    }
    const query = {
      text: "SELECT * FROM products WHERE products_id = $1",
      values: [id],
    };

    const ans = await pool.query(query);

    if (ans.rows.length === 0) {
      return res.status(404).json({ message: "products not found" });
    }

    const query2 = {
      text: `
        UPDATE public.products
	    SET name=$1, quantity=$2, category=$3, weight=$4, unit=$5, total_price=$6, customer_price=$7, description=$8
	    WHERE products_id =$9;
      `,
      values: [
        name,
        quantity,
        category,
        weight,
        unit,
        total_price,
        customer_price,
        description,
        id,
      ],
    };
    const ans2 = await pool.query(query2);

    if (ans2.rowCount === 0) {
      res.status(400).json({ message: "Error in update provider" });
    } else {
      const newProduct = ans2.rows[0];
      res.status(200).json(newProduct);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};
export {
  createProduct,
  deleteProductById,
  getProductById,
  getAllProduct,
  updateProductById,
};
