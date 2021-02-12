"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeToFile = exports.readFile = exports.readFileMiddleware = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
exports.app = express_1.default();
exports.app.use(body_parser_1.default.json());
const options = {
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
exports.app.use(cors_1.default(options));
exports.app.use(body_parser_1.default.urlencoded({ extended: true }));
const path = "src/resources/banks.json";
const readFileMiddleware = (_, __, next) => {
    exports.readFile();
    if (next)
        next();
};
exports.readFileMiddleware = readFileMiddleware;
const readFile = () => {
    try {
        const data = fs_1.default.readFileSync(path, "utf8");
    }
    catch (err) {
        if (err)
            return console.error(err);
    }
};
exports.readFile = readFile;
const writeToFile = () => {
    try {
        fs_1.default.writeFileSync(path, JSON.stringify("inserisiamo il file da scrivere", null, 2));
    }
    catch (err) {
        console.error(err);
    }
};
exports.writeToFile = writeToFile;
//app.use("/banks", readFileMiddleware, banks);
exports.app.listen(3000, () => console.log("Server started"));
