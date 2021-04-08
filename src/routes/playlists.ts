//CREARE UNA NUOVA PLAYLIST
import {body} from "express-validator";
import {handleErrors} from "../utils/apisHelpers";
import express, {Request, Response} from "express";
import {listOfUsers, writeToFile} from "../utils/manageUsersFromJSON";
import {User} from "../models/User";
import {Playlist} from "../models/Playlist";
import {readSongsFileMiddleware, songsList} from "../utils/manageSongsFromJSON";
import {Song} from "../models/Song";
import {UserSong} from "../models/UserSong";

const router = express.Router({mergeParams: true});

// CREARE UNA NUOVA PLAYLIST
router.post("/", body('name').isString().notEmpty(), handleErrors, ({params: {id}, body: {name}}: Request, res:Response) => {
    const currentUser = listOfUsers.find((user: User) => user.id === id)
    if(!currentUser) return res.status(404).json({error: "User not found"})
    const playlistId: string = "P" + Date.now().toString();
    currentUser.playlist.push(new Playlist(playlistId, name))
    writeToFile()
    return res.status(201).json({message: "playlist created", playlistId})
})

//VEDERE TUTTE LE PLAYLIST DI UN UTENTE
router.get("/", ({params:{id}, query:{offset, limit}}:Request, res:Response) => {
    const currentUser = listOfUsers.find((user: User) => user.id === id)
    if(!currentUser) return res.status(404).json({error: "User not found"})
    if(offset && limit) return res.status(200).json(currentUser.playlist.map((list: Playlist) => ({
        id: list.id, title: list.title, length: list.songs.length})).slice(Number(offset), Number(offset) + Number(limit)))
    return res.status(200).json(currentUser.playlist.map((list: Playlist) => ({id: list.id, title: list.title, length: list.songs.length})))
})

//VEDERE UNA SINGOLA PLAYLIST
router.get("/:playlistId", ({params:{id, playlistId}}:Request, res:Response) => {
    const currentUser = listOfUsers.find((user: User) => user.id === id)
    if(!currentUser) return res.status(404).json({error: "User not found"})
    const playlist = currentUser.playlist.find((list: Playlist) => list.id === playlistId)
    if(!playlist) return res.status(404).json({error: "Playlist not found"})
    return res.status(200).json(playlist);
})

//VEDERE TUTTE LE CANZONI DI UNA PLAYLIST
router.get("/:playlistId/songs", readSongsFileMiddleware, ({params:{id, playlistId}, query:{offset, limit}}:Request, res:Response) => {
    const currentUser = listOfUsers.find((user: User) => user.id === id)
    if(!currentUser) return res.status(404).json({error: "User not found"})
    const playlist = currentUser.playlist.find((list: Playlist) => list.id === playlistId)
    if(!playlist) return res.status(404).json({error: "Playlist not found"})
    const playlistSongs = playlist.songs.map((({id}) => songsList.find(( {id: songId}) => songId === id)))
    return res.status(200).json(playlistSongs);
})

//ELIMINARE UNA PLAYLIST
router.delete("/:playlistId", ({params:{id, playlistId}}: Request, res:Response) => {
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
    if(playlist.songs.find(({id}: UserSong) => id === song.id)) return res.status(403).json({error: 'This song is already in the selected playlist'})
    const userSong: UserSong = new UserSong(song.id, song.genre)
    currentUser.playlist.find(({id}:Playlist) => id === idPlaylist)?.songs.push(userSong)
    writeToFile()
    return res.status(201).json({message: `${song.title} added to playlist ${playlist.title}!`})
})

//RIMUOVI CANZONE DA PLAYLIST
router.delete("/:idPlaylist/songs/:songId", ({params:{ id, idPlaylist, songId }}:Request, res:Response) => {
    const currentUser = listOfUsers.find((user:User) => user.id === id)
    if(!currentUser) return res.status(404).json({error: "User not found"})
    const playlist = currentUser.playlist.find((playlist: Playlist) => playlist.id === idPlaylist)
    if(!playlist) return res.status(404).json({error: "Playlist not found"})
    const songIndex = playlist.songs.findIndex((song: UserSong) => song.id === songId)
    if(songIndex === -1) return res.status(404).json({error: "Song not found"})
    currentUser.playlist.find((playlist: Playlist) => playlist.id === idPlaylist)?.songs.splice(songIndex, 1);
    writeToFile()
    return res.status(201).json({message: `Song deleted from playlist titled ${playlist.title}`})
})

export {router as playlists}
