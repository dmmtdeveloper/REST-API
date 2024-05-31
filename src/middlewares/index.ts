import { getUserBySessionToken } from "../controllers/actions";
import express, { NextFunction } from "express"
import { get, identity, merge } from "lodash"

export const isAuthenticated = async(req:express.Request, res:express.Response, next:NextFunction) => {
  try {
    // Verificar token de sesion
    const sessionToken = req.cookies["USER-COOKIE"];
    if(!sessionToken){
      return res.sendStatus(403);
    }

    //Vereficar token de usuario
    const userToken = await getUserBySessionToken(sessionToken);
    if(!userToken){
      return res.sendStatus(403);
    }

    //Guardar los datos del usurio en la request
    merge(req, {identity:userToken});
    return next();

  } catch (error) {
    return res.sendStatus(400);
  }
}