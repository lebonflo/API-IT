const Movie = require('../models').Movie;

class MovieController {
    async getAll() {
        return Movie.findAll();
    }

    async getPagination(req, res) {
        try {
            let page = (parseInt(req.params.page));
            let offset = ((page?page:0)*10);
            const movies = await Movie.findAll({offset, limit: 10});
            res.send(movies);
        } catch (error) {
            res.status(500).send({error})
        }
    }

    async getById(id) {
        return Movie.findByPk(id);
    }

    async add(title, description, year) {
        try {
            return await Movie.create({ title, description, year });
        } catch (err) {
            console.log(err);
        }
    }

    async update(id, payload) {
        return Movie.update(payload, {
            where: {
                id: id
            }
        });
    }

    async delete(id) {
        return Movie.destroy({
            where: {
                id: id
            }
        });
    }

}

module.exports = new MovieController();