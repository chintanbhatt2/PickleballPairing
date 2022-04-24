import redux, {combineReducers} from 'redux'
import {TournamentReducer} from './Tournaments/TournamentReducer'
import {MatchReducer} from './Match/MatchReducer'
import {PlayerReducer} from './Player/PlayerReducers'


export const RootReducer = combineReducers({
    Tournament: TournamentReducer,
    Match: MatchReducer,
    Player: PlayerReducer
})