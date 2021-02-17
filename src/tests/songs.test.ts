import chai from "chai";
import request from "supertest";
import { app } from "../main";

chai.should();

export const delSong = async (id:string) => {
    await request(app)
    .delete(`/songs/${id}`)
    .set("Accept", "application/json");
};

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
            .get("/songs/0")
            .set("Accept", "application/json");
        status.should.equal(200);
    });
});

describe("all artist", () => {
    it("show artist", async () => {
        const { status } = await request(app)
            .get("/songs/song/authors")
            .set("Accept", "application/json");
        status.should.equal(200);
    });
});

describe("insert songs", () => {
    it("show added song", async () => {
        const { status, body} = await request(app)
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
        delSong(body.id)
    });
});

describe.skip("Elimination song", () => {
    it("delete song", async () => {
        const { status } = await request(app)
            .delete("/songs/1")
            .set("Accept", "application/json");
        status.should.equal(200);
    });
});
