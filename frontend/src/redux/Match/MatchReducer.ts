import { IMatch } from "../../types/MongooseTypes";
import * as types from "./MatchTypes";

export interface IAction {
  type: String;
  payload?: IMatch;
}

interface IMState {
  Active?: IMatch | {};
}

export const MatchReducer = (Match: IMState = {}, action: IAction) => {
  switch (action.type) {
    case types.GET_ACTIVE:
      return { ...Match };
    case types.SET_ACTIVE:
      return { ...Match, Active: action.payload };
    case types.UPDATE_ACTIVE:
      return { ...Match, Active: action.payload };
    default:
      return Match;
  }
};
