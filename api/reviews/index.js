import express from 'express';
import asyncHandler from 'express-async-handler';
import Review from './reviewModel'
import { getMovieReviews } from '../tmdb-api';

const router = express.Router(); 
let Regex = /^[1-9][0-9]*$/;

// Get movie reviews
/**
 * @swagger
 * /api/reviews/movie/{id}/reviews:
 *   get:
 *    tags:
 *     - "Reviews"
 *    summary: "get a movie reviews"
 *    description: "get a movie reviews"
 *    produces:
 *     - "application/json"
 *    parameters:
 *     - in: path
 *       name: "id"
 *       description: "Movie id number"
 *       required: true
 *       schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: "successful operation"
 *      404:
 *        description: "Unable to get reviews"
 *      500:
 *        description: "Internal server error"
 *    security:
 *      - api_key: [TMDBAPIKEY]
 * 
 */
router.get('/movie/:id/reviews', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    if (!Regex.test(id)) {
        res.status(404).json({message: 'The resource you requested could not be found.', status_code: 404});
    }
    else {
        const movieReviews = await Review.find({movieId: id});
        const movieReviewsFromTmdb = await getMovieReviews(id);
        const movieReviewsCombined = movieReviews.concat(movieReviewsFromTmdb.results);
        if(id){
            res.status(200).json(movieReviewsCombined); 
        } else {
            res.status(404).json({
                message: 'The resource you requested could not be found.',
                status_code: 404
         });
        }
    }
}));

//Post a movie review
/**
 * @swagger
 * /api/reviews/movie/{id}/reviews/{username}:
 *   post:
 *    tags:
 *     - "Reviews"
 *    summary: "post a movie review"
 *    description: "post a movie review"
 *    produces:
 *     - "application/json"
 *    parameters:
 *     - in: path
 *       name: "id"
 *       description: "Movie id number"
 *       required: true
 *       schema:
 *          type: integer
 *     - in: path
 *       name: "username"
 *       description: "Username"
 *       required: true
 *       schema:
 *          type: string
 *     - in: body
 *       name: review
 *       description: The review to post.
 *       schema:
 *         type: object
 *         required:
 *           - content
 *           - rating
 *         properties:
 *           content:
 *             type: string
 *           rating:
 *             type: integer
 *    responses:
 *      201:
 *        description: "Review posted"
 *      200:
 *        description: "Review updated"
 *      404:
 *        description: "Unable to post review or update review or movie not found"
 *      500:
 *        description: "Internal server error"
 *    security:
 *      - api_key: [TMDBAPIKEY]
 * 
 */
router.post('/movie/:id/reviews/:username', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const userName = req.params.username;
    const movieReviews = await Review.find({author: userName, movieId: id});
    if (movieReviews.length === 0 || movieReviews === null){
        req.body.id = new Date();
        req.body.author = userName;
        req.body.created_at = new Date();
        req.body.updated_at = new Date();
        Review.create(req.body);
        res.status(201).json(req.body);
    }
    else if (movieReviews.length > 0) {
        req.body.updated_at = new Date();
        const result = await Review.updateOne({
            movieId: req.params.id,
        }, req.body);
        if (result.matchedCount) {
            res.status(200).json({ code: 200, msg: 'Review Updated Sucessfully' });
        } else {
            res.status(404).json({ code: 404, msg: 'Unable to Update Review' });
        }
    } else {
        res.status(404).json({
            message: 'The resource you requested could not be found.',
            status_code: 404
        });
    }
}));
export default router;