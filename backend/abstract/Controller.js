import express from "express";
import Status from "../enum/Status.js";

/** @template {typeof import('sequelize/types/model.js').default} Model */
export class Controller {
    /** @param {Model} model  */
    constructor(model) {
        /** @protected */
        this.model = model;
        /** @protected */
        this.router = express.Router();
        this.initializeRoutes();
    }

    /** @protected */
    initializeRoutes() {
        this.router.post("/create", this.create.bind(this));
        this.router.get("/read/:id", this.read.bind(this));
        this.router.get("/read-all", this.readAll.bind(this));
        this.router.put("/update", this.update.bind(this));
        this.router.delete("/delete/:id", this.delete.bind(this));
    }

    /**
     * @param {express.Request} request
     * @param {express.Response} response
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
     * @param {express.Request} request
     * @param {express.Response} response
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
     * @param {express.Request} request
     * @param {express.Response} response
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
     * @param {express.Request} request
     * @param {express.Response} response
     */
    async update(request, response) {
        const data = request.body;

        try {
            if (data.id == undefined) {
                response
                    .status(Status.BadRequest)
                    .json({ error: "Missing ID" });

                return;
            }

            const id = parseInt(data.id);

            const result = await this.model.update(data, {
                where: {
                    id,
                },
                returning: true,
            });

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
     * @param {express.Request} request
     * @param {express.Response} response
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
