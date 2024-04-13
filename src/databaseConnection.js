const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "Rachilio22!",
  database: "finalProject",
});

module.exports = client; 
