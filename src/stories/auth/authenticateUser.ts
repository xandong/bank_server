import { Request, Response } from "express";
import { UserModel } from "../../models/UserModel";
import { prisma } from "../../services/prisma";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

export async function AuthenticateUser(req: Request, res: Response) {
  const { username, password }: UserModel = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Campos obrigatórios" });

  try {
    const userSearched = await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        password: true,
        account: {
          select: {
            id: true,
            balanceInCents: true,
            creditedAccounts: true,
            debitedAccounts: true,
          },
        },
      },
    });

    if (!userSearched) {
      return res.status(400).json({ message: "Credenciais incorretas" });
    }

    const passwordMatch = await compare(password, userSearched.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Credenciais incorretas" });
    }

    const key = process.env.KEY!;

    const token = sign({}, key, {
      subject: userSearched.id,
      expiresIn: "1d",
    });

    return res.status(200).json({
      token,
      user: {
        id: userSearched.id,
        username: userSearched.username,
        account: {
          id: userSearched.account?.id,
          balanceInCents: userSearched.account?.balanceInCents,
          creditedAccounts: userSearched.account?.creditedAccounts,
          debitedAccounts: userSearched.account?.debitedAccounts,
        },
      },
    });
  } catch (error) {
    return res.status(502).json({ message: "Erro externo. Tente novamente." });
  }
}
