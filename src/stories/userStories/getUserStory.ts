import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { prisma } from "../../services/prisma";

export async function getUserStory(req: Request, res: Response) {
  const authToken = req.headers.authorization;

  const token = authToken!.split(" ")[1];

  const { sub } = verify(token, process.env.KEY!);

  const id = `${sub}`;

  try {
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        username: true,
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

    if (!user) return res.status(404);

    return res.json({ user });
  } catch (error) {
    return res.status(500);
  }
}
