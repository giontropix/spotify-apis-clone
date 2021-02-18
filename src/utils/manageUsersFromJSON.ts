import * as fs from "fs";
import {User} from "../models/User";
import express from "express";
import {Playlist} from "../models/Playlist";
import {Follower} from "../models/Follower";
import {Song} from "../models/Song";

const path: string = "src/resources/users.json";

export let listOfUsers: User[] = [];

export const readFileMiddleware = (_: express.Request, __: express.Response, next: express.NextFunction) => {
    readFile();
    if (next) next();
}

export const readFile = () => {
    try {
        const data = fs.readFileSync(path, "utf8");
        listOfUsers = JSON.parse(data).map((user: any) =>
            user && new User(user._id, user._user_name, user._mail, user._playlist.map((list: any) => {
                if (list) return new Playlist(list._id, list._title, list._songs.map((song: any) => {
                    if(song) return new Song(song._id, song._title, song._views, song._length, song._artist, song._genre, song?._album)
                }))
            }), user._followers.map((foll: any) => {
                if(foll) return new Follower(foll._id, foll._user_name)
            }), user._followed.map((foll: any) => {
                if(foll) return new Follower(foll._id, foll._user_name)
            }))
        );
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
