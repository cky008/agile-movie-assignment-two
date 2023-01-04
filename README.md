# Assignment 2 - Agile Software Practice.

Name: Kaiyu Chen

## API endpoints.

When this movies-api server is running, you can visit this api server's document by visiting [swagger](https://agile-ca2-cky-production.herokuapp.com/api-docs/).

### [Movies](/api/movies/index.js)  
+ /api/movies | GET | Gets a list of movies from loacl.  
+ /api/movies/:id | GET | Gets a single movie's detail from loacl for the movie details page.  
+ /api/movies/:id/reviews | GET | Gets a single movie's reviews from loacl for the movie details page.  
+ /api/movies/tmdb/discover/page:page | GET | Gets a list of movies for the home page.  
+ /api/movies/tmdb/upcoming/page:page | GET | Gets a list of movies for the upcoming movie page.  
+ /api/movies/tmdb/top_rated/page:page | GET | Gets a list of movies for the top rated movie page.  
+ /api/movies/tmdb/movie/:id | GET | Gets a single movie's detail for the movie details page.  
+ /api/movies/tmdb/movie/:id/images | GET | Gets a single movie's images.  
+ /api/movies/tmdb/movie/:id/reviews | GET | Gets a single movie's reviews.  
+ /api/movies/tmdb/movie/:id/movie_credits | GET | Gets a single movie's credits.  

### [People](/api/people/index.js)  
+ /api/people/ | GET | Gets popular people from loacl for popular people page.  
+ /api/people/:id | GET | Gets a single person's detail from loacl for the person details page.  
+ /api/people/tmdb/popular/page:page | GET | Gets popular people for popular people page.  
+ /api/people/tmdb/person/:id | GET | Gets a single person's detail for the person details page.  
+ /api/people/tmdb/person/:id/images | GET | Gets a single person's images.  
+ /api/people/tmdb/person/:id/combined_credits | GET | Gets a single person's combined credits.  

### [Genres](/api/genres/index.js)    
+ /api/genres/ | GET | Gets all genres.  

### [Reviews](/api/reviews/index.js)    
All need Authentication.  
+ /api/reviews/movie/:id/reviews | GET | Gets a single movie's reviews both from TMDB and MONGODB.  
+ /api/reviews/movie/:id/reviews/:username | POST | Posts or updates a review from the logged in user for a single movie.  

### [Users](/api/users/index.js)  
+ /api/users/ | GET | Gets all users.  
+ /api/users/ | POST | Registers/Authenticates a user. The body should include username and password.  
+ /api/users/:id | Put | Updates a single user's information.  
+ /api/users/:userName/favourites | POST | Add a single movie to a single user's favourites. The body should include the movie's id.
+ /api/users/:userName/favourites | GET | Gets a single user's all favourite movies.  
+ /api/users/:username/movie/:id/favourites | POST | Delete a speicfic movie from a single user's all favourite movies.

## Test cases.


~~~
  Users endpoint
    GET /api/users 
