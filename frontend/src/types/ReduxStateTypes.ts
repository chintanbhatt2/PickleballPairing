import {IMatch, ITournament, IPlayer} from './MongooseTypes'


export interface IState{
    Tournament: {
        All: ITournament[],
        Active: ITournament
    },
    Match:{
        Active: IMatch,
    },
    Player:{
        All: IPlayer[]
    }
}