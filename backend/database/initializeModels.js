import { User } from "../user/User.js";

/** @param {import('sequelize/index.js')} sequelize */
export function initializeModels(sequelize) {
    User.initialize(sequelize);
}
