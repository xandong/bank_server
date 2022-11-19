import { Request, Response } from "express";
import { hash } from "bcrypt";

import { UserModel } from "../../models/UserModel";
import { prisma } from "../../services/prisma";

export async function createUserStory(req: Request, res: Response) {
  const { username, password }: UserModel = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Campos obrigatórios" });

  if (username.length < 3)
    return res.status(400).json({ message: "Usuário mínimo 3 caracteres" });

  if (password.length < 8)
    return res.status(400).json({ message: "Senha mínima 8 caracteres" });

  const patternNumber = /[0-9]/;
  const patternUpper = /[A-Z]/;

  if (!(patternNumber.test(password) && patternUpper.test(password)))
    return res.status(400).json({
      message: "A senha deve conter pelo menos um número e uma letra maiúscula",
    });

  try {
    const isUsernameUnique = await prisma.user.findFirst({
      where: { username },
    });

    if (isUsernameUnique)
      return res.status(400).json({ message: "Usuário já existente" });
  } catch (error) {
    return res.status(500);
  }

  const pwdHash = await hash(password, 8);

  try {
    await prisma.user.create({
      data: {
        username,
        password: pwdHash,
        account: {
          create: {
            balanceInCents: 100,
          },
        },
      },
    });

    return res.status(201).json({ message: "Usuário criado com sucesso" });
  } catch (error) {
    return res.status(500);
  }
}
