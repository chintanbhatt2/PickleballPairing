import * as api from "../../api/Tournaments";
import { ITournament, IPlayer } from "../../types/MongooseTypes";
import * as types from "./TournamentTypes";
import redux from "redux";

//action creators
export const getTournaments = () => async (dispatch: any) => {
  try {
    const { data } = await api.getTournaments();
    const action = { type: types.GET_ALL, payload: data };
    dispatch(action);
  } catch (err) {
    console.log(err);
  }
};

export const setActiveTournament = (tourn: ITournament | {}) => {
  return { type: types.SET_ACTIVE, payload: tourn };
};

export const createNewTournament =
  (tourn: ITournament) => async (dispatch: any) => {
    try {
      const response = await api.newTournament(tourn);
      dispatch({ type: types.NEW, payload: response.data });
    } catch (err) {
      console.log(err);
    }
  };

export const newRound =
  (tourn: ITournament, singles: boolean) => async (dispatch: any) => {
    try {
      const response = await api.newTournamentRound(tourn, singles);
      // console.log(response);
      dispatch({ type: types.NEW_ROUND, payload: response.data.Matches });
    } catch (err) {
      console.log(err);
    }
  };

export const updatePlayerInTournament = (player: IPlayer) => {
  return { type: types.UPDATE_ELO, payload: player };
};
