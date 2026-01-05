import express from "express";
import { initializeModels } from "../database/initializeModels.js";
import sequelize from "../database/config.js";
import { UserController } from "../user/UserController.js";

export class App {
    constructor() {
        /**
         * @readonly
         * @private
         */
        this.port = 4000;
        /**
         * @readonly
         * @private
         */
        this.instance = express();
        this.initialize();
    }

    /** @private */
    async initialize() {
        await this.database();
        this.middleware();
        this.routes();
        this.listen();
    }

    /** @private */
    async database() {
        initializeModels(sequelize);
        await sequelize.sync();
    }

    /** @private */
    middleware() {}

    /** @private */
    routes() {
        this.instance.use("/api/user", new UserController().router);
    }

    /** @private */
    listen() {
        this.instance.listen(this.port, () =>
            console.log("Running on", this.port),
        );
    }
}
