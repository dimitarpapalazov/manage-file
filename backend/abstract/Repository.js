/** @template {typeof import('sequelize/types/model.js').default} Model */
export class Repository {
    /** @param {Model} model  */
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        const result = await this.model.create(data);

        return result.get({ plain });
    }

    /** @param {number|string} id */
    async read(id) {
        const result = await this.model.findByPk(id);

        return result?.get({ plain: true });
    }

    async readAll() {
        const result = await this.model.findAll();

        return result.map((model) => model.get({ plain: true }));
    }

    /**
     * @param {number|string} id
     * @param {object} data
     */
    async update(id, data) {
        if (id == undefined) {
            // TODO: make custom error
            throw new Error("id is undefined");
        }

        const result = await this.model.update(data, { where: { id } });
        return result[0];
    }

    /** @param {number|string} id */
    async delete(id) {
        const result = await this.model.destroy({ where: { id } });

        return result;
    }
}
