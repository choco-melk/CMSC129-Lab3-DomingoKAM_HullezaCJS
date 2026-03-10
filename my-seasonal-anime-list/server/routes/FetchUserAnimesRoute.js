import express from "express";
import getAllAnimes from "../controllers/FetchUserAnimesController.js";

const fetchUserAnimeRouter = express.Router();
fetchUserAnimeRouter.get("/anime-list", getAllAnimes);

export default fetchUserAnimeRouter;