import { User } from "../user/user.model.js";

/** @param {import('sequelize/index.js')} sequelize */
export function initializeModels(sequelize) {
    User.initialize(sequelize);
}
