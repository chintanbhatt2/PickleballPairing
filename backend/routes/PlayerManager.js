// {url}/players

import express from "express";
import {
    updatePlayer,
    getAllPlayers,
    createNewPlayer,
} from "../controllers/PlayerManager.js";

const router = express.Router();

router.patch("/update/:id", updatePlayer);
router.get("/get/all", getAllPlayers);
router.post("/new", createNewPlayer);
export default router;