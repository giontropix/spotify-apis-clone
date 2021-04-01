import express, {Request, Response} from "express";
import {listOfUsers, writeToFile} from "../utils/manageUsersFromJSON";
import {User} from "../models/User";
import {playlists} from "./playlists";
import {followers} from "./followers";
import {readSongsFileMiddleware, songsList, writeSongsToFile} from "../utils/manageSongsFromJSON";
import {Played} from "../models/Played";

const router = express.Router({mergeParams: true});

router.use("/:id/playlists", playlists)
router.use("/:id", followers)

router.get("/", (_: Request, res: Response) => res.status(200).json(listOfUsers))

router.get("/:id", ({params: {id}}, res: Response) => {
    const user = listOfUsers.find((user: User) => user.id === id)
    !user && res.status(404).json({error: "User not found"})
    res.status(200).json(user);
})

//INCREMENTA ASCOLTI CANZONE
router.put('/:id', readSongsFileMiddleware, ({params: {id}, body:{song_id}}:Request, res:Response) => {
    const user = listOfUsers.find((user: User) => user.id === id)
    if(!user) return res.status(404).json({error: "User not found"})
    const song = songsList.find(({id}) => id === song_id)
    if(!song) return res.status(404).json({message: "Song not found!"})
    user.lastTenSongsPlayed.push(new Played(song_id, song.genre))
    song.views += 1
    writeSongsToFile()
    writeToFile()
    res.status(201).json({message: "Views increased"})
})

export {router as users }
