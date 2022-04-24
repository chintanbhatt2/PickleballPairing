import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import tournamentRoutes from "./routes/TournamentManager.js";
import playerRoutes from "./routes/PlayerManager.js";
import dotenv from "dotenv";
import https from "https";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_CONNECTION_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() =>
        app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
    )
    .catch((error) => console.log(error.message));

app.use(cors());

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use("/tournament", tournamentRoutes);
app.use("/players", playerRoutes);