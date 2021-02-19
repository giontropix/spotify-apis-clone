import * as fs from "fs";
import {Song} from "../models/Song";
import express from "express";

const path: string = "src/resources/songs.json";

export let songsList: Song[] = [];

export const readSongsFileMiddleware = (_: express.Request, __: express.Response, next: express.NextFunction) => {
    readFile();
    if (next) next();
}

export const readFile = () => {
    try {
        const data = fs.readFileSync(path, "utf8");
        songsList = JSON.parse(data).map((song: any) => {
            if (song) return new Song(song._id, song._title, song._views, song._length, song._artist, song._genre, song._src, song._album)
        });
    } catch (err) {
        if (err) return console.error(err)
    }
}

export const writeSongsToFile = () => {
    try {
        fs.writeFileSync(path, JSON.stringify(songsList, null, 2))
    } catch (err) {
        console.error(err);
    }
}
