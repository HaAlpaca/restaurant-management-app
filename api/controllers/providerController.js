import { pool, client } from "../db/ConnectDb.js";

const createProvider = async (req, res) => {
  try {
    const { name, address, phone, email, description } = req.body;
    const query = {
      text: "INSERT INTO providers( name, address, phone, email, description) VALUES($1, $2, $3, $4, $5) RETURNING * ",
      values: [name, address, phone, email, description],
    };
    const ans = await pool.query(query);

    if (ans.rowCount === 0) {
      res.status(400).json({ message: "Error in creating provider" });
    } else {
      const newProvider = ans.rows[0];
      res.status(200).json(newProvider);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const getProviderById = async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ message: "Invalid product ID. ID must be a number." });
    }
    const query = {
      text: "SELECT * FROM providers WHERE providers_id = $1",
      values: [id],
    };

    const ans = await pool.query(query);

    if (ans.rows.length === 0) {
      return res.status(404).json({ message: "Provider not found" });
    }
    const provider = ans.rows[0];
    res.status(200).json(provider);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error(err);
  }
};
const getAllProvider = async (req, res) => {
  try {
    const query = {
      text: "SELECT * FROM providers ",
      values: [],
    };

    const ans = await pool.query(query);

    if (ans.rows.length === 0) {
      return res.status(404).json({ message: "Provider not found" });
    }
    const provider = ans.rows;
    res.status(200).json(provider);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const deleteProviderById = async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ message: "Invalid provider ID. ID must be a number." });
    }
    const query = {
      text: "SELECT * FROM providers WHERE providers_id = $1",
      values: [id],
    };

    const ans = await pool.query(query);

    if (ans.rows.length === 0) {
      return res.status(404).json({ message: "Provider not found" });
    }

    const query2 = {
      text: "DELETE FROM providers WHERE providers_id = $1",
      values: [id],
    };

    const ans2 = await pool.query(query2);

    if (ans2.rowCount === 0) {
      return res.status(404).json({ message: "Provider not found" });
    }

    res.status(200).json({ message: "Provider deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const updateProviderById = async (req, res) => {
  try {
    const { name, address, phone, email, description } = req.body;

    const id = req.params.id;
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ message: "Invalid provider ID. ID must be a number." });
    }
    const query = {
      text: "SELECT * FROM providers WHERE providers_id = $1",
      values: [id],
    };

    const ans = await pool.query(query);

    if (ans.rows.length === 0) {
      return res.status(404).json({ message: "Provider not found" });
    }

    const query2 = {
      text: `
        UPDATE providers
        SET name = $1, address = $2, phone = $3, email = $4, description = $5
        WHERE providers_id = $6
        RETURNING *
      `,
      values: [name, address, phone, email, description, id],
    };
    const ans2 = await pool.query(query2);

    if (ans2.rowCount === 0) {
      res.status(400).json({ message: "Error in update provider" });
    } else {
      const newProvider = ans2.rows[0];
      res.status(200).json(newProvider);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};
export {
  createProvider,
  deleteProviderById,
  getProviderById,
  getAllProvider,
  updateProviderById,
};
