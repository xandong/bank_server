import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export async function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authToken = req.headers.authorization;

  if (!authToken) return res.status(401).json({ message: "Não autenticado." });

  const token = authToken.split(" ")[1];

  try {
    verify(token, process.env.KEY!);

    return next();
  } catch (err) {
    res.status(403).json({ message: "Não autorizado." });
  }
}
