const express = require("express");
const { getMovies, createMovie, getSingleMovie, updateMovie } = require('../controllers/movie');

const router = express.Router();

router.get("/", getMovies);

router.post("/", createMovie);

router.get('/:id', getSingleMovie)

router.patch('/:id', updateMovie);

module.exports = router;