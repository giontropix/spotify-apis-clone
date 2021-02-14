import express, {NextFunction, Request, Response} from "express";
import {body, validationResult} from "express-validator";
import {songsList, readFileMiddleware, writeToFile} from "../utils/manageSongsFromJSON"
import {Song} from "../models/Song";

const router = express.Router();
export const handleErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors);
    else next();
};

router.get("/", readFileMiddleware, (_:Request, res:Response) => res.status(200).json(songsList) )

router.get('/:id_song', readFileMiddleware, ({params: {id_song}}:Request,res:Response) => {
    let songById:Song | undefined = songsList.find( ({id}) => id === id_song)
    songById && res.status(200).json(songById) || res.status(404).json({message: "Song not found!"})
})

router.get('/song/authors', readFileMiddleware, (_:Request, res:Response) => {
    let authorsList:string[] = songsList.map(({artist}) => artist).filter((x:string,i:number,authorsList:string[]) => authorsList.indexOf(x) === i)
    authorsList && res.status(200).json(authorsList) || res.status(404).json({message: "No artists found!"})
})

router.post('/', readFileMiddleware,body('title').notEmpty().isString().toLowerCase(),body('views').isInt(),body('ranking').isNumeric(),body('votes').isArray(),body('length').isFloat(),body('artist').notEmpty().toLowerCase().isString(),body('genre').exists().isString(),body('album').isString(),({body: {title,views, ranking, votes, length,artist,genre,album}}:Request,res:Response)=>{
    songsList.push(new Song(`S${Date.now()}`, title, views, ranking, votes, length, artist, genre, album))
    writeToFile()
    res.status(201).json({message: "Song added!"})
})

router.delete('/:id_song', readFileMiddleware, ({params: {id_song}}:Request,res:Response) =>{
    songsList.splice(songsList.findIndex(({id}) => id === id_song),1)
    writeToFile()
    res.status(200).json({message: "Song deleted!"})
})

export {router as songs}
