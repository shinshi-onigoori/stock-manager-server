import * as mysql from "mysql2/promise";

export const CONNECTION = mysql.createConnection(process.env.DB_URL!)