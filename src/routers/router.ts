import { Router } from "express";
import { AuthenticateUser } from "../stories/auth/authenticateUser";
import { accountRouter } from "./account";
import { transactionRouter } from "./transaction";
import { userRouter } from "./user";

export const router = Router();

router.get("/", (req, res) => {
  res.json(
    "Bem vindo a API NG! Mereço uma carteira e cartão da NG por essa aplicação! haha"
  );
});

router.post("/auth", AuthenticateUser);

router.use("/users", userRouter);
router.use("/accounts", accountRouter);
router.use("/transactions", transactionRouter);
