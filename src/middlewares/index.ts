import { getUserBySessionToken } from "controllers/actions";
import express from "express";
import { get, identity, merge } from "lodash";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    // Verificar token
    const sessionToken = req.cookies["USER-COOKIE"];
    if (!sessionToken) {
      return res.sendStatus(403);
    }

    //Verificar token de usuario
    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) {
      return res.sendStatus(403);
    }

    //Agregar token de usuario a al solicitud
    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(200);
  }
};
