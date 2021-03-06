import chai from "chai";
import request from "supertest";
import {app} from "../main";
import redis from "redis";
import bluebird from "bluebird";
import {listOfUsers, writeToFile} from '../utils/manageUsersFromJSON'

const client: any = bluebird.promisifyAll(redis.createClient());
chai.should();

let access_token = "";
let refresh_token = "";

export const regUser = async () => {
    await request(app).post("/register").set("Accept", "application/json").send({
        mail: "teo@mail.it",
        user_name: "teo",
        password: "teold",
        sex: "M",
    });
};

export const logUser = () => {
    it("login - user", async () => {
        await request(app).get("/login").set({
            Accept: "application/json",
            mail: "teo@mail.it",
            password: "teold",
        });
    });
};
export const logOut = async (access_token: string, refresh_token: string) => {
    await request(app).delete("/logout").set({
        Accept: "application/json",
        access_token,
        refresh_token,
    });
};

export const delLastUser = async() => {
    listOfUsers.pop()
    writeToFile()
}
describe("Register user", () => {
    after(() => client.del("teo@mail.it"));
    after(() => delLastUser())

    it("Register a user", async () => {
        const { status, body } = await request(app)
            .post("/register")
            .set("Accept", "application/json")
            .send({
                mail: "teo@mail.it",
                user_name: "teo",
                password: "teold",
                sex: "M",
            });
        status.should.equal(201)
        body.should.not.have.property("error");
    });
});

describe("Login user", () => {
    before(() => regUser()); 
    it("Login the first time", async () => {
    const { status, body } = await request(app).get("/login").set({
        Accept: "application/json",
        mail: "teo@mail.it",
        password: "teold",
    });
        status.should.equal(201);
        body.should.not.have.property("error");
        access_token = body.access_token;
        refresh_token = body.refresh_token;
        
    });
});

describe("logout user", () => {
    after(() => client.del("teo@mail.it"))
    after(() => delLastUser());

    it("logout", async() =>{
        const {status} = await request(app).delete("/logout").set({Accept: "application/json", access_token, refresh_token})
        status.should.equal(201)
    })
})
