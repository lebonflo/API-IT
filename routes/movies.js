const MovieController = require('../controllers').MovieController;
const GenreController = require('../controllers').GenreController;
const ProducerController = require('../controllers').ProducerController;

let express = require('express');
let router = express.Router();

router.get('/movies', async (req, res, next) => {
    const sort = req.query.sort;
    let page = parseInt(req.query.page);
    const limit = 10;
    const offset = page ? page * limit : 0;
    if (offset) {
        const paginate = await MovieController.getPagination(offset);
        res.status(200).json(paginate);
    }
    else if (sort) {
        try {
            let sortMovies;
            sortMovies = await MovieController.sortBy(sort);
            res.status(200).json(sortMovies);

        } catch (e) {
            res.status(404).json({ "error": "Sort not found" })
        }

    } else {
        const movies = await MovieController.getAll();
        res.status(200).json(movies);
    }
});

router.get('/movie/id/:id', async (req, res, next) => {
    const movie = await MovieController.getById(req.params.id);
    if (movie === null) {
        res.status(404).json({ "error": "Movie not found" });
        return;
    }
    res.json(movie);
});

router.post('/movies', async (req, res, next) => {
    if (req.body.title && req.body.description && req.body.year && req.body.producerId && req.body.genreId) {

        const genre = await GenreController.getById(req.body.genreId);
        const producer = await ProducerController.getById(req.body.producerId);

        const insertedMovie = await MovieController.add(req.body.title, req.body.description, req.body.year, genre, producer);
        res.status(201).json(insertedMovie);
    } else {
        res.status(400).json({ "error": "Insertion failed" });
    }
});

router.patch('/movies/:id', async (req, res, next) => {

    if (req.body.title && req.body.description && req.body.year && req.body.producerId && req.body.genreId) {
        res.status(400).end();
        return
    }

    const genre = await GenreController.getById(req.body.genreId);
    const producer = await ProducerController.getById(req.body.producerId);

    const updatedMovie = await MovieController.update(req.params.id, req.body, genre, producer);

    if (updatedMovie[0] === 1) {
        res.json(await MovieController.getById(req.params.id));
        return
    }

    res.status(404).json({ 'error': "Movie doesn't exist" });
});

router.delete('/movies/:id', async (req, res, next) => {
    const success = await MovieController.delete(req.params.id);
    if (!success) {
        res.status(404).json({ 'error': 'Movie not found' });
        return
    }

    res.status(204).json();
});

router.get('/movies/search', async (req, res, next) => {
    const searchQuery = req.query.title;
    const searchList = await MovieController.search(searchQuery);
    if (searchList === null) {
        res.status(404).json({ "error": "Search not found" });
        return;
    }

    res.status(200).json(searchList);
});

router.get('/movies/filterByGenre', async (req, res, next) => {
    const genreQuery = req.query.genre;
    const genre = await MovieController.filterByGenre(genreQuery);
    if (genre === null) {
        res.status(404).json({ "error": "Genre not found" });
        return;
    }

    res.status(200).json(genre);
});

// router.get('/movies/filterSorting', MovieController.filterSorting);


module.exports = router;
