const knex = require("knex");
const config = require("../DatabaseConfig/db");

const knexDb = knex({
    client: "mysql",
    connection: config,
    pool: {min: 1, max: 7},
});

module.exports = knexDb;