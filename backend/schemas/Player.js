import mongoose from "mongoose";


export const playerSchema = mongoose.Schema({
    Name: String,
    Elo: Number,
    GamesPlayed: 0
}, { collection: "Players" })



export const Player = mongoose.model("Player", playerSchema)