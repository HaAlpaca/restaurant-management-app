import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const client = new pg.Client({
  connectionString: process.env.PGSQL_CONNECTIONSTRING,
  ssl: {
    rejectUnauthorized: false,
  },
});
const pool = new pg.Pool({
  connectionString: process.env.PGSQL_CONNECTIONSTRING,
  ssl: {
    rejectUnauthorized: false,
  },
});

export { pool, client };
