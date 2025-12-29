import { Sequelize } from "sequelize";

const config = new Sequelize("manage_file", "root", "admin", {
    host: "127.0.0.1",
    port: 3306,
    dialect: "mysql",
    logging: false,
});

export default config;
