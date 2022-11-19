import express, { json } from "express";
import { router } from "./routers/router";
import cors from "cors";

const PORT = 3333;
const colorGreen = "\u001b[32m";

const app = express();

app.use(json());
app.use(cors());
app.use(router);

app.listen(PORT, () => {
  console.log(colorGreen + `\nServer running: http://localhost:${PORT}`);
});
