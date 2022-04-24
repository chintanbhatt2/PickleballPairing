import axios from "axios";
import { IMatch, ITournament } from "../types/MongooseTypes";

const url = process.env.DB_URL + "/tournament";

export const getTournaments = () => axios.get(`${url}/get/all`);
export const updateMatch = (
  matchID: string,
  tournamentID: string,
  match: IMatch
) => axios.patch(`${url}/update/match/${tournamentID}/${matchID}`, match);
export const newTournament = (tournament: ITournament) =>
  axios.post(`${url}/new`, tournament);
export const newTournamentRound = (tournament: ITournament, singles: boolean) =>
  axios.post(`${url}/new/round`, {
    Tournament: tournament,
    AllowSingles: singles,
  });
