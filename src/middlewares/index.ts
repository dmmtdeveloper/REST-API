import express from "express"
import { getUserBySessionToken } from "../controllers/actions";
import { get , merge } from "lodash";

export const isOwner = async(req:express.Request, res:express.Response, next:express.NextFunction) => {
    try {
        const {id} = req.params;
        const currentId = get(req, "identity._id") as string;

        if(!currentId){
            return res.sendStatus(403);
        }

        if(currentId.toString() !== id){
            return res.sendStatus(403);
        }
        return next();
    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
} 

export const isAuthenticated = async(req:express.Request, res:express.Response, next:express.NextFunction) => {
    try {
        //Extraer la cookie del usuario
        const sessionToken = req.cookies["USER-COOKIE"]
        if(!sessionToken){
            return res.sendStatus(403);
        }

        //validar token de usuario
        const existingUser = await getUserBySessionToken(sessionToken);
        if(!existingUser){
            return res.sendStatus(403);
        }

        //guardar token de usuario en la request
        merge(req, {identity:existingUser});
        return next()
    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}
