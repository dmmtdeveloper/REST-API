import express from "express"
import {register} from "../controllers/register"
import { login } from "../controllers/login"

export default (router: express.Router) => {
    router.post("/auth/register", register)
    router.post("/auth/login", login)
}