import {validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";
import bluebird from "bluebird";
import redis from "redis";
import {TokenBase, TokenGenerator} from "ts-token-generator";

const client: any = bluebird.promisifyAll(redis.createClient());
const tokgen = new TokenGenerator({bitSize: 512, baseEncoding: TokenBase.BASE62});

export const handleErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors);
    else next();
};

export const checkExpiredToken = async ({headers: {accessToken, refreshToken}}: Request, res: Response, next: NextFunction) => {
    if (accessToken && await client.getAsync(accessToken) === null) {
        if (refreshToken) {
            const mail = await client.getAsync(refreshToken) === null
            if (mail) {
                accessToken = tokgen.generate();
                client.set(accessToken, JSON.stringify(mail), 'EX', 86400);
                refreshToken = tokgen.generate()
                client.set(refreshToken, JSON.stringify(mail), 'EX', 86400*7);
            }
        } else return res.status(401).json({error: "User must be logged to see products list"});
    }
    next();
}
