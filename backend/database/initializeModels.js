import { User } from "../user/user.model.js";

// TODO: add type for "sequelize" param
export function initializeModels(sequelize) {
    User.initialize(sequelize);
}
