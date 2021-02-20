import chai from "chai";
import request from "supertest";
import { app } from "../main";
import redis from "redis";
import bluebird from "bluebird";
import {listOfUsers, writeToFile} from "../utils/manageUsersFromJSON"

const client: any = bluebird.promisifyAll(redis.createClient());

export const createAcc = async(mail:string ,user_name:string, password:string) => {
    const { body: { userId } } = await request(app).post("/register").set("Accept", "application/json").send({
        mail,
        user_name,
        password,
    });
    return userId
}

export const delLastUser = async() => {
    listOfUsers.pop()
    writeToFile()
}

let firstAccount = ""
let secondAccount = ""

chai.should();

describe("to follow", () => {
    before(async() => firstAccount = await createAcc("a@a.it","Paolo","asdasd"))
    before(async() => secondAccount = await createAcc("a1@a.it","Paolo1","asdasd1"))

    it("follow by id", async () => {
        const { status, body } = await request(app).put(`/users/${firstAccount}/followed`)
        .set("Accept", "application/json").send({ userIdToFollow: `${secondAccount}` });
        status.should.equal(201)
        body.should.not.have.property("error")
    });
});

describe("All following", () => {
    it("show all following", async () => {
        const { status, body } = await request(app).get(`/users/${firstAccount}/followed`).set("Accept", "application/json");
        status.should.equal(200)
        body.should.not.have.property("error")
    })
});

describe("all followers", () => {
    it("show all followers", async () => {
        const { status, body } = await request(app).get(`/users/${firstAccount}/followers`).set("Accept", "application/json");
        status.should.equal(200)
        body.should.not.have.property("error")
    })
})

describe("Unfollow", async () => {
    after(() => delLastUser())
    after(() => delLastUser())
    after(() => client.del("a@a.it"))
    after(() => client.del("a1@a.it"))

    it("unfollow user", async () => {
        const { status, body } = await request(app).delete(`/users/${firstAccount}/followed/${secondAccount}`).set("Accept", "application/json");
        status.should.have.equal(201)
        //console.log(body)
        body.should.have.property("message")
    })
})
