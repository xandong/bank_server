import { Request, Response } from "express";
import { prisma } from "../../services/prisma";

import { verify } from "jsonwebtoken";

export interface ICashOut {
  to: string;
  valueInCents: number;
}

export async function cashOutStory(req: Request, res: Response) {
  const { to, valueInCents }: ICashOut = req.body;

  if (!to || !valueInCents)
    return res
      .status(400)
      .json({ message: "Destinatário e valor são obrigatórios" });

  const authToken = req.headers.authorization;

  const token = authToken!.split(" ")[1];

  const { sub } = verify(token, process.env.KEY!);

  const id = `${sub}`;

  if (valueInCents < 1)
    return res.status(400).json({ message: "Operação inválida" });

  try {
    const fromUser = await prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        username: true,
        account: {
          select: {
            id: true,
            balanceInCents: true,
          },
        },
      },
    });

    if (fromUser?.username === to)
      return res.status(400).json({ message: "Não pode transferir para si" });

    if (fromUser?.account?.balanceInCents! < valueInCents)
      return res.status(400).json({ message: "Saldo insuficiente" });

    const toUser = await prisma.user.findFirst({
      where: {
        username: to,
      },
      select: {
        account: {
          select: {
            id: true,
            balanceInCents: true,
          },
        },
      },
    });

    if (!toUser)
      return res.status(400).json({ message: "Destinatário não encontrado" });

    try {
      const debited = await prisma.user.update({
        where: { username: fromUser?.username },
        data: {
          account: {
            update: {
              balanceInCents: fromUser?.account?.balanceInCents! - valueInCents,
            },
          },
        },
        select: {
          account: {
            select: { balanceInCents: true },
          },
        },
      });

      const credited = await prisma.user.update({
        where: { username: to },
        data: {
          account: {
            update: {
              balanceInCents: toUser?.account?.balanceInCents! + valueInCents,
            },
          },
        },
        select: {
          account: {
            select: { balanceInCents: true },
          },
        },
      });

      if (
        debited.account?.balanceInCents! + valueInCents ===
          fromUser?.account?.balanceInCents &&
        credited.account?.balanceInCents! - valueInCents ===
          toUser.account?.balanceInCents
      ) {
        try {
          const data = new Date().toISOString();

          const transactionSuccess = await prisma.transaction.create({
            data: {
              createdAt: data,
              valueInCents: valueInCents,
              debitedAccountId: fromUser.account.id,
              creditedAccountId: toUser.account.id,
            },
          });

          return res.status(200).json({
            newBalanceInCents: debited.account?.balanceInCents,
            transaction: {
              id: transactionSuccess.id,
              createdAt: transactionSuccess.createdAt,
              valueInCents: transactionSuccess.valueInCents,
            },
          });
        } catch (error) {
          const data = new Date().toISOString();
          const transactionSuccess = await prisma.transaction.create({
            data: {
              createdAt: data,
              valueInCents: valueInCents,
              debitedAccountId: fromUser.account.id,
              creditedAccountId: toUser.account.id,
            },
          });

          return res.status(200).json({
            newBalanceInCents: debited.account?.balanceInCents,
            transaction: transactionSuccess,
          });
        }
      } else {
        try {
          await prisma.user.update({
            where: { username: fromUser?.username },
            data: {
              account: {
                update: {
                  balanceInCents: fromUser?.account?.balanceInCents!,
                },
              },
            },
          });

          await prisma.user.update({
            where: { username: to },
            data: {
              account: {
                update: {
                  balanceInCents: toUser?.account?.balanceInCents,
                },
              },
            },
          });
        } catch (error) {
          await prisma.user.update({
            where: { id },
            data: {
              account: {
                update: {
                  balanceInCents: fromUser?.account?.balanceInCents!,
                },
              },
            },
          });

          await prisma.user.update({
            where: { username: to },
            data: {
              account: {
                update: {
                  balanceInCents: toUser?.account?.balanceInCents,
                },
              },
            },
          });
        }
      }
    } catch (error) {}
  } catch (error) {
    return res
      .status(500)
      .json({ message: "A operação falhou. Tente novamente" });
  }
}
