import express from "express";
import cors from "cors"
import bodyParser from "body-parser";
import redis from "redis";
import {auth} from "./routes/auth";
import {songs} from "./routes/songs";
import {users} from "./routes/users";
import {readFileMiddleware} from "./utils/manageUsersFromJSON";

export const app = express();
app.use(bodyParser.json());
const options: cors.CorsOptions = {
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'X-Access-Token',
        'mail',
        'password',
        'access_token',
        'refresh_token',
        "access_token",
        "refresh_token"
    ],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: "http://localhost:4200",
    preflightContinue: false,
};
const optionsIonic: cors.CorsOptions = {
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'X-Access-Token',
        'mail',
        'password',
        'access_token',
        'refresh_token',
        "access_token",
        "refresh_token"
    ],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: "http://localhost:8100",
    preflightContinue: false,
};
app.use(cors(options));
app.use(cors(optionsIonic));
app.use(bodyParser.urlencoded({extended: true}));

const client = redis.createClient();
client.on("error", function (error) {
    console.error(error);
});

app.use("/", auth);
app.use("/songs", songs)
app.use("/users", readFileMiddleware, users)
app.listen(3000, () => console.log("Server started"));
