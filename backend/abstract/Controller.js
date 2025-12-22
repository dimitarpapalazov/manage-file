import Status from "../enum/Status.js";

/** @template {typeof import('sequelize/types/model.js').default} Model */
export class Controller {
    /** @param {Model} model  */
    constructor(model) {
        this.model = model;
    }
    /**
     * @param {import('express/index.js').Request} request
     * @param {import('express/index.js').Response} response
     */
    async create(request, response) {
        try {
            const result = await this.model.create(request.body);

            const body = result.toJSON();

            response.status(Status.Created).json(body);
        } catch (error) {
            // TODO: custom logger
            console.log(error);

            response.status(Status.InternalServerError).end();
        }
    }

    /**
     * @param {import('express/index.js').Request} request
     * @param {import('express/index.js').Response} response
     */
    async read(request, response) {
        const id = parseInt(request.params.id);

        try {
            const result = await this.model.findByPk(id);

            if (result === null) {
                response.status(Status.NotFound).end();
            } else {
                const body = result.toJSON();

                response.status(Status.Ok).json(body);
            }
        } catch (error) {
            // TODO: custom logger
            console.log(error);

            response.status(Status.InternalServerError).end();
        }
    }

    /**
     * @param {import('express/index.js').Request} request
     * @param {import('express/index.js').Response} response
     */
    async readAll(request, response) {
        try {
            const result = await this.model.findAll();

            const body = result.map((r) => r.toJSON());

            response.status(Status.Ok).json(body);
        } catch (error) {
            // TODO: custom logger
            console.log(error);

            response.status(Status.InternalServerError).end();
        }
    }

    /**
     * @param {import('express/index.js').Request} request
     * @param {import('express/index.js').Response} response
     */
    async update(request, response) {
        const data = request.body;

        try {
            const result = await this.model.update(data, { returning: true });

            if (result[0] === 0) {
                response.status(Status.NotFound).end();

                return;
            }

            const body = result[1].map((r) => r.toJSON());

            response.status(Status.Ok).json(body.length === 1 ? body[0] : body);
        } catch (error) {
            // TODO: custom logger
            console.log(error);

            response.status(Status.InternalServerError).end();
        }
    }

    /**
     * @param {import('express/index.js').Request} request
     * @param {import('express/index.js').Response} response
     */
    async delete(request, response) {
        const id = parseInt(request.params.id);

        try {
            const result = await this.model.destroy({ where: { id } });

            if (result === 0) {
                response.status(Status.NotFound).end();
            } else {
                response.status(Status.NoContent).end();
            }
        } catch (error) {
            // TODO: custom logger
            console.log(error);

            response.status(Status.InternalServerError).end();
        }
    }
}
