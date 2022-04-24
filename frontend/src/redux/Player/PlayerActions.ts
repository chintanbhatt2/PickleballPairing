import * as api from "../../api/Players";
import { IPlayer } from "../../types/MongooseTypes";
import * as types from "./PlayerTypes";

export const updatePlayer = (player: IPlayer) => async (dispatch: any) => {
  try {
    const response = await api.updatePlayer(player);
    dispatch({ type: types.UPDATE_ELO, payload: response.data });
  } catch (error) {
    console.log(error);
  }
};

export const createNewPlayer = (player: IPlayer) => async (dispatch: any) => {
  try {
    const response = await api.newPlayer(player);
    dispatch({ type: types.ADD_PLAYER, payload: response.data });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPlayers = () => async (dispatch: any) => {
  try {
    const response = await api.getAllPlayers();
    console.log(response);
    dispatch({ type: types.GET_ALL, payload: response.data });
  } catch (error) {
    console.log(error);
  }
};
