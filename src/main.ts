import express from "express";
import cors from "cors"
import bodyParser from "body-parser";
import redis from "redis";
import {Song} from "./models/Song";
import { auth } from "./routes/auth";
import {songs} from "./routes/songs";

export const app = express();
app.use(bodyParser.json());
const options: cors.CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
  ],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: "http://localhost:4200",
  preflightContinue: false,
};
app.use(cors(options));
app.use(bodyParser.urlencoded({ extended: true }));

const client = redis.createClient();
client.on("error", function (error) {
  console.error(error);
});

app.use("/", auth);
app.use("/songs", songs)
app.listen(3000, () => console.log("Server started"));
