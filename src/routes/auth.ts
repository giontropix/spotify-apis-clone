import express from "express";
import { body, header, validationResult } from "express-validator";
import redis from "redis";
import bluebird from "bluebird";
import hash from "string-hash";
import { TokenGenerator, TokenBase } from 'ts-token-generator';
import { User } from "../models/User";

const router = express.Router();
const client: any = bluebird.promisifyAll(redis.createClient());
const tokgen = new TokenGenerator({bitSize: 512, baseEncoding: TokenBase.BASE62});

export const handleErrors = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors);
    else next();
};

router.post("/register/", body("mail").exists().isEmail().normalizeEmail(), body("user_name").exists().notEmpty().isString().trim().escape(), body("password").exists().isString().isLength({ min: 4 }), handleErrors, async ({ body: { mail, user_name, password } }, res) => {
    if(await client.hgetallAsync(mail) !== null) return res.status(403).json({error: "user already exists"})
    const newUser: User = new User(user_name, hash(password).toString());
    client.hmset(mail, {"user_name": newUser.getUser_name(), "user_password": newUser.getPassword(), "data": JSON.stringify({"playlist": newUser.getFollowers(), "follower": newUser.getFollowers(), "following": newUser.getFollowing()})})
    return res.status(201).json({ message: "user successfully registered", user: {user_name, mail} });
});

router.get("/login/", header("mail").exists().isEmail().normalizeEmail(), header("password").notEmpty().isString(), handleErrors, async ({headers: {token = "", mail, password} }, res) => {
    if(await client.getAsync(token) !== null) return res.status(400).json({error: "user already logged"})
    const {user_name, user_password, data} = await client.hgetallAsync(mail);
    const {playlist, follower, following} = JSON.parse(data);
    const user: User = new User(user_name, user_password, playlist, follower, following);
    if(user === null) return res.status(404).json({error: "user not found"})
    if(user.getPassword() !== hash(password as string).toString()) return res.status(401).json({error: "Invalid password"})
    const accessToken = tokgen.generate();
    client.set(accessToken, JSON.stringify(mail), 'EX', 86400, redis.print);
    const refreshToken = tokgen.generate();
    client.set(refreshToken, JSON.stringify(mail), 'EX', 86400*7, redis.print);
    return res.status(201).json({ message: "login done", mail, user_name: user.getUser_name(), accessToken, refreshToken })
})

router.delete("/logout/", async ({ headers: { access_token, refresh_token } }, res) =>{
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
