const knex = require("knex").verbose();
const KnexQueryBuilder = require("knex/lib/query/builder");
const config = require("../DatabaseConfig/db");

knex.queryBuilder = () => new KnexQueryBuilder(knex.client);
const knexDb = knex({
    client: "mysql",
    connection: config,
    pool: {min: 1, max: 7},
});

module.exports = knexDb;