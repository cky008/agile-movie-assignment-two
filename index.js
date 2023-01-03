import dotenv from 'dotenv';
import express from 'express';
import moviesRouter from './api/movies';
import genresRouter from './api/genres';
import peopleRouter from './api/people';
import reviewsRouter from './api/reviews';
import './db';
import './seedData'
import usersRouter from './api/users';
import session from 'express-session';
import passport from './authenticate';


dotenv.config();


const errHandler = (err, req, res, next) => {
  /* if the error in development then send stack trace to display whole error,
  if it's in production then just send error message  */
  if(process.env.NODE_ENV === 'production') {
    return res.status(500).send(`Something went wrong!`);
  }
  res.status(500).send(`Hey!! You caught the error 👍👍. Here's the details: ${err.stack} `);
};

const app = express();

const port = process.env.PORT;

const swaggerJsDoc = require('swagger-jsdoc');

const swaggerUi = require('swagger-ui-express');
app.use(express.json());

app.use(passport.initialize());

// app.use('/api/movies', passport.authenticate('jwt', {session: false}), moviesRouter);

app.use('/api/movies', moviesRouter);

app.use('/api/genres', genresRouter);

app.use('/api/people', peopleRouter);

app.use('/api/users', usersRouter);

app.use('/api/reviews', reviewsRouter);

app.use(errHandler);

var path = require('path');
const swaggerOpt = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Movies API',
        version: '1.0.0',
        description: 'A simple Express Movies API, backend for a movie review website application',
        contact: {
          name: 'Movies API Support',
          url: 'https://www.youtube.com/channel/UCEKKxXCBsG3wbZTTmuAsdVg',
          email: 'greatcky83@gmail.com',
        },
        servers: [
          { 
            url: 'http://localhost:8080',
            description: 'Development server',
          },
        ],
    }
  },
  apis:['./api/movies/index.js',
   './api/genres/index.js',
    './api/people/index.js',
     './api/users/index.js',
      './api/reviews/index.js']
};
const swaggerSpec = swaggerJsDoc(swaggerOpt);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  console.info(`Server running at ${port}`);
});