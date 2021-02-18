import chai from "chai";
import request from "supertest";
import { app } from "../main";

describe("Playlist creation", () => {
    it("create playlist", async () => {
        const { status, body } = await request(app)
            .post("/name")
            .set("Accept", "application/Json")
            .send({
                name: "slow-music"

            })
        status.should.have.equal(201)
        body.should.have.property("slow-musis")
    })
})