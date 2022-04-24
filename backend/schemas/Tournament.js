import mongoose from "mongoose";
import { matchScheme } from "./Match.js";
import { playerSchema } from "./Player.js";


const tournamentScheme = new mongoose.Schema({
        Name: String,
        ActivePlayers: [playerSchema],
        Matches: [matchScheme],
        Date: Date
    }, { collection: "Tournaments" }

)

export const Tournament = mongoose.model("Tournament", tournamentScheme)