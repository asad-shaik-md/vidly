const auth = require('../middleware/auth')
const express = require('express');
const { Movie, validate } = require('../models/movie');
const router = express.Router();
const mongoose = require('mongoose');
const { Genre } = require('../models/genre')

router.get('/', async (req, res) => {
    const movie = await Movie.find().sort('title');
    res.send(movie)
})

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');

    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
    });
    await movie.save();

    res.send(movie);
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
    }, { new: true })

    if (!movie) return res.status(404).send('The customer with the given ID was not found.');

    res.send(movie);
});

router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id, { name: true })
    if (!movie) return res.status(404).send('The customer with the given ID was not found.');

    res.send(movie);
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id)

    if (!movie) return res.status(404).send('The customer with the given ID was not found.');

    res.send(movie);
});

module.exports = router;