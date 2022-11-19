import { Router } from "express";
import { ensureAuthenticated } from "../../middlewares/auth/ensureAuthenticated";
import { cashOutStory } from "../../stories/transactionStories/cashOutStory";
import { getAllCashOutByUserStory } from "../../stories/transactionStories/getAllCashOutByUserStory";

export const transactionRouter = Router();

transactionRouter.get("/", (req, res) => {
  res.json({ message: "Rota das transações" });
});

transactionRouter.post("/", ensureAuthenticated, cashOutStory);

transactionRouter.post("/me", ensureAuthenticated, getAllCashOutByUserStory);
