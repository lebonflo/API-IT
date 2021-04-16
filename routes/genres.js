const GenreController = require('../controllers').GenreController;

let express = require('express');
let router = express.Router();

router.get('/genres', GenreController.getAll);

router.get('/genre/id/:id', async (req, res, next) => {
    const genre = await GenreController.getById(req.params.id);
    if (genre === null) {
        res.status(404).json({ "error": "Genre not found" });
        return;
    }
    res.status(200).json(genre);
});

router.get('/genre/name/:name', async (req, res, next) => {
    const genreName = await GenreController.getByName(req.params.name);
    if (genreName === null) {
        res.status(404).json({ "error": "Genre not found" });
        return;
    }
    res.status(200).json(genreName);
});

module.exports = router;
