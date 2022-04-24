import * as types from "./PlayerTypes";
import { IPlayer } from "../../types/MongooseTypes";

export interface IAction {
  type: String;
  payload: IPlayer;
}

interface IPState {
  All: IPlayer[];
}

const initialState = {
  All: [],
};

export const PlayerReducer = (
  Players: IPState = initialState,
  action: IAction
) => {
  switch (action.type) {
    case types.UPDATE_ELO:
      const retPlayer = Players.All.find((p) => p._id === action.payload._id);
      if (retPlayer) {
        retPlayer.Elo = action.payload.Elo;
      }
      return Players;
    case types.GET_ALL:
      return { ...Players, All: action.payload };
    case types.ADD_PLAYER:
      return { ...Players, All: [...Players.All, action.payload] };
    default:
      return Players;
  }
};
