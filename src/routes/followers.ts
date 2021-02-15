//SEGUIRE UN UTENTE
import {body} from "express-validator";
import {handleErrors} from "../utils/apisHelpers";
import express, {Request, Response} from "express";
import {listOfUsers, writeToFile} from "../utils/manageUsersFromJSON";
import {User} from "../models/User";
import {Follower} from "../models/Follower";

const router = express.Router({mergeParams: true});

router.put("/followings", body('userIdToFollow').exists().isString(), handleErrors, ({body: {userIdToFollow}, params:{id}}, res: Response) => {
    const currentUser = listOfUsers.find((user: User) => user.id === id)
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

//VEDERE CHI SEGUE UN UTENTE
router.get("/followings", ({params: {id}}: Request, res:Response) => {
    const currentUser = listOfUsers.find((user: User) => user.id === id)
    if(!currentUser) return res.status(404).json({error: "User not found"})
    return res.status(200).json(currentUser.following);
})

//VEDERE DA CHI E' SEGUITO UN UTENTE
router.get("/followers", ({params: {id}}: Request, res:Response) => {
    const currentUser = listOfUsers.find((user: User) => user.id === id)
    if(!currentUser) return res.status(404).json({error: "User not found"})
    return res.status(200).json(currentUser.followers);
})

//SMETTERE DI SEGUIRE UN UTENTE
router.delete("/followings", body('userIdToUnfollow').exists().isString(), handleErrors, ({body: {userIdToUnfollow}, params:{id}}:Request, res: Response) => {
    const currentUser = listOfUsers.find((user: User) => user.id === id)
    if(!currentUser) return res.status(404).json({error: "User not found"})
    const userToUnfollow = listOfUsers.find((user: User) => user.id === userIdToUnfollow)
    if(!userToUnfollow) return res.status(404).json({error: "User to unfollow not found"})
    const userToUnfollowIndex = currentUser.following.findIndex((user: Follower) => user.id === userIdToUnfollow)
    if(userToUnfollowIndex === -1) return res.status(404).json({error: "User to unfollow not found"})
    const currentUserIndex = userToUnfollow.followers.findIndex((user: Follower) => user.id === id)
    if(currentUserIndex === -1) return res.status(404).json({error: "User not found"})
    currentUser.following.splice(userToUnfollowIndex, 1)
    userToUnfollow.followers.splice(currentUserIndex, 1)
    writeToFile()
    return res.status(201).json({message: "User unfollower", currentUser, userToUnfollow})
})

export {router as followers}
