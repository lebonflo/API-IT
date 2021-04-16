const Genre = require('../models').Genre;
const { Op } = require('sequelize');

class GenreController {
    async getAll(req, res, next) {
        try {
            const genres = await Genre.findAll()
            res.status(200).json(genres)
        } catch (error) {
            res.status(404).json({ "error": "Genre not found" })
        }
    }

    async getById(id) {
        return Genre.findByPk(id);
    }

    async getByName(name) {
        return Genre.findAll({
            where: {
                name: {
                    [Op.like]: `%${name}%`
                }
            }
        });
    }
}

module.exports = new GenreController();