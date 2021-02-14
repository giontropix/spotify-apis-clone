import express, {Request, Response} from "express";
import {listOfUsers, readFileMiddleware, writeToFile} from "../utils/manageUsersFromJSON";
import {User} from "../models/User";
import {Playlist} from "../models/Playlist";
import {readSongsFileMiddleware, songsList} from "../utils/manageSongsFromJSON";
import {Follower} from "../models/Follower";
import {Song} from "../models/Song";

const router = express.Router();

router.get("/", (_: Request, res: Response) => {
    return res.status(200).json(listOfUsers);
})

router.get("/:id", ({params: {id}}, res: Response) => {
    const user = listOfUsers.find((user: User) => user.id === id)
    if (!user) return res.status(404).json({error: "User not found"})
    res.status(201).json(user);
})

//SEGUIRE UN UTENTE
router.put("/:currentUserId", readFileMiddleware, ({body: {userIdToFollow}, params:{currentUserId}}, res: Response) => {
    const currentUser = listOfUsers.find((user: User) => user.id === currentUserId)
    if(!currentUser) return res.status(404).json({error: "User not found"})
    const userToFollow = listOfUsers.find((user: User) => user.id === userIdToFollow)
    if(!userToFollow) return res.status(404).json({error: "User not found"})
    if(currentUser.following.find((item: Follower) => item.id === userToFollow.id))
        return res.status(400).json({error: "User just followed"})
    currentUser.following.push(new Follower(userToFollow.id, userToFollow.user_name))
    userToFollow.followers.push(new Follower(currentUser.id, currentUser.user_name))
    writeToFile()
    res.status(201).json({message: "User followed", currentUser, userToFollow})
})

//SMETTERE DI SEGUIRE UN UTENTE
router.delete("/:currentUserId", readFileMiddleware, ({body: {userIdToFollow: userIdToUnfollow}, params:{currentUserId}}:Request, res: Response) => {
    const currentUser = listOfUsers.find((user: User) => user.id === currentUserId)
    if(!currentUser) return res.status(404).json({error: "User not found"})
    const userToUnfollow = listOfUsers.find((user: User) => user.id === userIdToUnfollow)
    if(!userToUnfollow) return res.status(404).json({error: "User to unfollow not found"})
    const userToUnfollowIndex = currentUser.following.findIndex((user: Follower) => user.id === userIdToUnfollow)
    if(userToUnfollowIndex === -1) return res.status(404).json({error: "User to unfollow not found"})
    const currentUserIndex = userToUnfollow.followers.findIndex((user: Follower) => user.id === currentUserId)
    if(currentUserIndex === -1) return res.status(404).json({error: "User not found"})
    currentUser.following.splice(userToUnfollowIndex, 1)
    userToUnfollow.followers.splice(currentUserIndex, 1)
    writeToFile()
    return res.status(201).json({message: "User unfollower", currentUser, userToUnfollow})
})

//CREARE UNA NUOVA PLAYLIST
router.post("/:id/playlists", readFileMiddleware, ({params: {id}, body: {name}}: Request, res:Response) => {
    const currentUser = listOfUsers.find((user: User) => user.id === id)
    if(!currentUser) return res.status(404).json({error: "User not found"})
    const playlistId: string = "P" + Date.now().toString();
    currentUser.playlist.push(new Playlist(playlistId, name))
    writeToFile()
    return res.status(201).json({message: "playlist created", playlistId})
})

//ELIMINARE UNA PLAYLIST
router.delete("/:id/playlists", readFileMiddleware, ({params:{id}, body:{playlistId}}: Request, res:Response) => {
    const currentUser = listOfUsers.find((user: User) => user.id === id)
    if(!currentUser) return res.status(404).json({error: "User not found"})
    const playlistIndex = currentUser.playlist.findIndex((playlist: Playlist) => playlist.id === playlistId)
    if(playlistIndex === -1) return res.status(404).json({error: "Playlist not found"})
    currentUser.playlist.splice(playlistIndex, 1)
    writeToFile()
    return res.status(201).json({message: "Playlist removed"})
})

//AGGIUNGI CANZONE A PLAYLIST
router.put("/:id/playlists/:idPlaylist/", readSongsFileMiddleware, body("songId").notEmpty().isString(), handleErrors, ({params:{id, idPlaylist},body:{songId}}:Request,res:Response) => {
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

//RIMUOVI SONG DA PLAYLIST
router.delete("/:id/playlists/:idPlaylist/", body("songId").notEmpty().isString(), handleErrors, ({params:{ id, idPlaylist },body:{ songId } }:Request, res:Response) => {
    const currentUser = listOfUsers.find((user:User) => user.id === id)
    if(!currentUser) return res.status(404).json({error: "User not found"})
    const playlist = currentUser.playlist.find((playlist: Playlist) => playlist.id === idPlaylist)
    if(!playlist) return res.status(404).json({error: "Playlist not found"})
    const songIndex = playlist.songs.findIndex((song) => song.id === songId)
    if(!songIndex) return res.status(404).json({error: "Song not found"})
    currentUser.playlist.find((playlist: Playlist) => playlist.id === idPlaylist)?.songs.splice(songIndex, 1);
    writeToFile()
    return res.status(201).json({message: `Song deleted from playlist titled ${playlist.title}`})

})

export {router as users }
