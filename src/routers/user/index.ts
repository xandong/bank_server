import { Router } from "express";
import { ensureAuthenticated } from "../../middlewares/auth/ensureAuthenticated";
import { createUserStory } from "../../stories/userStories/createUserStory";
import { getUserStory } from "../../stories/userStories/getUserStory";

export const userRouter = Router();

userRouter.get("/", (req, res) => {
  res.json({ message: "Rota do usuário" });
});

userRouter.post("/", createUserStory);

userRouter.get("/revalidate", ensureAuthenticated, getUserStory);
