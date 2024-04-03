const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "Ybh25765",
  database: "finalProject",
});

module.exports = client; 
