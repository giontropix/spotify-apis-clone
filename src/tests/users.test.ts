import chai from "chai";
import request from "supertest";
import { app } from "../main";

chai.should()

describe("List of users", () => {
    it("show all users", async () => {
        const { status, body } = await request(app).get("/users").set("Accept", "application/Json");
        status.should.have.equal(200)

    })
})

describe("show user by id", () => {
    it("show a single user", async () => {
        const { status, body } = await request(app).get("/users/2").set("Accept", "application/Json");
        status.should.have.equal(200)
        body.should.not.have.property("error")
    })
})
