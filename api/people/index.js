import e from 'express';
import express from 'express';
import asyncHandler from 'express-async-handler';
import { getPersonPopular, getPerson, getPersonImages, getPersonCombinedCredit } from '../tmdb-api';

const router = express.Router();
let Regex = /^[1-9][0-9]*$/;

/**
 * @swagger
 * /api/people/tmdb/popular/page{page}:
 *   get:
 *    tags:
 *     - "People"
 *    summary: "Get popular people"
 *    description: "Get popular people"
 *    produces:
 *     - "application/json"
 *    parameters:
 *     - in: path
 *       name: "page"
 *       description: "Page number"
 *       required: true
 *       schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: "successful operation"
 *      404:
 *        description: "People not found"
 *    security:
 *      - api_key: [TMDBAPIKEY]
 * 
 */
router.get('/tmdb/popular/page:page', asyncHandler(async (req, res) => {
    const page = req.params.page;
    if (!Regex.test(page)) {
        res.status(404).json({message: 'The resource you requested could not be found.', status_code: 404});
    }
    else {
        const popular = await getPersonPopular(page);
        res.status(200).send(popular);
    }
    }));

/**
 * @swagger
 * /api/people/tmdb/person/{id}:
 *   get:
 *    tags:
 *     - "People"
 *    summary: "Get specific person"
 *    description: "Get specific person"
 *    produces:
 *     - "application/json"
 *    parameters:
 *     - in: path
 *       name: "id"
 *       description: "Person id number"
 *       required: true
 *       schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: "successful operation"
 *      404:
 *        description: "Person not found"
 *      500:
 *        description: "Internal server error"
 *    security:
 *      - api_key: [TMDBAPIKEY]
 * 
 */
router.get('/tmdb/person/:id', asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!Regex.test(id)) {
        res.status(404).json({message: 'The resource you requested could not be found.', status_code: 404});
    }
    else {
        const person = await getPerson(id);
        res.status(200).send(person);
    }
    }));

    /**
 * @swagger
 * /api/people/tmdb/person/{id}/images:
 *   get:
 *    tags:
 *     - "People"
 *    summary: "Get specific person images URL"
 *    description: "Get specific person images URL"
 *    produces:
 *     - "application/json"
 *    parameters:
 *     - in: path
 *       name: "id"
 *       description: "Person id number"
 *       required: true
 *       schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: "successful operation"
 *      404:
 *        description: "Person not found"
 *      500:
 *        description: "Internal server error"
 *    security:
 *      - api_key: [TMDBAPIKEY]
 * 
 */
router.get('/tmdb/person/:id/images', asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!Regex.test(id)) {
        res.status(404).json({message: 'The resource you requested could not be found.', status_code: 404});
    }
    else {
        const images = await getPersonImages(id);
        res.status(200).send(images);
    }
    }));

        /**
 * @swagger
 * /api/people/tmdb/person/{id}/combined_credits:
 *   get:
 *    tags:
 *     - "People"
 *    summary: "Get specific person combined credits"
 *    description: "Get specific person combined credits"
 *    produces:
 *     - "application/json"
 *    parameters:
 *     - in: path
 *       name: "id"
 *       description: "Person id number"
 *       required: true
 *       schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: "successful operation"
 *      404:
 *        description: "Person not found"
 *      500:
 *        description: "Internal server error"
 *    security:
 *      - api_key: [TMDBAPIKEY]
 * 
 */
router.get('/tmdb/person/:id/combined_credits', asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!Regex.test(id)) {
        res.status(404).json({message: 'The resource you requested could not be found.', status_code: 404});
    }
    else {
        const combined_credits = await getPersonCombinedCredit(id);
        res.status(200).send(combined_credits);
    }
    }));

export default router;