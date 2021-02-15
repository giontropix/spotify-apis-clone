//CREARE UNA NUOVA PLAYLIST
import {body} from "express-validator";
import {handleErrors} from "../utils/apisHelpers";
import express, {Request, Response} from "express";
import {listOfUsers, writeToFile} from "../utils/manageUsersFromJSON";
import {User} from "../models/User";
import {Playlist} from "../models/Playlist";
import {readSongsFileMiddleware, songsList} from "../utils/manageSongsFromJSON";
import {Song} from "../models/Song";

const router = express.Router({mergeParams: true});

router.post("/", body('name').exists().isString(), handleErrors, ({params: {id}, body: {name}}: Request, res:Response) => {
    const currentUser = listOfUsers.find((user: User) => user.id === id)
    if(!currentUser) return res.status(404).json({error: "User not found"})
    const playlistId: string = "P" + Date.now().toString();
    currentUser.playlist.push(new Playlist(playlistId, name))
    writeToFile()
    return res.status(201).json({message: "playlist created", playlistId})
})

//VEDERE TUTTE LE PLAYLIST DI UN UTENTE
router.get("/", ({params:{id}}:Request, res:Response) => {
    const currentUser = listOfUsers.find((user: User) => user.id === id)
    if(!currentUser) return res.status(404).json({error: "User not found"})
    return res.status(200).json(currentUser.playlist.map((list: Playlist) => ({
            id: list.id, title: list.title
        })))
})

//VEDERE UNA SINGOLA PLAYLIST
router.get("/:playlistId", ({params:{id, playlistId}}:Request, res:Response) => {
    const currentUser = listOfUsers.find((user: User) => user.id === id)
    if(!currentUser) return res.status(404).json({error: "User not found"})
    const playlist = currentUser.playlist.find((list: Playlist) => list.id === playlistId)
    if(!playlist) return res.status(404).json({error: "Playlist not found"})
    return res.status(200).json(playlist);
})

//ELIMINARE UNA PLAYLIST
router.delete("/", body('playlistId').exists().isString(),handleErrors, ({params:{id}, body:{playlistId}}: Request, res:Response) => {
    const currentUser = listOfUsers.find((user: User) => user.id === id)
    if(!currentUser) return res.status(404).json({error: "User not found"})
    const playlistIndex = currentUser.playlist.findIndex((playlist: Playlist) => playlist.id === playlistId)
    if(playlistIndex === -1) return res.status(404).json({error: "Playlist not found"})
    currentUser.playlist.splice(playlistIndex, 1)
    writeToFile()
    return res.status(201).json({message: "Playlist removed"})
})

//AGGIUNGI CANZONE A PLAYLIST
router.put("/:idPlaylist/songs", readSongsFileMiddleware, body("songId").notEmpty().isString(), handleErrors, ({params:{id, idPlaylist},body:{songId}}:Request,res:Response) => {
    const currentUser = listOfUsers.find((user:User) => user.id === id)
    if(!currentUser) return res.status(404).json({error: "User not found"})
    const playlist = currentUser.playlist.find(({id}:Playlist) => id === idPlaylist)
    if(!playlist) return res.status(404).json({error: "Playlist not found"})
    const song = songsList.find((item: Song ) => item.id === songId)
    if(!song) return res.status(404).json({error: "Song not found"})
    currentUser.playlist.find(({id}:Playlist) => id === idPlaylist)?.songs.push(song)
    writeToFile()
    return res.status(201).json({message: `${song.title} added to playlist ${playlist.title}!`})
})

//RIMUOVI CANZONE DA PLAYLIST
router.delete("/:idPlaylist/songs", body("songId").notEmpty().isString(), handleErrors, ({params:{ id, idPlaylist },body:{ songId } }:Request, res:Response) => {
    const currentUser = listOfUsers.find((user:User) => user.id === id)
    if(!currentUser) return res.status(404).json({error: "User not found"})
    const playlist = currentUser.playlist.find((playlist: Playlist) => playlist.id === idPlaylist)
    if(!playlist) return res.status(404).json({error: "Playlist not found"})
    const songIndex = playlist.songs.findIndex((song: Song) => song.id === songId)
    if(songIndex === -1) return res.status(404).json({error: "Song not found"})
    currentUser.playlist.find((playlist: Playlist) => playlist.id === idPlaylist)?.songs.splice(songIndex, 1);
    writeToFile()
    return res.status(201).json({message: `Song deleted from playlist titled ${playlist.title}`})
})

export {router as playlists}
