import express from "express";
import { getUserByEmail } from "./actions";
import { authentication, random } from "../helpers/index";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    //verificar que el usuario rellene los campos
    const { email, password } = req.body;
    if (!email || !password) {
      return res.sendStatus(400);
    }

    //Comprobar que el email coincida con el email de registro
    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );
    if (!user) {
      return res.sendStatus(400);
    }

    //Comprobar que la contraseña coincida con la contraseña de registro
    const exactedHash = authentication (user.authentication.salt, password);
    if (user.authentication.password !== exactedHash) {
      return res.status(400).json("hubo un error en exactedhash");
    }

    //Crear y guardar un token de sesion del usuario y convinarlo con su id
    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();

    //Configurar el token
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
