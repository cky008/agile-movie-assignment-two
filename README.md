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
database connected to movies on ac-b8zbtwm-shard-00-01.nmgcwjf.mongodb.net
      ✓ should return the 2 users and a status 200
    POST /api/users 
      For a register action
        when the payload is correct
          ✓ should return a 201 status and the confirmation message (261ms)
      For an authenticate action
        when the payload is correct
          ✓ should return a 200 status and a generated token (252ms)
    POST /api/users/:username/favourites
      when the username is valid
        when the movie is not in favourites
          ✓ should return added message and status code 201 (166ms)
        when the movie is in favourites
          ✓ return error message and status code 403 (118ms)
      when the username is invalid
        ✓ return error message and status code 500
    GET /api/users/:username/favourites
      ✓ should return user's favourite movies list and status code 200
    POST /api/users/:username/movie/:id/favourites
      when the username is valid
        when the movie is in favourites
          ✓ should return deleted movie message and status code 201 (64ms)
        when the movie is not in favourites
          ✓ return error message and status cdoe 404
      when the username is invalid
        ✓ return error message and status code 404

  Movies endpoint
    GET /api/movies 
      ✓ should return 20 movies and a status 200 (43ms)
    GET /api/movies/:id
      when the id is valid
        ✓ should return the matching movie (86ms)
      when the id is invalid
        ✓ should return the NOT found message
        ✓ should return Internal Server Error (130ms)
    GET /api/movies/tmdb/discover/page:page
      when the page is valid
        ✓ should return the matching movies form tmdb and status code 200 (98ms)
      when the page is invalid
        ✓ should return the NOT found message
    GET /api/movies/tmdb/upcoming/page:page
      when the page is valid
        ✓ should return the matching movies form tmdb and status code 200 (164ms)
      when the page is invalid
        ✓ should return the NOT found message
    GET /api/movies/tmdb/top_rated/page:page
      when the page is valid
        ✓ should return the matching movies form tmdb and status code 200 (115ms)
      when the page is invalid
        ✓ should return the NOT found message
    GET /api/movies/tmdb/movie/:id
      when the id is valid
        ✓ should return the matching movie details from tmdb and status code 200 (92ms)
      when the id is invalid
        ✓ should return the NOT found message
        ✓ should return Internal Server Error (114ms)
    GET /api/movies/tmdb/movie/:id/images
      when the id is valid
        ✓ should return the matching movie images from tmdb and status code 200 (107ms)
      when the id is invalid
        ✓ should return the NOT found message
        ✓ should return Internal Server Error (89ms)
    GET /api/movies/tmdb/movie/:id/reviews
      when the id is valid
        ✓ should return the matching movie reviews from tmdb and status code 200 (93ms)
      when the id is invalid
        ✓ should return the NOT found message
        ✓ should return Internal Server Error (98ms)
    GET /api/movies/tmdb/movie/:id/movie_credits
      when the id is valid
        ✓ should return the matching movie credits from tmdb and status code 200 (93ms)
      when the id is invalid
        ✓ should return the NOT found message
        ✓ should return Internal Server Error (109ms)

  Genres endpoint
    GET /api/genres
      ✓ should return 4 genres from db and status code 200 (41ms)
    GET /api/genres/tmdb 
      ✓ should return a list of genres from tmdb and a status 200

  People endpoint
    GET /api/people
      ✓ should return 20 people and status code 200 (68ms)
    GET /api/people/:id
      when the id is valid
        ✓ should an object of matching people and a status 200
        when the id is invalid
          ✓ should return the NOT found message
    GET /api/people/tmdb/popular/page:page
      when the page is valid
        ✓ should return the matching people list form tmdb and status code 200 (109ms)
      when the page is invalid
        ✓ should return the NOT found message
    GET /api/people/tmdb/person/:id
      when the id is valid
        ✓ should return the matching person details from tmdb and status code 200 (108ms)
      when the id is invalid
        ✓ should return the NOT found message
        ✓ should return Internal Server Error (101ms)
    GET /api/people/tmdb/person/:id/images
      when the id is valid
        ✓ should return the matching person images from tmdb and status code 200 (98ms)
      when the id is invalid
        ✓ should return the NOT found message
        ✓ should return Internal Server Error (95ms)
    GET /api/people/tmdb/person/:id/combined_credits
      when the id is valid
        ✓ should return the matching person combined credits from tmdb and status code 200 (109ms)
      when the id is invalid
        ✓ should return the NOT found message
        ✓ should return Internal Server Error (90ms)

  Reviews endpoint
    GET /api/reviews/movie/:id/reviews
      when movie id is valid
        ✓ should a object contains a list of the reviews of the movie and a status 200 (129ms)
      when movie id is invalid
        ✓ should return the NOT found message
        ✓ should return Internal Server Error (109ms)
    POST /api/reviews/movie/:id/reviews/:username
      when movie id is valid
        when the content is not empty
          ✓ should return reviews list and status code 201
        when the content is empty
          ✓ should return error messagea and status code 403
      when movie id is invalid
        ✓ should return the NOT found message


  54 passing (18s)

