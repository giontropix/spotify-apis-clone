import express, {Request, Response} from "express";
import {listOfUsers, readFileMiddleware, writeToFile} from "../utils/manageUsersFromJSON";
import {User} from "../models/User";
import {playlists} from "./playlists";
import {followers} from "./followers";
import {readSongsFileMiddleware, songsList, writeSongsToFile} from "../utils/manageSongsFromJSON";
import {getMostListenedGenres, updateListeningStats} from "../utils/apisHelpers";

const router = express.Router({mergeParams: true});

router.use("/:id/playlists", playlists)
router.use("/:id", followers)

router.get("/", readFileMiddleware, ({query: {filter, offset, limit, option}}: Request, res: Response) => {
    if (filter) {
        let userToSearch: User | User[] | undefined = listOfUsers.filter((users: User) => {
            if (users.user_name.toLowerCase().includes(String(filter).toLowerCase()) ||
                users.mail.toLowerCase().includes(String(filter).toLowerCase())) return users
        });
        if (offset && limit) return res.status(200).json(userToSearch.slice(Number(offset), Number(offset) + Number(limit)))
        userToSearch && res.status(200).json(userToSearch) || res.status(404).json({message: "Error"})
    } else if (offset && limit) {
        res.status(200).json(listOfUsers.slice(Number(offset), Number(offset) + Number(limit)))
    } else return res.status(200).json(listOfUsers)
})

router.get("/:id", ({params: {id}}, res: Response) => {
    const user = listOfUsers.find((user: User) => user.id === id)
    !user && res.status(404).json({error: "User not found"})
    res.status(200).json(user);
})

//INCREMENTA ASCOLTI CANZONE
router.put('/:id', readSongsFileMiddleware, ({params: {id}, body: {song_id}}: Request, res: Response) => {
    const user = listOfUsers.find((user: User) => user.id === id)
    if (!user) return res.status(404).json({error: "User not found"})
    const song = songsList.find(({id}) => id === song_id)
    if (!song) return res.status(404).json({message: "Song not found!"})
    updateListeningStats(user, song)
    writeSongsToFile()
    writeToFile()
    res.status(201).json({message: "Views increased"})
})

router.get("/:id/suggestedSongs", readSongsFileMiddleware, ({params: {id}}: Request, res: Response) => {
    const user = listOfUsers.find((user: User) => user.id === id)
    if (!user) return res.status(404).json({error: "User not found"})
    const c = getMostListenedGenres(user).map(genre => songsList.filter((song) => song.genre === genre.genre)).reduce((acc, val) => acc.concat(val), []);
    res.status(200).json([...c]);
})

export {router as users}
