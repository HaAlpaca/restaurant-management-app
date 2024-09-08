import pg from "pg";
import dotenv from 'dotenv';
dotenv.config();
const pool = new pg.Pool({
  connectionString: process.env.PGSQL_CONNECTIONSTRING,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
