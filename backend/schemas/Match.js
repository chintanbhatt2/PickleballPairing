import mongoose from "mongoose";
import { playerSchema } from "./Player.js";

export const matchScheme = new mongoose.Schema({
    Players: [{
            Team: { type: Number, default: 1 },
            Player: playerSchema
        },
        {
            Team: { type: Number, default: 1 },
            Player: playerSchema
        },
        {
            Team: { type: Number, default: 2 },
            Player: playerSchema
        },
        {
            Team: { type: Number, default: 2 },
            Player: playerSchema
        },
    ],
    Score: [{
            Points: Number,
            Team: Number,
            _id: false
        },
        {
            Points: Number,
            Team: Number,
            _id: false
        }

    ],
    Winner: { type: Number, default: 0 }
}, { collection: 'Matches' })


export const Match = mongoose.model("Match", matchScheme)