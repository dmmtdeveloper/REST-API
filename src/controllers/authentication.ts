import express from "express";
import { createUser, getUserByEmail } from "./actions";
import { random, authentication } from "../helpers/index";

export const register = async (req: express.Request, res: express.Response) => {
  try {
    //Verificar que el usuario rellene los campos
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.sendStatus(400);
    }

    //Validar correo de usuario
    const userEmail = await getUserByEmail(email);
    if (userEmail) {
      return res.sendStatus(400);
    }

    //registrar usuario
    const salt = random();
    const user = await createUser({
      username,
      email,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};



export const login = async (req: express.Request, res: express.Response) => {
  try {
    //verificar relleno de los campos
    const { email, password } = req.body;
    if (!email || !password) {
      return res.sendStatus(400);
    }

    //Validar email con el registrado
    const user = await getUserByEmail(email).select(
      "+authentication.salt + authentication.password"
    );
    if (!user) {
      return res.sendStatus(400);
    }

    // validar password con la registrada
    const exactedHash = authentication(user.authentication.salt, password);
    if (user.authentication.password !== exactedHash) {
      return res.sendStatus(403);
    }

    //crear token de sesion convinarlo con el id del usuario y guardarlo
    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();

    //configurar token
    res.cookie("USER-COOKIE", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};