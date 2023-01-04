import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import Movie from "../../../../api/movies/movieModel";
import api from "../../../../index";
import movies from "../../../../seedData/movies";

const expect = chai.expect;
let db;
let page;

describe("Movies endpoint", () => {
  before(() => {
    mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = mongoose.connection;
  });

  after(async () => {
    try {
      await db.dropDatabase();
    } catch (error) {
      console.log(error);
    }
  });

  beforeEach(async () => {
    try {
      await Movie.deleteMany();
      await Movie.collection.insertMany(movies);
    } catch (err) {
      console.error(`failed to Load user Data: ${err}`);
    }
  });
  afterEach(() => {
    api.close(); // Release PORT 8080
  });
  describe("GET /api/movies ", () => {
    it("should return 20 movies and a status 200", (done) => {
      request(api)
        .get("/api/movies")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.a("array");
          expect(res.body.length).to.equal(20);
          done();
        });
    });
  });

  describe("GET /api/movies/:id", () => {
    describe("when the id is valid", () => {
      it("should return the matching movie", () => {
        return request(api)
          .get(`/api/movies/${movies[0].id}`)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.have.property("title", movies[0].title);
          });
      });
    });
    describe("when the id is invalid", () => {
      it("should return the NOT found message", () => {
        return request(api)
          .get("/api/movies/a")
          .set("Accept", "application/json")
          .expect(404)
          .expect({
            status_code: 404,
            message: "The resource you requested could not be found.",
          });
      });
      it("should return Internal Server Error", () => {
        return request(api)
          .get("/api/movies/999")
          .set("Accept", "application/json")
          .expect(500)
      });
    });
  });

  //my api test
  describe("GET /api/movies/tmdb/discover/page:page", () => {
    describe("when the page is valid", () => {
        before(() => {
          page = 1;
        });
        it("should return the matching movies form tmdb and status code 200", () => {
        return request(api)
          .get(`/api/movies/tmdb/discover/page${page}`)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.have.property("page", page);
            expect(res.body.results).to.be.a("array");
            expect(res.body.results.length).to.equal(20);
          });
      });
    });
    describe("when the page is invalid", () => {
        before(() => {
          page = 0;
        });
      it("should return the NOT found message", () => {
        return request(api)
          .get(`/api/movies/tmdb/discover/page${page}`)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(404)
          .expect({
            status_code: 404,
            message: "The resource you requested could not be found.",
          });
      });
    });
  });

  describe("GET /api/movies/tmdb/upcoming/page:page", () => {
    describe("when the page is valid", () => {
        before(() => {
          page = 1;
        });
        it("should return the matching movies form tmdb and status code 200", () => {
        return request(api)
          .get(`/api/movies/tmdb/upcoming/page${page}`)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.have.property("page", page);
            expect(res.body.results).to.be.a("array");
            expect(res.body.results.length).to.equal(20);
          });
      });
    });
    describe("when the page is invalid", () => {
        before(() => {
          page = 0;
        });
      it("should return the NOT found message", () => {
        return request(api)
          .get(`/api/movies/tmdb/upcoming/page${page}`)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(404)
          .expect({
            status_code: 404,
            message: "The resource you requested could not be found.",
          });
      });
    });
  });

  describe("GET /api/movies/tmdb/top_rated/page:page", () => {
    describe("when the page is valid", () => {
        before(() => {
          page = 1;
        });
        it("should return the matching movies form tmdb and status code 200", () => {
        return request(api)
          .get(`/api/movies/tmdb/top_rated/page${page}`)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.have.property("page", page);
            expect(res.body.results).to.be.a("array");
            expect(res.body.results.length).to.equal(20);
          });
      });
    });
    describe("when the page is invalid", () => {
        before(() => {
          page = 0;
        });
      it("should return the NOT found message", () => {
        return request(api)
          .get(`/api/movies/tmdb/top_rated/page${page}`)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(404)
          .expect({
            status_code: 404,
            message: "The resource you requested could not be found.",
          });
      });
    });
  });

  describe("GET /api/movies/tmdb/movie/:id", () => {
    describe("when the id is valid", () => {
      it("should return the matching movie details from tmdb and status code 200", () => {
        return request(api)
          .get(`/api/movies/tmdb/movie/${movies[0].id}`)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.have.property("id", movies[0].id);
            expect(res.body).to.have.property("title", movies[0].title);
          });
      });
    });
    describe("when the id is invalid", () => {
      it("should return the NOT found message", () => {
        return request(api)
          .get("/api/movies/tmdb/movie/a")
          .set("Accept", "application/json")
          .expect(404)
          .expect({
            status_code: 404,
            message: "The resource you requested could not be found.",
          });
        });
      it("should return Internal Server Error", () => {
        return request(api)
          .get("/api/movies/tmdb/movie/1")
          .set("Accept", "application/json")
          .expect(500)
      });
    });
  });

  describe("GET /api/movies/tmdb/movie/:id/images", () => {
    describe("when the id is valid", () => {
      it("should return the matching movie images from tmdb and status code 200", () => {
        return request(api)
          .get(`/api/movies/tmdb/movie/${movies[0].id}/images`)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.have.property("id", movies[0].id);
            expect(res.body).to.have.property("backdrops");
            expect(res.body).to.have.property("posters");
          });
      });
    });
    describe("when the id is invalid", () => {
      it("should return the NOT found message", () => {
        return request(api)
          .get("/api/movies/tmdb/movie/a/images")
          .set("Accept", "application/json")
          .expect(404)
          .expect({
            status_code: 404,
            message: "The resource you requested could not be found.",
          });
        });
      it("should return Internal Server Error", () => {
        return request(api)
          .get("/api/movies/tmdb/movie/1/images")
          .set("Accept", "application/json")
          .expect(500)
      });
    });
  });

  describe("GET /api/movies/tmdb/movie/:id/reviews", () => {
    describe("when the id is valid", () => {
      it("should return the matching movie reviews from tmdb and status code 200", () => {
        return request(api)
          .get(`/api/movies/tmdb/movie/${movies[0].id}/reviews`)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.have.property("id", movies[0].id);
            expect(res.body.results).to.be.a("array");
            expect(res.body.page).to.be.a("number");
          });
      });
    });
    describe("when the id is invalid", () => {
      it("should return the NOT found message", () => {
        return request(api)
          .get("/api/movies/tmdb/movie/a/reviews")
          .set("Accept", "application/json")
          .expect(404)
          .expect({
            status_code: 404,
            message: "The resource you requested could not be found.",
          });
        });
      it("should return Internal Server Error", () => {
        return request(api)
          .get("/api/movies/tmdb/movie/1/reviews")
          .set("Accept", "application/json")
          .expect(500)
      });
    });
  });

  describe("GET /api/movies/tmdb/movie/:id/movie_credits", () => {
    describe("when the id is valid", () => {
      it("should return the matching movie credits from tmdb and status code 200", () => {
        return request(api)
          .get(`/api/movies/tmdb/movie/${movies[0].id}/movie_credits`)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.have.property("id", movies[0].id);
            expect(res.body.cast).to.be.a("array");
          });
      });
    });
    describe("when the id is invalid", () => {
      it("should return the NOT found message", () => {
        return request(api)
          .get("/api/movies/tmdb/movie/a/movie_credits")
          .set("Accept", "application/json")
          .expect(404)
          .expect({
            status_code: 404,
            message: "The resource you requested could not be found.",
          });
        });
      it("should return Internal Server Error", () => {
        return request(api)
          .get("/api/movies/tmdb/movie/1/movie_credits")
          .set("Accept", "application/json")
          .expect(500)
      });
    });
  });

});
