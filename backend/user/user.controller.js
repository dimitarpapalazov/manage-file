import Status from "../enum/Status.js";
import bcrypt from "bcrypt";
import { Controller } from "../abstract/Controller.js";
import { User } from "./user.model.js";

/** @extends {Controller<typeof User>} */
export class UserController extends Controller {
    constructor() {
        super(User);
    }

    /**
     * @private
     * @param {User} user
     * @returns {Object}
     */
    sanitize(user) {
        const result = user.toJSON();
        result.password = undefined;
        return result;
    }

    /**
     * @override
     * @param {import('express/index.js').Request} request
     * @param {import('express/index.js').Response} response
     */
    async create(request, response) {
        try {
            const data = { ...request.body };

            if (data.password) {
                const salt = await bcrypt.genSalt(10);
                data.password = await bcrypt.hash(data.password, salt);
            }

            const result = await this.model.create(data);

            const body = this.sanitize(result);

            response.status(Status.Created).json(body);
        } catch (error) {
            // TODO: custom logger
            console.log(error);

            response.status(Status.InternalServerError).end();
        }
    }

    /**
     * @override
     * @param {import('express/index.js').Request} request
     * @param {import('express/index.js').Response} response
     */
    async read(request, response) {
        const uuid = request.params.uuid;

        try {
            const result = await this.model.findByPk(uuid);

            if (result === null) {
                response.status(Status.NotFound).end();
            } else {
                const body = this.sanitize(result);
                response.status(Status.Ok).json(body);
            }
        } catch (error) {
            // TODO: custom logger
            console.log(error);

            response.status(Status.InternalServerError).end();
        }
    }

    /**
     * @override
     * @param {import('express/index.js').Request} request
     * @param {import('express/index.js').Response} response
     */
    async readAll(request, response) {
        try {
            const result = await this.model.findAll();

            const body = result.map((r) => this.sanitize(r));

            response.status(Status.Ok).json(body);
        } catch (error) {
            // TODO: custom logger
            console.log(error);

            response.status(Status.InternalServerError).end();
        }
    }

    /**
     * @override
     * @param {import('express/index.js').Request} request
     * @param {import('express/index.js').Response} response
     */
    async update(request, response) {
        const data = { ...request.body };
        const uuid = data.uuid;

        if (uuid == undefined) {
            response.status(Status.BadRequest).json({ error: "Missing UUID" });

            return;
        }

        try {
            if (data.password) {
                const salt = await bcrypt.genSalt(10);
                data.password = await bcrypt.hash(data.password, salt);
            }

            const result = await this.model.update(data, {
                where: { id: uuid },
                returning: true,
            });

            if (result[0] === 0) {
                response.status(Status.NotFound).end();
                return;
            }

            const body = result[1].map((r) => r.sanitize());

            response.status(Status.Ok).json(body.length === 1 ? body[0] : body);
        } catch (error) {
            // TODO: custom logger
            console.log(error);

            response.status(Status.InternalServerError).end();
        }
    }

    /**
     * @override
     * @param {import('express/index.js').Request} request
     * @param {import('express/index.js').Response} response
     */
    async delete(request, response) {
        const uuid = request.params.uuid;

        try {
            const result = await this.model.destroy({ where: { uuid } });

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
