import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import Person from "../../../../api/people/peopleModel";
import api from "../../../../index";
import people from "../../../../seedData/people";

// set up seed data for datastore
const expect = chai.expect;
let db;
let page;
let personId;
let personName;

describe("People endpoint", () => {
  before(() => {
    mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = mongoose.connection;
  });
  beforeEach(async () => {
    try {
      await Person.deleteMany();
      await Person.collection.insertMany(people);
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

  describe("GET /api/people", () => {
    it("should return 20 people and status code 200", (done) => {
    request(api)
      .get(`/api/people`)
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

  describe("GET /api/people/:id", () => {
    describe("when the id is valid", () => {
    it("should an object of matching people and a status 200", (done) => {
      request(api)
        .get(`/api/people/${people[0].id}`)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property("name", people[0].name);
          done();
        });
    });
    describe("when the id is invalid", () => {
    it("should return the NOT found message", () => {
      return request(api)
        .get(`/api/people/1`)
        .expect("Content-Type", /json/)
        .expect(404)
        .expect({ message: 'The resource you requested could not be found.', status_code: 404 })
        });
      });
    });
  });

  describe("GET /api/people/tmdb/popular/page:page", () => {
    describe("when the page is valid", () => {
        before(() => {
          page = 1;
        });
        it("should return the matching people list form tmdb and status code 200", () => {
        return request(api)
          .get(`/api/people/tmdb/popular/page${page}`)
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

  describe("GET /api/people/tmdb/person/:id", () => {
    describe("when the id is valid", () => {
      before(() => {
        personId = 19587, personName = "Rumi Hiiragi";
      })
      it("should return the matching person details from tmdb and status code 200", () => {
        return request(api)
          .get(`/api/people/tmdb/person/${personId}`)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.have.property("id", personId);
            expect(res.body).to.have.property("name", personName);
          });
      });
    });
    describe("when the id is invalid", () => {
      it("should return the NOT found message", () => {
        return request(api)
          .get("/api/people/tmdb/person/a")
          .set("Accept", "application/json")
          .expect(404)
          .expect({
            status_code: 404,
            message: "The resource you requested could not be found.",
          });
        });
      it("should return Internal Server Error", () => {
        return request(api)
          .get("/api/people/tmdb/person/1145148")
          .set("Accept", "application/json")
          .expect(500)
      });
    });
  });

  describe("GET /api/people/tmdb/person/:id/images", () => {
    describe("when the id is valid", () => {
      before(() => {
        personId = 19587
      })
      it("should return the matching person images from tmdb and status code 200", () => {
        return request(api)
          .get(`/api/people/tmdb/person/${personId}/images`)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.have.property("id", personId);
            expect(res.body).to.have.property("profiles");
          });
      });
    });
    describe("when the id is invalid", () => {
      it("should return the NOT found message", () => {
        return request(api)
          .get("/api/people/tmdb/person/a/images")
          .set("Accept", "application/json")
          .expect(404)
          .expect({
            status_code: 404,
            message: "The resource you requested could not be found.",
          });
        });
      it("should return Internal Server Error", () => {
        return request(api)
          .get("/api/people/tmdb/person/1145148/images")
          .set("Accept", "application/json")
          .expect(500)
      });
    });
  });

  describe("GET /api/people/tmdb/person/:id/combined_credits", () => {
    describe("when the id is valid", () => {
      before(() => {
        personId = 19587
      })
      it("should return the matching person combined credits from tmdb and status code 200", () => {
        return request(api)
          .get(`/api/people/tmdb/person/${personId}/combined_credits`)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.have.property("id", personId);
            expect(res.body.cast).to.be.a("array");
            expect(res.body.crew).to.be.a("array");
          });
      });
    });
    describe("when the id is invalid", () => {
      it("should return the NOT found message", () => {
        return request(api)
          .get("/api/people/tmdb/person/a/combined_credits")
          .set("Accept", "application/json")
          .expect(404)
          .expect({
            status_code: 404,
            message: "The resource you requested could not be found.",
          });
        });
      it("should return Internal Server Error", () => {
        return request(api)
          .get("/api/people/tmdb/person/1145148/combined_credits")
          .set("Accept", "application/json")
          .expect(500)
      });
    });
  });
});      