import {validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";
import bluebird from "bluebird";
import redis from "redis";
import {TokenBase, TokenGenerator} from "ts-token-generator";
import {User} from "../models/User";
import {Played} from "../models/Played";
import {Song} from "../models/Song";

const client: any = bluebird.promisifyAll(redis.createClient());
const tokgen = new TokenGenerator({bitSize: 512, baseEncoding: TokenBase.BASE62});

export const handleErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors);
    else next();
};

export const checkExpiredToken = async ({headers: {access_token, refresh_token}}: Request, res: Response) => {
    if(!access_token && !refresh_token || access_token === refresh_token) return res.status(401).json({error: "User must be logged to see products list"});
    let mail = await client.getAsync(access_token);
    if(mail) return res.status(200).json({access_token, refresh_token});
    mail = await client.getAsync(refresh_token)
    if(!mail) return res.status(401).json({error: "User must be logged to see products list"});
    access_token = tokgen.generate();
    client.set(access_token, JSON.stringify(mail), 'EX', 86400);
    refresh_token = tokgen.generate()
    client.set(refresh_token, JSON.stringify(mail), 'EX', 86400*7);
    res.status(201).json({access_token, refresh_token});
}

export const updateListeningStats = (user: User, song: Song) => {
    if (user.lastSongsPlayed.length === 10) user.lastSongsPlayed.shift()
    user.lastSongsPlayed.push(new Played(song.id, song.genre))
    song.views += 1
}

export const getMostListenedGenres = (user: User) => {
    const userListenedGenres = user.lastSongsPlayed.map(item => item.genre);
    const uniqueGenres = [...new Set(userListenedGenres)]
    const countGenreOccurrences = (arr: string[], val: string) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
    return uniqueGenres.map((genre) => ({genre, value: countGenreOccurrences(userListenedGenres, genre)})).sort((a, b) => b.value - a.value).slice(0,3)
}
