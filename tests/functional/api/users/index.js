import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import User from "../../../../api/users/userModel";
import api from "../../../../index";
import users from "../../../../seedData/users";

const expect = chai.expect;
let db;
let user1token;

describe("Users endpoint", () => {
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
      await User.deleteMany();
      // Register two users
      await request(api).post("/api/users?action=register").send({
        username: "user1",
        password: "test1",
      });
      await request(api).post("/api/users?action=register").send({
        username: "user2",
        password: "test2",
      });
      await request(api).post("/api/users/user1/favourites").send({
        id: 372058
      });
    } catch (err) {
      console.error(`failed to Load user test Data: ${err}`);
    }
  });
  afterEach(() => {
    api.close();
  });
  describe("GET /api/users ", () => {
    it("should return the 2 users and a status 200", (done) => {
      request(api)
        .get("/api/users")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.a("array");
          expect(res.body.length).to.equal(2);
          let result = res.body.map((user) => user.username);
          expect(result).to.have.members(["user1", "user2"]);
          done();
        });
    });
  });

  describe("POST /api/users ", () => {
    describe("For a register action", () => {
      describe("when the payload is correct", () => {
        it("should return a 201 status and the confirmation message", () => {
          return request(api)
            .post("/api/users?action=register")
            .send({
              username: "user3",
              password: "test3",
            })
            .expect(201)
            .expect({ msg: "Successful created new user.", code: 201 });
        });
        after(async () => {
          const res = await request(api)
            .get("/api/users")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
              expect(res.body.length).to.equal(3);
              const result = res.body.map((user) => user.username);
              expect(result).to.have.members(["user1", "user2", "user3"]);
            });
        });
      });
    });
    describe("For an authenticate action", () => {
      describe("when the payload is correct", () => {
        it("should return a 200 status and a generated token", async () => {
          const res = await request(api)
            .post("/api/users?action=authenticate")
            .send({
              username: "user1",
              password: "test1",
            })
            .expect(200)
            .then((res) => {
              expect(res.body.success).to.be.true;
              expect(res.body.token).to.not.be.undefined;
              user1token = res.body.token.substring(7);
            });
        });
      });
    });
  });

  describe("POST /api/users/:username/favourites", () => {
    describe("when the username is valid", () => {
      describe("when the movie is not in favourites", () => {
        it("should return added message and status code 201", async () => {
          const res = await request(api)
            .post(`/api/users/${users[0].username}/favourites`)
            .send({
              id: 462750
            })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(201)
            .then((res) => {
              expect(res.body).to.have.property("username", users[0].username);
              expect(res.body.favourites.length).to.equal(2);
            });
        });
      });
      describe("when the movie is in favourites", () => {
        it("return error message and status code 403", () => {
          return request(api)
            .post(`/api/users/${users[0].username}/favourites`)
            .send({
              id: 372058
            })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(403)
            .expect({ 
              status_code: 403,
              message: 'Already exists in favourites.' 
            })
        });
      });
    });
    describe("when the username is invalid", () => {
      it("return error message and status code 500", () => {
        return request(api)
          .get(`/api/users/;'--=&*/favourites`)
          .set("Accept", "application/json")
          .expect("Content-Type", "text/html; charset=utf-8")
          .expect(500)
      });
    });
  });

  describe("GET /api/users/:username/favourites", () => {
    it("should return user's favourite movies list and status code 200", async () => {
      const res = await request(api)
        .get(`/api/users/${users[0].username}/favourites`)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.a("array");
          expect(res.body).to.contains(372058);
        });
    });
  });

  describe("POST /api/users/:username/movie/:id/favourites", () => {
    describe("when the username is valid", () => {
      describe("when the movie is in favourites", () => {
        it("should return deleted movie message and status code 201", () => {
          return request(api)
            .post(`/api/users/${users[0].username}/movie/372058/favourites`)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(201)
            .then((res) => {
              expect(res.body).to.have.property("username", users[0].username);
              expect(res.body.favourites.length).to.equal(0);
            });
        });
      });
      describe("when the movie is not in favourites", () => {
        it("return error message and status cdoe 404", () => {
          return request(api)
            .post(`/api/users/${users[0].username}/movie/238/favourites`)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(404)
            .expect({ 
              status_code: 404,
              message: 'Unble to find in favourites.' 
             })
        });
      });
    });
    describe("when the username is invalid", () => {
      it("return error message and status code 404", () => {
        return request(api)
          .get(`/api/users/sadassdawqe/movie/372058/favourites`)
          .set("Accept", "application/json")
          .expect("Content-Type", "text/html; charset=utf-8")
          .expect(404)
      });
    });
  });
});
