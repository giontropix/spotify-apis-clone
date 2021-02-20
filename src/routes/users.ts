import express, {Request, Response} from "express";
import {listOfUsers, readFileMiddleware, writeToFile} from "../utils/manageUsersFromJSON";
import {User} from "../models/User";
import {playlists} from "./playlists";
import {followers} from "./followers";

const router = express.Router({mergeParams: true});

router.use("/:id/playlists", playlists)
router.use("/:id", followers)

router.get("/", (_: Request, res: Response) => res.status(200).json(listOfUsers))

router.get("/:id", ({params: {id}}, res: Response) => {
    const user = listOfUsers.find((user: User) => user.id === id)
    !user && res.status(404).json({error: "User not found"})
    res.status(200).json(user);
})

export {router as users }
