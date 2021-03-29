import express, {Request, Response} from "express";
import {listOfUsers} from "../utils/manageUsersFromJSON";
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

router.put(':id/songs/:id_song', readSongsFileMiddleware, ({params: {userId, id_song}}:Request, res:Response) => {
    const user = listOfUsers.find((user: User) => user.id === userId)
    if(!user) return res.status(404).json({error: "User not found"})
    const song = songsList.find(({id}) => id === id_song)
    if(!song) return res.status(404).json({message: "Song not found!"})
    user.lastTenSongsPlayed.push(new Played(id_song, song.genre))
    song.views += 1
    writeSongsToFile()
    res.status(201).json({message: "Views increased"})
})

export {router as users }
