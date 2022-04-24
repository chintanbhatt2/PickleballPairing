import * as api from "../../api/Tournaments";
import { IMatch } from "../../types/MongooseTypes";
import * as types from "./MatchTypes";

export const setActiveMatch = (match: IMatch | {}) => {
  const retAction = { type: types.SET_ACTIVE, payload: match };
  return retAction;
};

export const updateActiveMatch =
  (tournamentID: string, matchID: string, updatedMatch: IMatch) =>
  async (dispatch: any) => {
    try {
      if (tournamentID && matchID) {
        if (updatedMatch.Score[0].Points > updatedMatch.Score[1].Points) {
          updatedMatch.Winner = 1;
        } else {
          updatedMatch.Winner = 2;
        }
        const response = await api.updateMatch(
          matchID,
          tournamentID,
          updatedMatch
        );
        dispatch({
          type: types.UPDATE_ACTIVE,
          payload: response.data.bodyMatch,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
