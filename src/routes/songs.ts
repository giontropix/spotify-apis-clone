import express, {Request, Response} from "express";
import {body} from "express-validator";
import {readSongsFileMiddleware, songsList, writeSongsToFile} from "../utils/manageSongsFromJSON"
import {Song} from "../models/Song";

const router = express.Router();

router.get("/", readSongsFileMiddleware, (_:Request, res:Response) => res.status(200).json(songsList) )

router.get('/:id_song', readSongsFileMiddleware, ({params: {id_song}}:Request, res:Response) => {
    let songById:Song | undefined = songsList.find( ({id}) => id === id_song)
    songById && res.status(200).json(songById) || res.status(404).json({message: "Song not found!"})
})

router.get('/authors', readSongsFileMiddleware, (_:Request, res:Response) => {
    let authorsList:string[] = songsList.map(({artist}) => artist).filter((x:string,i:number,authorsList:string[]) => authorsList.indexOf(x) === i)
    authorsList && res.status(200).json(authorsList) || res.status(404).json({message: "No artists found!"})
})

router.get('/genres/:genre_name', readSongsFileMiddleware, ({params: {genre_name}}:Request,res:Response) =>{
    let genreSong = songsList.filter(({genre}:Song) => genre.toLowerCase() === genre_name.toLowerCase())
    genreSong && res.status(200).json(genreSong) || res.status(404).json({message: "No artists found!"})
})

router.post('/', readSongsFileMiddleware,body('title').notEmpty().isString().toLowerCase(),body('views').isInt(),body('length').isFloat(),body('artist').notEmpty().toLowerCase().isString(),body('genre').exists().isString(),body('album').isString(),({body: {title,views, length,artist,genre,album}}:Request, res:Response)=>{
    let id = Date.now()
    songsList.push(new Song(`S${id}`, title, views, length, artist, genre, album))
    writeSongsToFile()
    res.status(201).json({message: "Song added!", id: `S${id}`})
})

router.delete('/:id_song', readSongsFileMiddleware, ({params: {id_song}}:Request, res:Response) =>{
    songsList.splice(songsList.findIndex(({id}) => id === id_song),1)
    writeSongsToFile()
    res.status(200).json({message: "Song deleted!"})
})

export {router as songs}
