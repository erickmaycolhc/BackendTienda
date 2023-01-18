import { Pool } from "pg";

const conn = new Pool({
  user: "postgres",
  password: "romantico",
  host: "localhost",
  port: 5432,
  database: "db_mascotas",
});

export { conn };
