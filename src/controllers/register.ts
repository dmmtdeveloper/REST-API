import express from "express";
import { createUser, getUserByEmail } from "../controllers/actions";
import { authentication, random } from "../helpers/index";

export const register = async (req: express.Request, res: express.Response) => {
  try {
    // Verificar que le usuario rellene los campos
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.sendStatus(400);
    }

    //verificar que el email ingresado no exista
    const existingEmail = await getUserByEmail(email);
    if (existingEmail) {
      res.sendStatus(400);
    }

    //registrat el usuario y guardar sus datos
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
    return res.sendStatus(400);
  }
};
