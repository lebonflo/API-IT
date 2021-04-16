const Movie = require('../models').Movie;

const { Op } = require("sequelize")

class MovieController {

    async getAll(req, res, next) {
        try {
            const movies = await Movie.findAll({
                attributes: ['id', 'title', 'description', 'year'],
            });
            res.status(200).json(movies)
        } catch (error) {
            res.status(404).json({ "error": "Movies not found" })
        }
    }

    async getPagination(offset) {
        let limit = 10;
        const paginateMovie = await Movie.findAndCountAll({
            limit: limit,
            offset: offset,
        });
        const totalPages = Math.ceil(paginateMovie.count / limit);
        const currentPages = Math.ceil(offset / limit)
        return {
            totalItems: paginateMovie.count,
            totalPages: totalPages,
            limit: limit,
            rows: paginateMovie.rows,
            currentPageSize: paginateMovie.rows.length,
            currentPage: currentPages,
            movies: paginateMovie.rows
        };
    }

    async getById(id) {
        return Movie.findByPk(id);
    }

    async add(title, description, year, genre, producer) {
        try {
            const createMovie = await Movie.create({ title, description, year });
            await createMovie.setGenre(genre);
            await createMovie.setProducer(producer);

            createMovie.save();
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

    async search(title) {
        return Movie.findAll({
            attributes: ['id', 'title', 'description', 'year'],
            where: {
                title: {
                    [Op.like]: `%${title}`
                },
            },
            order: [
                ['title', 'ASC']
            ]
        }).then((searchResult) => {
            return searchResult
        }).catch((e) => {
            console.log(e)
        })
    }

    async filterByGenre(genre) {
        return Movie.findAll({
            attributes: ['id', 'title', 'description', 'year', 'GenreId'],
            where: {
                GenreId: {
                    [Op.like]: `%${genre}`
                },
            },
        }).then((Result) => {
            return Result
        }).catch((e) => {
            console.log(e)
        })
    }

    async sortBy(name) {
        return Movie.findAll({
            attributes: ['id', 'title', 'description', 'year'],
            order: [
                [name, 'DESC'],
            ],
        });
    }


    async filterSorting(req, res, next) {
        try {
            let page = parseInt(req.query.page);
            let limit = parseInt(req.query.limit);
            let year = parseInt(req.query.year);

            const offset = page ? page * limit : 0;

            console.log("offset = " + offset);

            Movie.findAndCountAll({
                attributes: ['id', 'title', 'description', 'year'],
                where: { year: year },
                order: [
                    ['title', 'ASC'],
                    ['year', 'DESC']
                ],
                limit: limit,
                offset: offset
            }).then(data => {
                const totalPages = Math.ceil(data.count / limit);
                const response = {
                    data: {
                        "totalItems": data.count,
                        "totalPages": totalPages,
                        "limit": limit,
                        "year-filtering": year,
                        "currentPageNumber": page + 1,
                        "currentPageSize": data.rows.length,
                        "movies": data.rows
                    }
                };
                res.status(200).send(response);
            });
        } catch (error) {
            res.status(500).send({
                message: "Error -> Can NOT complete a paging request!",
                error: error.message,
            });
        }
    }


}

module.exports = new MovieController();