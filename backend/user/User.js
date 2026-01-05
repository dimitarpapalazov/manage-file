import { Model, DataTypes } from "sequelize";

export class User extends Model {
    /** @param {import('sequelize/index.js')} sequelize */
    static initialize(sequelize) {
        User.init(
            {
                uuid: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                    validate: {
                        isEmail: true,
                    },
                },
                password: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
            },
            {
                sequelize,
                modelName: "user",
            },
        );
    }
}