--------------------------|---------|----------|---------|---------|--------------------------------
File                      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s              
--------------------------|---------|----------|---------|---------|--------------------------------
All files                 |   84.73 |    77.25 |   84.43 |   85.05 |                                
 assignment2              |   97.14 |       50 |     100 |   97.14 |                                
  index.js                |   97.14 |       50 |     100 |   97.14 | 21                             
 assignment2/api          |   88.23 |    79.16 |   86.11 |   88.23 |                                
  tmdb-api.js             |   88.23 |    79.16 |   86.11 |   88.23 | 8,13,22,27,36,41,66,71,109,114 
 assignment2/api/genres   |     100 |      100 |     100 |     100 |                                
  genreModel.js           |     100 |      100 |     100 |     100 |                                
  genresData.js           |     100 |      100 |     100 |     100 |                                
  index.js                |     100 |      100 |     100 |     100 |                                
 assignment2/api/movies   |   89.17 |    87.14 |   94.87 |   83.49 |                                
  index.js                |   88.11 |    87.14 |   94.73 |   81.11 | 28,35-45,55-69                 
  movieModel.js           |     100 |      100 |     100 |     100 |                                
  moviesData.js           |     100 |      100 |     100 |     100 |                                
 assignment2/api/people   |   96.73 |    95.12 |     100 |   98.18 |                                
  index.js                |   96.47 |    95.12 |     100 |   97.95 | 16                             
  peopleModel.js          |     100 |      100 |     100 |     100 |                                
 assignment2/api/reviews  |   96.22 |    94.11 |   88.88 |   95.23 |                                
  index.js                |   97.82 |    94.11 |     100 |   97.22 | 52                             
  reviewModel.js          |   85.71 |      100 |       0 |   83.33 | 16                             
 assignment2/api/users    |   86.46 |    77.61 |   90.32 |   86.51 |                                
  index.js                |   86.11 |    78.94 |      88 |   86.15 | 84,90,104,153-161              
  userModel.js            |      88 |       70 |     100 |    87.5 | 19,30,34                       
 assignment2/authenticate |   66.66 |        0 |      25 |   73.68 |                                
  index.js                |   66.66 |        0 |      25 |   73.68 | 15-20                          
 assignment2/db           |   81.81 |      100 |   33.33 |   81.81 |                                
  index.js                |   81.81 |      100 |   33.33 |   81.81 | 11,14                          
 assignment2/seedData     |    32.3 |        5 |       0 |   40.47 |                                
  genres.js               |     100 |      100 |     100 |     100 |                                
  index.js                |   16.98 |        5 |       0 |   26.47 | 12-46,49-51                    
  movies.js               |     100 |      100 |     100 |     100 |                                
  people.js               |     100 |      100 |     100 |     100 |                                
  users.js                |     100 |      100 |     100 |     100 |                                
--------------------------|---------|----------|---------|---------|--------------------------------
~~~

## Independent Learning (if relevant)

### Code coverage report and Coveralls web service:    
+ [![Coverage Status](https://coveralls.io/repos/gitlab/kaiyuchen1/agile-movie-assignment-two/badge.svg?branch=main)](https://coveralls.io/gitlab/kaiyuchen1/agile-movie-assignment-two?branch=main) 
+ [https://coveralls.io/gitlab/kaiyuchen1/agile-movie-assignment-two?branch=main](https://coveralls.io/gitlab/kaiyuchen1/agile-movie-assignment-two?branch=main)  

### Swagger Web APIs Document:  
+ [https://agile-ca2-cky-production.herokuapp.com/api-docs/](https://agile-ca2-cky-production.herokuapp.com/api-docs/)  

## Other related links  
+ Gitlab: [https://gitlab.com/kaiyuchen1/agile-movie-assignment-two](https://gitlab.com/kaiyuchen1/agile-movie-assignment-two)  
+ Github: [https://github.com/cky008/agile-movie-assignment-two](https://github.com/cky008/agile-movie-assignment-two)  
+ HEROKU Staging App: [https://agile-ca2-cky-staging.herokuapp.com/](https://agile-ca2-cky-staging.herokuapp.com/)  
+ HEROKU Production App: [https://agile-ca2-cky-production.herokuapp.com/](https://agile-ca2-cky-production.herokuapp.com/)  
+ Coverall: [https://coveralls.io/gitlab/kaiyuchen1/agile-movie-assignment-two?branch=main](https://coveralls.io/gitlab/kaiyuchen1/agile-movie-assignment-two?branch=main)  
+ Swagger API document: [https://agile-ca2-cky-production.herokuapp.com/api-docs/](https://agile-ca2-cky-production.herokuapp.com/api-docs/)  

### Video Demo of movies-api:
+ [Youtube](https://youtu.be/-3QqqaLmjcQ)  
+ [bilibili](https://www.bilibili.com/video/BV1qG4y117Up/)  
+ [oneDrive](https://1574666-my.sharepoint.com/:v:/g/personal/fa2nica_1574666_onmicrosoft_com/EdoR3pCrhOVHkouzyhGHHQgBwDRRb2XvsbLWwJLUE60lDw?e=SdPISy)  
