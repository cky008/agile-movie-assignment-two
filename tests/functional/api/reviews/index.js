import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import Movie from "../../../../api/movies/movieModel";
import api from "../../../../index";
import movies from "../../../../seedData/movies";
import User from "../../../../api/users/userModel";
import { movieReviews } from '../../../../api/movies/moviesData'

// set up seed data for datastore
const expect = chai.expect;
let db;
let token;
let seedData = {
  movieReviews: []
}
movieReviews.results.forEach(review => seedData.movieReviews.push(review))
let reviewContent;
let username = "user1";


describe("Reviews endpoint", () => {
  before(() => {
    mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = mongoose.connection;
  });
  beforeEach(async () => {
    while (movieReviews.results.length > 0) {
      movieReviews.results.pop()
    }
    seedData.movieReviews.forEach(review => movieReviews.results.push(review))
    try {
      await Movie.deleteMany();
      await Movie.collection.insertMany(movies);
      await User.deleteMany();
      await request(api).post("/api/users?action=register").send({
        username: "user1",
        password: "test1",
      });
    } catch (err) {
      console.error(`failed to Load user Data: ${err}`);
    }
  });
  after(async () => {
    try {
      await db.dropDatabase();
    } catch (error) {
      console.log(error);
    }
  });
  afterEach(() => {
    api.close(); // Release PORT 8080
  });

  describe("GET /api/reviews/movie/:id/reviews", () => {
    before(() => {
      token = "BEARER eyJhbGciOiJIUzI1NiJ9.dXNlcjE.FmYria8wq0aFDHnzYWhKQrhF5BkJbFNN1PqNyNQ7V4M"
    })
    describe("when movie id is valid", () => {
      it("should a object contains a list of the reviews of the movie and a status 200", () => {
        return request(api)
          .get(`/api/reviews/movie/${movieReviews.id}/reviews`)
          .set("Accept", "application/json")
          .set("Authorization", token)
          .expect("Content-Type", /json/)
          .then((res) => {
            expect(res.body[0]).to.have.property("id", "603d201b33a533004bd1906e");
            expect(res.body).to.be.a("array");
          });
      });
    });
    describe("when movie id is invalid", () => {
      it("should return the NOT found message", () => {
        return request(api)
          .get(`/api/reviews/movie/a/reviews`)
          .set("Accept", "application/json")
          .set("Authorization", token)
          .expect(404)
          .expect({
            message: 'The resource you requested could not be found.',
            status_code: 404
          });
      });
      it("should return Internal Server Error", () => {
        return request(api)
          .get(`/api/reviews/movie/1212987248941/reviews`)
          .set("Accept", "application/json")
          .expect("Content-Type", "text/html; charset=utf-8")
          .expect(500)
      });
    });
  });

  describe("POST /api/reviews/movie/:id/reviews/:username", () => {
    before(() => {
      token = "BEARER eyJhbGciOiJIUzI1NiJ9.dXNlcjE.FmYria8wq0aFDHnzYWhKQrhF5BkJbFNN1PqNyNQ7V4M"
    })
    describe("when movie id is valid", () => {
      before(() => {
        reviewContent = "Nice movie."
      })
      describe("when the content is not empty", () => {
        it("should return reviews list and status code 201", () => {
          return request(api)
            .post(`/api/reviews/movie/${movieReviews.id}/reviews/${username}`)
            .send({
              content: reviewContent
            })
            .set("Accept", "application/json")
            .set("Authorization", token)
            .expect(201)
            .then((res) => {
              expect(res.body).to.have.property("author", username)
              expect(res.body).to.have.property("content", reviewContent)
            });
        });
      });
      describe("when the content is empty", () => {
        it("should return error messagea and status code 403", () => {
          return request(api)
            .post(`/api/reviews/movie/${movieReviews.id}/reviews/${username}`)
            .send({
              content: ""
            })
            .set("Accept", "application/json")
            .set("Authorization", token)
            .expect(403)
            .expect({ 
                message: 'Invalid content.', 
                status_code: 403
            });
        })
      })
    });
    describe("when movie id is invalid", () => {
      it("should return the NOT found message", () => {
        return request(api)
          .post(`/api/reviews/movie/574978974897/reviews/user1`)
          .send({
            content: "Bad movie."
          })
          .set("Accept", "application/json")
          .set("Authorization", token)
          .expect(404)
          .expect({
            message: 'The resource you requested could not be found.',
            status_code: 404
          });
      });
    });
  });
});