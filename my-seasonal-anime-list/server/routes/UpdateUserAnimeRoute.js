import express from "express";
import updateUserAnime from "../controllers/UpdateUserAnimeController.js";

const updateUserAnimeRouter = express.Router();
updateUserAnimeRouter.patch("/update-anime/:id", updateUserAnime);

export default updateUserAnimeRouter;