const MovieController = require('../controllers').MovieController;
// const Movie = require('../models').Movie;



let express = require('express');
let router = express.Router();

router.get('/movies', async (req, res, next) => {
    res.json(await MovieController.getAll());
});

router.get('/movie', MovieController.getPagination);

router.get('/movie/:page', MovieController.getPagination);

router.get('/movie/id/:id', async (req, res, next) => {
    const movie = await MovieController.getById(req.params.id);
    if (movie === null) {
        res.status(404).json({ "error": "Movie not found" });
        return;
    }
    res.json(movie);
});


// router.get('/movies/genres/:GenreId') , async (req, res) => {
//     const genre = await Movie.query().where("GenreId", req.params.GenreId);
//     if (genre === null) {
//         res.status(404).json({ "error": "Genre not found" });
//         return;
//     }
//     res.json(genre);
// }

router.post('/movies', async (req, res, next) => {
    if (req.body.title && req.body.description && req.body.year) {
        const insertedMovie = await MovieController.add(req.body.title, req.body.description, req.body.year);
        res.status(201).json(insertedMovie);
    } else {
        res.status(400).end();
    }
});

router.patch('/movies/:id', async (req, res, next) => {

    if (!req.body.title && req.body.description && req.body.year) {
        res.status(400).end();
        return
    }

    const updatedMovie = await MovieController.update(req.params.id, req.body);

    if (updatedMovie[0] === 1) {
        res.json(await MovieController.getById(req.params.id));
        return
    }

    res.status(404).json({ 'error': "Movie doesn't exist" });
});

router.delete('/movies/:id', async (req, res, next) => {
    const success = await MovieController.delete(req.params.id);
    if (!success) {
        res.status(404).json({ 'error': 'Producer not found' });
        return
    }

    res.status(204).json();
});


module.exports = router;
