import express from "express"
import { getUser } from "../controllers/actions"

export const getAllUsers = async(req:express.Request, res:express.Response) => {
    try {
        const users = await getUser();
        if(!users){
            return res.sendStatus(400);
        };

        res.status(200).json(users).end();
    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}