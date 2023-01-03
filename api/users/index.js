import express from 'express';
import User from './userModel';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import movieModel from '../movies/movieModel';



const router = express.Router(); // eslint-disable-line

// Get all users
/**
 * @swagger
 * /api/users/:
 *   get:
 *    tags:
 *     - "Users"
 *    summary: "get all users"
 *    description: "get all users"
 *    produces:
 *     - "application/json"
 *    responses:
 *      200:
 *        description: "successful operation"
 *      404:
 *        description: "Unable to get users"
 *      500:
 *        description: "Internal server error"
 *    security:
 *      - api_key: [TMDBAPIKEY]
 * 
 */
    router.get('/', async (req, res) => {
        const users = await User.find();
        res.status(200).json(users);
    });

  // register(Create)/Authenticate User
  /**
 * @swagger
 * /api/users/:
 *   post:
 *    tags:
 *     - "Users"
 *    summary: "register(Create)/Authenticate User"
 *    description: "register(Create)/Authenticate User"
 *    produces:
 *     - "application/json"
 *    parameters:
 *     - in: body
 *       name: user info
 *       description: The username and password.
 *       schema:
 *         type: object
 *         required:
 *           - username
 *           - password
 *         properties:
 *           username:
 *             type: string
 *           password:
 *             type: string
 *     - in: query
 *       name: action
 *       description: "register or authenticate"
 *       type: string
 *    responses:
 *      201:
 *        description: "User created"
 *      200:
 *        description: "User authenticated"
 *      401:
 *        description: "Unable to authenticate"
 *      404:
 *        description: "Unable to reach resource"
 *      500:
 *        description: "Internal server error"
 *    security:
 *      - api_key: [TMDBAPIKEY]
 * 
 */
  router.post('/',asyncHandler( async (req, res, next) => {
    if (!req.body.username || !req.body.password) {
      res.status(401).json({success: false, msg: 'Please pass username and password.'});
      return next();
    }
    if (req.query.action === 'register') {
      const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/
        if (!reg.test(req.body.password)) {
            res.status(401).json({code: 401, success: false, msg: 'Password must be at least 5 characters long and contain at least one letter and one number.'});
        }
      await User.create(req.body);
      res.status(201).json({code: 201, msg: 'Successful created new user.'});
    } else {
      const user = await User.findByUserName(req.body.username);
        if (!user) return res.status(401).json({ code: 401, msg: 'Authentication failed. User not found.' });
        user.comparePassword(req.body.password, (err, isMatch) => {
          if (isMatch && !err) {
            // if user is found and password matches, create a token
            const token = jwt.sign(user.username, process.env.SECRET);
            // return the information including token as JSON
            res.status(200).json({success: true, token: 'BEARER ' + token});
          } else {
            res.status(401).json({code: 401,msg: 'Authentication failed. Wrong password.'});
          }
        });
      }
  }));

  // Update a user
    /**
 * @swagger
 * /api/users/{id}:
 *   put:
 *    tags:
 *     - "Users"
 *    summary: "Update a user"
 *    description: "Update a user"
 *    produces:
 *     - "application/json"
 *    parameters:
 *     - in: path
 *       name: "id"
 *       description: "User id number"
 *       required: true
 *       schema:
 *          type: integer
 *     - in: body
 *       name: user info
 *       description: The username and password.
 *       schema:
 *         type: object
 *         required:
 *           - username
 *           - password
 *         properties:
 *           username:
 *             type: string
 *           password:
 *             type: string
 *    responses:
 *      200:
 *        description: "User updated"
 *      404:
 *        description: "Unable to update user"
 *      500:
 *        description: "Internal server error"
 *    security:
 *      - api_key: [TMDBAPIKEY]
 * 
 */
  router.put('/:id', async (req, res) => {
    if (req.body._id) delete req.body._id;
    const result = await User.updateOne({
        _id: req.params.id,
    }, req.body);
    if (result.matchedCount) {
        res.status(200).json({ code:200, msg: 'User Updated Sucessfully' });
    } else {
        res.status(404).json({ code: 404, msg: 'Unable to Update User' });
    }
    });

//Add a favourite. 
/**
 * @swagger
 * /api/users/{userName}/favourites:
 *   post:
 *    tags:
 *     - "Users"
 *    summary: "Add a favourite"
 *    description: "Add a favourite"
 *    produces:
 *     - "application/json"
 *    parameters:
 *     - in: path
 *       name: "userName"
 *       description: "userName"
 *       required: true
 *       schema:
 *          type: string
 *     - in: body
 *       name: movie id
 *       description: The movie id.
 *       schema:
 *         type: object
 *         required:
 *           - id
 *         properties:
 *           id:
 *             type: integer
 *    responses:
 *      201:
 *        description: "Movie added to favourites"
 *      404:
 *        description: "Unable to post favourite"
 *      500:
 *        description: "Internal server error"
 *    security:
 *      - api_key: [TMDBAPIKEY]
 * 
 */
router.post('/:userName/favourites', asyncHandler(async (req, res) => {
    const newFavourite = req.body.id;
    const userName = req.params.userName;
    const movie = await movieModel.findByMovieDBId(newFavourite);
    const user = await User.findByUserName(userName);
    if (user.favourites.includes(movie.id)) {
      res.status(201).json({code: 201, msg: 'Already exists in favourites.'})
  } else {
    await user.favourites.push(movie.id);
    await user.save(); 
    res.status(201).json(user); 
  }
  }));

  /**
 * @swagger
 * /api/users/{userName}/favourites:
 *   get:
 *    tags:
 *     - "Users"
 *    summary: "get a user's favourites"
 *    description: "get a user's favourites"
 *    produces:
 *     - "application/json"
 *    parameters:
 *     - in: path
 *       name: "userName"
 *       description: "userName"
 *       required: true
 *       schema:
 *          type: string
 *    responses:
 *      200:
 *        description: "Favourite movies returned"
 *      404:
 *        description: "Unable to get favourites"
 *      500:
 *        description: "Internal server error"
 *    security:
 *      - api_key: [TMDBAPIKEY]
 * 
 */
  router.get('/:userName/favourites', asyncHandler( async (req, res) => {
    const userName = req.params.userName;
    const user = await User.findByUserName(userName);
    res.status(200).json(user.favourites);
  }));

  //Delete a favourite
    /**
 * @swagger
 * /api/users/{userName}/movie/{id}/favourites:
 *   post:
 *    tags:
 *     - "Users"
 *    summary: "delete a user's one favourite movie"
 *    description: "delete a user's one favourite movie"
 *    produces:
 *     - "application/json"
 *    parameters:
 *     - in: path
 *       name: "userName"
 *       description: "user name"
 *       required: true
 *       schema:
 *          type: string
 *     - in: path
 *       name: "id"
 *       description: "movie id number"
 *       required: true
 *       schema:
 *          type: integer
 *    responses:
 *      201:
 *        description: "Favourite movies deleted"
 *      404:
 *        description: "Unable to delete favourites"
 *      500:
 *        description: "Internal server error"
 *    security:
 *      - api_key: [TMDBAPIKEY]
 * 
 */
router.post('/:username/movie/:id/favourites', asyncHandler(async (req, res) => {
  const newFavourite = req.params.id;
  const userName = req.params.username;
  const user = await User.findByUserName(userName);
  const index = user.favourites.indexOf(newFavourite)
  await user.favourites.splice(index, 1);
  await user.save(); 
  return res.status(201).json(user); 
}));
export default router;