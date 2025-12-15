/** @template {import('./Repository.js').Repository} Repository */
export class Service {
    /** @param {Repository} repository  */
    constructor(repository) {
        this.repository = repository;
    }

    create(data) {
        return this.repository.create(data);
    }

    /** @param {number|string} id */
    read(id) {
        return this.repository.read(id);
    }

    readAll() {
        return this.repository.readAll();
    }

    update(data) {
        return this.repository.update(data.id, data);
    }

    /** @param {number|string} id */
    async delete(id) {
        return (await this.repository.delete(id)) > 0;
    }
}
