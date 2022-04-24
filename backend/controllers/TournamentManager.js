import { Tournament } from "../schemas/tournament.js";
import { CreateNewRound } from "../Logic.js";

export const getTournamentById = async(req, res) => {
    console.log("getting tournament");
    try {
        const retTournament = await Tournament.findById(req.params.id);
        res.status(200).json(retTournament);
    } catch (err) {
        res.status(404).json({ message: err.message });
        console.log(err);
    }
};

export const getTournament = async(req, res) => {
    try {
        const retTournament = await Tournament.find();
        res.status(200).json(retTournament);
    } catch (err) {
        res.status(404).json({ message: err.message });
        console.log(err);
    }
};

export const createTournament = async(req, res) => {
    try {
        const tournament = req.body;
        delete tournament._id;
        let newTournament = await Tournament.create(tournament);
        res.status(201).json(newTournament);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

export const updateMatchByID = async(req, res) => {
    console.log("Body : ", req.body);
    try {
        const retTournament = await Tournament.findById(req.params.tID);
        var retMatch = retTournament.Matches.id(req.params.mID);
        console.log(retMatch);
        retMatch.Players = req.body.Players;
        retMatch.Score = req.body.Score;
        retMatch.Winner = req.body.Winner;
        console.log(retMatch);
        await retTournament.save();
        res.status(200).json(retMatch);
    } catch (err) {
        res.status(404).json({ message: err.message });
        console.log(err);
    }
};

export const createTournamentRound = async(req, res) => {
    try {
        const tournament = req.body.Tournament;
        const allowSingles = req.body.AllowSingles;
        const rounds = CreateNewRound(tournament, undefined, allowSingles);
        const addTournament = await Tournament.findById(tournament._id);
        addTournament.Matches = [...addTournament.Matches, ...rounds.Matches];
        addTournament.ActivePlayers = tournament.ActivePlayers;
        addTournament.save();
        res.status(200).json(rounds);
    } catch (err) {
        res.status(400).json({ message: err });
        console.log(err);
    }
};