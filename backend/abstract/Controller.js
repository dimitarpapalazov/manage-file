import Status from "../enum/Status.js";

/** @template {import('./Service.js').Service} Service */
export class Service {
    /** @param {Service} service  */
    constructor(service) {
        this.service = service;
    }
    /**
     * @param {import('express/index.js').Request} request
     * @param {import('express/index.js').Response} response
     */
    async create(request, response) {
        try {
            const result = await this.service.create(request.body);

            response.status(Status.Created).json(result);
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
            const result = await this.service.read(id);

            if (result === null) {
                response.status(Status.NotFound).end();
            } else {
                response.status(Status.Ok).json(result);
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
            const result = await this.service.readAll();

            response.status(Status.Ok).json(result);
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
            // TODO: make everything happen in service
            const count = await this.service.update(data);

            if (count === 0) {
                response.status(Status.NotFound).end();

                return;
            }

            const result = await this.service.read(data.id);

            response.status(Status.Ok).json(result);
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
            const result = await this.service.delete(id);

            if (result) {
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
