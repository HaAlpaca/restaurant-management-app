import pg from "pg";
import { env } from "./environment.js";

const client = new pg.Client({
  connectionString: process.env.PGSQL_CONNECTIONSTRING,
  ssl: {
    rejectUnauthorized: false,
  },
});
const pool = new pg.Pool({
  connectionString: env.PGSQL_CONNECTIONSTRING,
  ssl: {
    rejectUnauthorized: false,
  },
});

export { pool, client };
