import chai from "chai";
import request from "supertest";
import { app } from "../main";
import redis from "redis";
import bluebird from "bluebird";

const client: any = bluebird.promisifyAll(redis.createClient());
chai.should();

export const regUser = async () => {
    await request(app).post("/register").set("Accept", "application/json").send({
        mail: "teo@mail.it",
        user_name: "teo",
        password: "teold",
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

describe("Register user", () => {
    after(() => client.del("teo@mail.it"));

    it("Register a user", async () => {
        const { status, body } = await request(app)
            .post("/register")
            .set("Accept", "application/json")
            .send({
                mail: "teo@mail.it",
                user_name: "teo",
                password: "teold",
            });
        status.should.equal(201)
        body.should.not.have.property("error");
    });
});

describe("Login user", () => {
    before(() => regUser()); 
    after(() => client.del("teo@mail.it"));

    it("Login the first time", async () => {
        const { status, body } = await request(app).get("/login").set({
            Accept: "application/json",
            mail: "teo@mail.it",
            password: "teold",
        });
        status.should.equal(201);
        body.should.not.have.property("error");

        let access_token = body.access_token;
        let refresh_token = body.refresh_token;
        logOut(access_token, refresh_token);
    });
});