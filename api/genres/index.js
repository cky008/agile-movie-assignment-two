import express from 'express';
import { genres } from './genresData';
import Genre from './genreModel';
import asyncHandler from 'express-async-handler';
import { getGenres } from '../tmdb-api';

const router = express.Router(); 

router.get('/', asyncHandler(async (req, res) => {
    const genres = await Genre.find();
    res.status(200).json(genres);
}));

/**
 * @swagger
 * /api/genres/tmdb/:
 *   get:
 *    tags:
 *     - "Genres"
 *    summary: "Get all genres"
 *    description: "Get all genres"
 *    produces:
 *     - "application/json"
 *    responses:
 *      200:
 *        description: "successful operation"
 *      404:
 *        description: "Genres not found"
 *    security:
 *      - api_key: [TMDBAPIKEY]
 * 
 */
router.get('/tmdb', async (req, res) => {
    const genres = await getGenres();
    res.status(200).json(genres);
});

export default router;