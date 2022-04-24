import express from "express";

import {
    getTournament,
    createTournament,
    createTournamentRound,
    getTournamentById,
    updateMatchByID,
} from "../controllers/TournamentManager.js";

const router = express.Router();

router.get("/get/all", getTournament);
router.post("/new/round", createTournamentRound);
router.post("/new", createTournament);
router.get("/:id", getTournamentById);
router.patch("/update/match/:tID/:mID", updateMatchByID);

export default router;