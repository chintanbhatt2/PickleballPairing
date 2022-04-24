import { ITournament } from "../../types/MongooseTypes";
import * as types from "./TournamentTypes";

interface ITState {
  All: ITournament[];
  Active?: ITournament;
}

export const TournamentReducer = (
  tournaments: ITState = { All: [] },
  action: any
) => {
  switch (action.type) {
    case types.GET_ALL:
      return { ...tournaments, All: [...tournaments.All, ...action.payload] };
    case types.SET_ACTIVE:
      return { ...tournaments, Active: action.payload };
    case types.NEW:
      return { ...tournaments, All: [...tournaments.All, action.payload] };
    case types.NEW_ROUND:
      let retObj = { ...tournaments };
      if (retObj.Active) {
        if (retObj.Active.Matches) {
          retObj.Active.Matches = [...retObj.Active.Matches, ...action.payload];
        }
      }
      console.log(retObj);
      return retObj;
    case types.UPDATE_ELO:
      let retTourn = tournaments.Active;
      if (retTourn) {
        const retPlayer = retTourn.ActivePlayers.find(
          (p) => p._id === action.payload._id
        );
        if (retPlayer) {
          retPlayer.Elo = action.payload.Elo;
        }
      }
      return { ...tournaments, Active: retTourn };

    default:
      return tournaments;
  }
};
