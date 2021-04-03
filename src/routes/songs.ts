import express, {Request, Response} from "express";
import {body} from "express-validator";
import {readSongsFileMiddleware, songsList, writeSongsToFile} from "../utils/manageSongsFromJSON"
import {Song} from "../models/Song";

const router = express.Router();

//router.get("/", readSongsFileMiddleware, (_:Request, res:Response) => res.status(200).json(songsList) )

router.get('/:id_song', readSongsFileMiddleware, ({params: {id_song}}:Request, res:Response) => {
    let songById:Song | undefined = songsList.find( ({id}) => id === id_song)
    songById && res.status(200).json(songById) || res.status(404).json({message: "Song not found!"})
})

router.get('/', readSongsFileMiddleware, ({query:{filter, offset, limit, option}}:Request, res:Response) => {
    if(filter){
        let songSearch:Song | Song[] | undefined = songsList.filter((songs:Song) => {
            if (songs.title.toLowerCase().includes(String(filter).toLowerCase())  ||
                songs.artist.toLowerCase().includes(String(filter).toLowerCase())) return songs
        });
        if (offset && limit) return res.status(200).json(songSearch.slice(Number(offset), Number(offset) + Number(limit)))
        songSearch && res.status(200).json(songSearch) || res.status(404).json({message: "Error"})
    } else if (offset && limit) {
        res.status(200).json(songsList.slice(Number(offset), Number(offset) + Number(limit)))
    } else if (option === "top") {
        res.status(200).json(songsList.sort((a, b) => b.views - a.views).slice(0,6));
    } else if (option === "last") {
        res.status(200).json(songsList.sort((a, b) => b.date - a.date).slice(0, 10));
    }
    else res.status(200).json(songsList)

})

router.get('/genres/list', readSongsFileMiddleware, ({query: {genre_name}}:Request,res:Response) =>{
    if(genre_name){
        let genreSong = songsList.filter(({genre}:Song) => genre.toLowerCase() === String(genre_name).toLowerCase())
        genreSong && res.status(200).json(genreSong) || res.status(404).json({message: "No songs found!"})
    }else res.status(200).json(songsList)
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
    res.status(201).json({message: "Song deleted!"})
})

export {router as songs}
