import * as fs from "fs";
import {Song} from "../models/Song";
import express from "express";

const path: string = "src/resources/songs.json";

export let songsList: Song[] = [];

export const readFileMiddleware = (_: express.Request, __: express.Response, next: express.NextFunction) => {
    readFile();
    if (next) next();
}

export const readFile = () => {
    try {
        const data = fs.readFileSync(path, "utf8");
        songsList = JSON.parse(data).map((song: Song) => {
            if (song) return new Song(song.id,song.title,song.views,song.ranking,
                song.votes,song.length,song.artist,song.genre,song.album)
        });
    } catch (err) {
        if (err) return console.error(err)
    }
}

export const writeToFile = () => {
    try {
        fs.writeFileSync(path, JSON.stringify(songsList, null, 2))
    } catch (err) {
        console.error(err);
    }
}
