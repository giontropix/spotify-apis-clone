import express from "express";
import cors from "cors"
import bodyParser from "body-parser";
import fs from "fs";

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

const path: string = "src/resources/banks.json";

export const readFileMiddleware = (_: express.Request, __: express.Response, next: express.NextFunction) => {
  readFile();
  if(next) next();
}

export const readFile = () => {
  try {
    const data = fs.readFileSync(path, "utf8");
  } catch(err) {
    if (err) return console.error(err)
  }
}

export const writeToFile = () => {
  try {
    fs.writeFileSync(path, JSON.stringify("inserisiamo il file da scrivere", null, 2))
  } catch (err) {
    console.error(err);
  }
}


//app.use("/banks", readFileMiddleware, banks);
app.listen(3000, () => console.log("Server started"));