database connected to movies on ac-b8zbtwm-shard-00-00.nmgcwjf.mongodb.net
      ✓ should return the 2 users and a status 200 (106ms)
    POST /api/users 
      For a register action
        when the payload is correct
          ✓ should return a 201 status and the confirmation message (387ms)
      For an authenticate action
        when the payload is correct
          ✓ should return a 200 status and a generated token (390ms)
    POST /api/users/:username/favourites
      when the username is valid
        when the movie is not in favourites
          ✓ should return added message and status code 201 (272ms)
        when the movie is in favourites
          ✓ return error message and status code 403 (166ms)
      when the username is invalid
        ✓ return error message and status code 500 (104ms)
    GET /api/users/:username/favourites
      ✓ should return user's favourite movies list and status code 200 (106ms)
    POST /api/users/:username/movie/:id/favourites
      when the username is valid
        when the movie is in favourites
          ✓ should return deleted movie message and status code 201 (216ms)
        when the movie is not in favourites
          ✓ return error message and status cdoe 404 (114ms)
      when the username is invalid
        ✓ return error message and status code 404
  Movies endpoint
    GET /api/movies 
      ✓ should return 20 movies and a status 200 (113ms)
    GET /api/movies/:id
      when the id is valid
        ✓ should return the matching movie (69ms)
      when the id is invalid
        ✓ should return the NOT found message
        ✓ should return Internal Server Error (68ms)
    GET /api/movies/tmdb/discover/page:page
      when the page is valid
        ✓ should return the matching movies form tmdb and status code 200 (67ms)
      when the page is invalid
        ✓ should return the NOT found message
    GET /api/movies/tmdb/upcoming/page:page
      when the page is valid
        ✓ should return the matching movies form tmdb and status code 200 (99ms)
      when the page is invalid
        ✓ should return the NOT found message
    GET /api/movies/tmdb/top_rated/page:page
      when the page is valid
        ✓ should return the matching movies form tmdb and status code 200 (68ms)
      when the page is invalid
        ✓ should return the NOT found message
    GET /api/movies/tmdb/movie/:id
      when the id is valid
        ✓ should return the matching movie details from tmdb and status code 200 (68ms)
      when the id is invalid
        ✓ should return the NOT found message
        ✓ should return Internal Server Error (68ms)
    GET /api/movies/tmdb/movie/:id/images
      when the id is valid
        ✓ should return the matching movie images from tmdb and status code 200 (67ms)
      when the id is invalid
        ✓ should return the NOT found message
        ✓ should return Internal Server Error (70ms)
    GET /api/movies/tmdb/movie/:id/reviews
      when the id is valid
        ✓ should return the matching movie reviews from tmdb and status code 200 (68ms)
      when the id is invalid
        ✓ should return the NOT found message
        ✓ should return Internal Server Error (68ms)
    GET /api/movies/tmdb/movie/:id/movie_credits
      when the id is valid
        ✓ should return the matching movie credits from tmdb and status code 200 (71ms)
      when the id is invalid
        ✓ should return the NOT found message
        ✓ should return Internal Server Error (70ms)
  Genres endpoint
    GET /api/genres
      ✓ should return 4 genres from db and status code 200 (102ms)
    GET /api/genres/tmdb 
      ✓ should return a list of genres from tmdb and a status 200
  People endpoint
    GET /api/people
      ✓ should return 20 people and status code 200 (223ms)
    GET /api/people/:id
      when the id is valid
        ✓ should an object of matching people and a status 200 (103ms)
        when the id is invalid
          ✓ should return the NOT found message (101ms)
    GET /api/people/tmdb/popular/page:page
      when the page is valid
        ✓ should return the matching people list form tmdb and status code 200 (70ms)
      when the page is invalid
        ✓ should return the NOT found message
    GET /api/people/tmdb/person/:id
      when the id is valid
        ✓ should return the matching person details from tmdb and status code 200 (68ms)
      when the id is invalid
        ✓ should return the NOT found message
        ✓ should return Internal Server Error (66ms)
    GET /api/people/tmdb/person/:id/images
      when the id is valid
        ✓ should return the matching person images from tmdb and status code 200 (73ms)
      when the id is invalid
        ✓ should return the NOT found message
        ✓ should return Internal Server Error (67ms)
    GET /api/people/tmdb/person/:id/combined_credits
      when the id is valid
        ✓ should return the matching person combined credits from tmdb and status code 200 (70ms)
      when the id is invalid
        ✓ should return the NOT found message
        ✓ should return Internal Server Error (66ms)
  Reviews endpoint
    GET /api/reviews/movie/:id/reviews
      when movie id is valid
        ✓ should a object contains a list of the reviews of the movie and a status 200 (172ms)
      when movie id is invalid
        ✓ should return the NOT found message
        ✓ should return Internal Server Error (166ms)
    POST /api/reviews/movie/:id/reviews/:username
      when movie id is valid
        when the content is not empty
          ✓ should return reviews list and status code 201
        when the content is empty
          ✓ should return error messagea and status code 403
      when movie id is invalid
        ✓ should return the NOT found message
  54 passing (32s)  
  
~~~

## Independent Learning (if relevant)

### Code coverage report and Coveralls web service:    
+ [![Coverage Status](https://coveralls.io/repos/gitlab/kaiyuchen1/agile-movie-assignment-two/badge.svg?branch=develop)](https://coveralls.io/gitlab/kaiyuchen1/agile-movie-assignment-two?branch=develop)  
+ [https://coveralls.io/gitlab/kaiyuchen1/agile-movie-assignment-two](https://coveralls.io/gitlab/kaiyuchen1/agile-movie-assignment-two)  

### Swagger Web APIs Document:  
+ [https://agile-ca2-cky-production.herokuapp.com/api-docs/](https://agile-ca2-cky-production.herokuapp.com/api-docs/)  

## Other related links  
+ Gitlab: [https://gitlab.com/kaiyuchen1/agile-movie-assignment-two](https://gitlab.com/kaiyuchen1/agile-movie-assignment-two)  
+ Github: [https://github.com/cky008/agile-movie-assignment-two](https://github.com/cky008/agile-movie-assignment-two)  
+ HEROKU Staging App: [https://agile-ca2-cky-staging.herokuapp.com/](https://agile-ca2-cky-staging.herokuapp.com/)  
+ HEROKU Production App: [https://agile-ca2-cky-production.herokuapp.com/](https://agile-ca2-cky-production.herokuapp.com/)  
+ Coverall: [https://coveralls.io/gitlab/kaiyuchen1/agile-movie-assignment-two?branch=develo](https://coveralls.io/gitlab/kaiyuchen1/agile-movie-assignment-two?branch=develo)  
+ Swagger API document: [https://agile-ca2-cky-production.herokuapp.com/api-docs/](https://agile-ca2-cky-production.herokuapp.com/api-docs/)  

### Video Demo of movies-api:
+ [Youtube](https://youtu.be/-3QqqaLmjcQ)  
+ [bilibili](https://www.bilibili.com/video/BV1qG4y117Up/)  
+ [oneDrive](https://1574666-my.sharepoint.com/:v:/g/personal/fa2nica_1574666_onmicrosoft_com/EdoR3pCrhOVHkouzyhGHHQgBwDRRb2XvsbLWwJLUE60lDw?e=SdPISy)  
