import express, {Request, Response, NextFunction} from "express";
import { body, header, validationResult } from "express-validator";
import * as fs from "fs";

import {Song} from "../models/Song";

const router = express.Router();
export const handleErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors);
    else next();
};

let songsList: Song[] = JSON.parse(fs.readFileSync("src/resources/songs.json", "utf-8"))
    .map(({id,title,views, ranking, votes,length,artist,genre}:Song):Song => new Song(id, title, views, ranking, votes, length, artist, genre))

router.get("/", (_:Request, res:Response) => res.status(200).json(songsList) )

router.get('/:id_song', ({params: {id_song}}:Request,res:Response) => {
    let songById:Song | undefined = songsList.find( ({id}) => id === Number(id_song))
    songById && res.status(200).json(songById) || res.status(404).json({message: "Song not found!"})
})

router.get('/song/authors',(_:Request, res:Response) => {
    let authorsList:string[] = songsList.map(({artist}) => artist).filter((x:string,i:number,authorsList:string[]) => authorsList.indexOf(x) === i)
    authorsList && res.status(200).json(authorsList) || res.status(404).json({message: "No artists found!"})
})

router.post('/',body('title').notEmpty().isString().toLowerCase(),body('views').isInt(),body('ranking').isNumeric(),body('votes').isArray(),body('length').isFloat(),body('artist').notEmpty().toLowerCase().isString(),body('genre').exists().isString(),body('album').isString(),({body: {title,views, ranking, votes, length,artist,genre,album}}:Request,res:Response)=>{
    songsList.push(new Song(songsList.length, title, views, ranking, votes, length, artist, genre, album))
    res.status(201).json({message: "Song added!"})
})

router.delete('/',({params: {id}}:Request,res:Response) =>{
    songsList.splice(Number(id),1)
    res.status(200).json({message: "Song deleted!"})
})

export {router as songs}