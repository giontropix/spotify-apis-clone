import chai from "chai";
import request from "supertest";
import { app } from "../main";

chai.should();

describe("to follow", () => {
    it("follow by id", async () => {
        const { status, body } = await request(app).put("/users/0/followed")
            .set("Accept", "application/json").send({ userIdToFollow: "1" });
        status.should.equal(201)
        body.should.not.have.property("error")
    });
});

describe("All following", () => {
    it("show all following", async () => {
        const { status, body } = await request(app).get("/users/0/followed").set("Accept", "application/json");
        status.should.equal(200)
        body.should.not.have.property("error")
    })
});

describe("all followers", () => {
    it("show all followers", async () => {
        const { status, body } = await request(app).get("/users/0/followers").set("Accept", "application/json");
        status.should.equal(200)
        body.should.not.have.property("error")
    })
})

describe("Unfollow", async () => {
    it("unfollow user", async () => {
        const { status, body } = await request(app).delete("/users/0/followed/1").set("Accept", "application/json");
        status.should.have.equal(201)
        console.log(body)
        body.should.have.property("message")
    })
})
