import * as fs from "fs";
import {User} from "../models/User";
import express from "express";

const path: string = "src/resources/users.json";

export let listOfUsers: User[] = [];

export const readFileMiddleware = (_: express.Request, __: express.Response, next: express.NextFunction) => {
    readFile();
    if (next) next();
}

export const readFile = () => {
    try {
        const data = fs.readFileSync(path, "utf8");
        listOfUsers = JSON.parse(data).map((user: User) => {
            if (user) return new User(user.id, user.user_name, user.mail, user.playlist, user.followers, user.following)
        });
    } catch (err) {
        if (err) return console.error(err)
    }
}

export const writeToFile = () => {
    try {
        fs.writeFileSync(path, JSON.stringify(listOfUsers, null, 2))
    } catch (err) {
        console.error(err);
    }
}
