import axios from "axios";
import { IPlayer } from "../types/MongooseTypes";

const url = process.env.DB_URL + "/players";

export const updatePlayer = (player: IPlayer) =>
  axios.patch(`${url}/update/${player._id}`, player);
export const getAllPlayers = () => axios.get(`${url}/get/all`);
export const newPlayer = (player: IPlayer) => axios.post(`${url}/new`, player);
