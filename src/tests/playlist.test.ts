import chai from "chai";
import request from "supertest";
import { app } from "../main";

chai.should()
let plist = ""

describe("Playlist", () => {
    it("create playlist", async () => {
        const { status, body } = await request(app)
            .post("/users/1/playlists")
            .set("Accept", "application/Json")
            .send({
                name: "slow"
            })
        plist = body.playlistId
        status.should.have.equal(201)
        body.should.not.have.property("error")
    })
})

describe("all playlists", () => {
    it("show playlist", async () => {
        const { status, body } = await request(app)
            .get("/users/1/playlists")
            .set("Accept", "application/Json")
        status.should.have.equal(200)
        body.should.not.have.property("error")

    })
})

describe("show playlist by id", () => {
    it("show single playlist", async () => {
        const { status, body } = await request(app)
            .get(`/users/1/playlists/${plist}`)
            .set("Accept", "application/Json")
        status.should.have.equal(200)
        body.should.not.have.property("error")
    })
})

describe("Add to playlists", () => {
    it("add song in a playlist", async () => {
        const { status, body } = await request(app).put(`/users/1/playlists/${plist}/songs`).set("Accept", "application/Json")
            .send({
                songId: "0"
            })
        status.should.have.equal(201)
        body.should.not.have.property("error")
    });
})

describe("Elimination songs", () => {
    it("delete song from playlist", async () => {
        const { status, body } = await request(app).delete(`/users/1/playlists/${plist}/songs/0`)
        status.should.have.equal(201)
        body.should.have.property("message")
    });
})

describe("Elimination playlist", async () => {
    it("playlist deleted", async () => {
        const { status, body } = await request(app).delete(`/users/1/playlists/${plist}`)
        status.should.have.equal(201)
        body.should.not.have.property("error")
    })

    it("error playlist already deleted", async () => {
        const { status, body } = await request(app).delete(`/users/1/playlists/${plist}`)
        status.should.have.equal(404)
        body.should.have.property("error")
    })
})
