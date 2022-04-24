import { Player } from "../schemas/Player.js";

export const updatePlayer = async(req, res) => {
    try {
        const retPlayer = await Player.findById(req.params.id);
        retPlayer.Name = req.body.Name;
        retPlayer.Elo = req.body.Elo;
        retPlayer.GamesPlayed = req.body.GamesPlayed;
        await retPlayer.save();
        res.status(200).json(retPlayer);
    } catch (error) {
        res.status(404).json({ message: error.message });
        console.log(error);
    }
};

export const getAllPlayers = async(req, res) => {
    try {
        const Players = await Player.find();
        res.status(200).json(Players);
    } catch (error) {
        res.status(400).json({ message: error });
        console.log(error);
    }
};

export const createNewPlayer = async(req, res) => {
    try {
        console.log(req.body);
        let player = req.body;
        delete player._id;
        const p = await Player.create(player);
        res.status(200).json(p);
    } catch (error) {
        res.status(400).json({ message: error });
        console.log(error);
    }
};