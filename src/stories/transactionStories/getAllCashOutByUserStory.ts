import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { prisma } from "../../services/prisma";

export async function getAllCashOutByUserStory(req: Request, res: Response) {
  const authToken = req.headers.authorization;

  const token = authToken!.split(" ")[1];

  const { sub } = verify(token, process.env.KEY!);

  const id = `${sub}`;

  const anoCurrent = new Date().getFullYear();

  const { mes, ano = anoCurrent } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        accountId: true,
      },
    });

    const accountId = user?.accountId;

    const data = await prisma.transaction.findMany({
      where: {
        debitedAccountId: accountId!,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        creditedAccount: {
          select: {
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    if (mes) {
      const dataFilter = data.filter((e) => e.createdAt.getMonth() === mes);
      return res.json(dataFilter);
    }

    return res.json(data);
  } catch (error) {}

  if (mes) {
    return res.json({
      message: `esses são os resultados do mês ${mes} de ${ano}`,
    });
  }
  return res.json({ message: "Todos os resultados" });
}
