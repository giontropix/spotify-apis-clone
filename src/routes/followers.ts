//SEGUIRE UN UTENTE
import {body} from "express-validator";
import {handleErrors} from "../utils/apisHelpers";
import express, {Request, Response} from "express";
import {listOfUsers, writeToFile} from "../utils/manageUsersFromJSON";
import {User} from "../models/User";
import {Follower} from "../models/Follower";

const router = express.Router({mergeParams: true});

//AGGIUNGERE USER TRA I FOLLOWED
router.put("/followed", body('userIdToFollow').isString().notEmpty(), handleErrors, ({body: {userIdToFollow}, params:{id}}, res: Response) => {
    const currentUser = listOfUsers.find((user: User) => user.id === id)
    if(!currentUser) return res.status(404).json({error: "User not found"})
    const userToFollow = listOfUsers.find((user: User) => user.id === userIdToFollow)
    if(!userToFollow) return res.status(404).json({error: "User to follow not found"})
    if(userToFollow === currentUser) return res.status(403).json({error: "You can't follow yourself!"})
    if(currentUser.followed.find((item: Follower) => item.id === userToFollow.id))
        return res.status(403).json({error: "User already followed"})
    currentUser.followed.push(new Follower(userToFollow.id, userToFollow.user_name))
    userToFollow.followers.push(new Follower(currentUser.id, currentUser.user_name))
    writeToFile()
    res.status(201).json({message: "User followed", currentUser, userToFollow})
})

//VEDERE CHI SEGUE UN UTENTE
router.get("/followed", ({params: {id}, query: {offset, limit}}: Request, res:Response) => {
    const currentUser = listOfUsers.find((user: User) => user.id === id)
    if(!currentUser) return res.status(404).json({error: "User not found"})
    if(offset && limit) return res.status(200).json(currentUser.followed.slice(Number(offset), Number(offset) + Number(limit)))
    return res.status(200).json(currentUser.followed);
})

//VEDERE DA CHI E' SEGUITO UN UTENTE
router.get("/followers", ({params: {id}, query: {offset, limit}}: Request, res:Response) => {
    const currentUser = listOfUsers.find((user: User) => user.id === id)
    if(!currentUser) return res.status(404).json({error: "User not found"})
    if(offset && limit) return res.status(200).json(currentUser.followers.slice(Number(offset), Number(offset) + Number(limit)))
    return res.status(200).json(currentUser.followers);
})

//SMETTERE DI SEGUIRE UN UTENTE
router.delete("/followed/:userIdToUnfollow", ({params:{id, userIdToUnfollow}}:Request, res: Response) => {
    const currentUser = listOfUsers.find((user: User) => user.id === id)
    if(!currentUser) return res.status(404).json({error: "User not found"})
    const userToUnfollow = listOfUsers.find((user: User) => user.id === userIdToUnfollow)
    if(!userToUnfollow) return res.status(404).json({error: "User to unfollow not found"})
    const userToUnfollowIndex = currentUser.followed.findIndex((user: Follower) => user.id === userIdToUnfollow)
    if(userToUnfollowIndex === -1) return res.status(404).json({error: "User to unfollow not found"})
    const currentUserIndex = userToUnfollow.followers.findIndex((user: Follower) => user.id === id)
    if(currentUserIndex === -1) return res.status(404).json({error: "User index not found"})
    currentUser.followed.splice(userToUnfollowIndex, 1)
    userToUnfollow.followers.splice(currentUserIndex, 1)
    writeToFile()
    return res.status(201).json({message: "User unfollowed", currentUser, userToUnfollow})
})

//SMETTERE DI FARSI SEGUIRE DA UN UTENTE
router.delete("/followers/:userIdToUnfollow", ({params:{id, userIdToUnfollow}}:Request, res: Response) => {
    const currentUser = listOfUsers.find((user: User) => user.id === id)
    if(!currentUser) return res.status(404).json({error: "User not found"})
    const userToBlock = listOfUsers.find((user: User) => user.id === userIdToUnfollow)
    if(!userToBlock) return res.status(404).json({error: "User to block not found"})
    const userToBlockIndex = currentUser.followers.findIndex((user: Follower) => user.id === userIdToUnfollow)
    if(userToBlockIndex === -1) return res.status(404).json({error: "User to block not found"})
    const currentUserIndex = userToBlock.followed.findIndex((user: Follower) => user.id === id)
    if(currentUserIndex === -1) return res.status(404).json({error: "User not found"})
    currentUser.followers.splice(userToBlockIndex, 1)
    userToBlock.followed.splice(currentUserIndex, 1)
    writeToFile()
    return res.status(201).json({message: "User blocked", currentUser, userToBlock})
})

export {router as followers}
