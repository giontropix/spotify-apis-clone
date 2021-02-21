import chai from "chai";
import request from "supertest";
import {app} from "../main";
import redis from "redis";
import bluebird from "bluebird";
import {listOfUsers, writeToFile} from '../utils/manageUsersFromJSON'
import {songsList, writeSongsToFile} from '../utils/manageSongsFromJSON'

const client: any = bluebird.promisifyAll(redis.createClient());

chai.should()
let plist = ""
let accountId = ""
let songId = ""

export const createAcc = async() => {
    const { body: { userId } } = await request(app).post("/register").set("Accept", "application/json").send({
        mail: "teo@mail.it",
        user_name: "teo",
        password: "teold",
        sex: "M",
    });
    accountId = userId
}

export const delLastUser = async() => {
    listOfUsers.pop()
    writeToFile()
}

export const createSong = async() => {
    const { body: {id} } = await request(app)
            .post("/songs")
            .set("Accept", "application/json")
            .send({
                title: "relax",
                views: 1,
                length: 1.55,
                artist: "Tizio",
                genre: "classical",
            });
        songId = id
}

export const delLastSong = async() => {
    songsList.pop()
    writeSongsToFile()
}
describe("Playlist", () => {
    before(() => createAcc())
    
    it("create playlist", async () => {
        const { status, body } = await request(app)
            .post(`/users/${accountId}/playlists`)
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
            .get(`/users/${accountId}/playlists`)
            .set("Accept", "application/Json")
        status.should.have.equal(200)
        body.should.not.have.property("error")

    })
})

describe("show playlist by id", () => {
    it("show single playlist", async () => {
        const { status, body } = await request(app)
            .get(`/users/${accountId}/playlists/${plist}`)
            .set("Accept", "application/Json")
        status.should.have.equal(200)
        body.should.not.have.property("error")
    })
})

describe("Add to playlists", () => {
    before(() => createSong())

    it("add song in a playlist", async () => {
        const { status, body } = await request(app).put(`/users/${accountId}/playlists/${plist}/songs`).set("Accept", "application/Json")
            .send({
                songId: `${songId}`
            })
        status.should.have.equal(201)
        body.should.not.have.property("error")
    });
})

describe("Elimination songs", () => {
    it("delete song from playlist", async () => {
        const { status, body } = await request(app).delete(`/users/${accountId}/playlists/${plist}/songs/${songId}`)
        status.should.have.equal(201)
        body.should.have.property("message")
    });
})

describe("Elimination playlist", async () => {
    after(() => client.del("teo@mail.it"))
    after(() => delLastUser())
    after(() => delLastSong())
    it("playlist deleted", async () => {
        const { status, body } = await request(app).delete(`/users/${accountId}/playlists/${plist}`)
        status.should.have.equal(201)
        body.should.not.have.property("error")
    })
})
