import express, {Request, Response} from "express";
import {body, header} from "express-validator";
import redis from "redis";
import bluebird from "bluebird";
import hash from "string-hash";
import {TokenBase, TokenGenerator} from 'ts-token-generator';
import {listOfUsers, readFileMiddleware, writeToFile} from "../utils/manageUsersFromJSON";
import {User} from "../models/User";
import {handleErrors} from "../utils/apisHelpers";

const router = express.Router();
const client: any = bluebird.promisifyAll(redis.createClient());
const tokgen = new TokenGenerator({bitSize: 512, baseEncoding: TokenBase.BASE62});

router.post("/register/", readFileMiddleware, body("mail").isEmail().normalizeEmail(), body("user_name").notEmpty().isString().trim().escape(), body("password").exists().isString().isLength({ min: 4 }), handleErrors, async ({ body: { mail, user_name, password } }, res) => {
    if(await client.hgetallAsync(mail) !== null) return res.status(403).json({error: "user already exists"})
    const newUser = new User(`U${Date.now()}`, user_name, mail)
    client.hmset(mail, {"user_password": hash(password), "id": newUser.id})
    listOfUsers.push(newUser)
    writeToFile()
    return res.status(201).json({ message: "user successfully registered", user_name, mail });
});

router.get("/login/", readFileMiddleware, header("mail").isEmail().normalizeEmail(), header("password").notEmpty().isString(), handleErrors, async ({headers: {token = "", mail, password} }, res) => {
    if(await client.getAsync(token) !== null) return res.status(400).json({error: "user already logged"})
    const user = await client.hgetallAsync(mail);
    if(user === null) return res.status(404).json({error: "user not found"})
    const {user_password, id} = user;
    if(user_password !== hash(password as string).toString()) return res.status(401).json({error: "Invalid password"})
    const access_token = tokgen.generate();
    client.set(access_token, JSON.stringify(mail), 'EX', 86400, redis.print);
    const refresh_token = tokgen.generate();
    client.set(refresh_token, JSON.stringify(mail), 'EX', 86400*7, redis.print);
    return res.status(201).json({ message: "login done", id, access_token, refresh_token })
})

router.delete("/logout", readFileMiddleware, header("access_token").notEmpty().isString(), header("refresh_token").notEmpty().isString(), async ({ headers: { access_token, refresh_token } }: Request, res: Response) =>{
    let mail = JSON.parse(await client.getAsync(access_token))
    if(mail === null) {
        mail = JSON.parse(await client.getAsync(refresh_token))
        if(mail === null) return res.status(400).json({error: "user not logged"}) 
    }
    client.del(access_token)
    client.del(refresh_token)
    return res.status(201).json({message: "logout done"})
    })

export {router as auth}
