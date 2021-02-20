import chai from "chai";
import request from "supertest";
import { app } from "../main";

chai.should();

let songId = ""


describe("insert songs", () => {
    it("show added song", async () => {
        const { status, body: {id} } = await request(app)
            .post("/songs")
            .set("Accept", "application/json")
            .send({
                title: "relax",
                views: 1,
                length: 1.55,
                artist: "Tizio",
                genre: "classical",
            });
        status.should.equal(201);
        songId = id
    });
});


describe("all list of songs", () => {
    it("Show songs", async () => {
        const { status } = await request(app)
            .get("/songs")
            .set("Accept", "application/json");
        status.should.equal(200);
    });
});

describe("single song", () => {
    it("Show one song", async () => {
        const { status } = await request(app)
            .get(`/songs/${songId}`)
            .set("Accept", "application/json");
        status.should.equal(200);
    });
});

describe("Delete song", () => {
    it("delete song", async () => {
        const { status } = await request(app)
            .delete(`/songs/${songId}`)
            .set("Accept", "application/json");
        status.should.equal(201);
    })
});
