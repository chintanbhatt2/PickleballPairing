import React, {useState, useEffect, useDebugValue} from 'react'
import { useDispatch } from 'react-redux';
import {FormControl, Select, MenuItem, SelectChangeEvent} from '@mui/material'
import {useSelector} from 'react-redux'
import {IState} from "../types/ReduxStateTypes"
import {ITournament} from '../types/MongooseTypes'
import {setActiveTournament} from '../redux/Tournaments/TournamentActions'


function TournamentSelector() {

  const dispatch = useDispatch()

  const [ActiveTournament, setATournament] = useState<ITournament | undefined | {}>()
  const tournaments = useSelector((state:IState) => state.Tournament.All)
  const TournamentNames = tournaments.map(tourn => <MenuItem key={tourn._id} value={tourn._id}> {tourn.Name} </MenuItem> )

  const handleSelection = (e:SelectChangeEvent<string>) => {
    const torn = tournaments.find(t => t._id === e.target.value)
    setATournament(torn)
  }

  useEffect(() => { 
    if(ActiveTournament){
      dispatch(setActiveTournament(ActiveTournament))
    }
  
   }, [ActiveTournament])

  return (
    <FormControl>
        <Select defaultValue={''} onChange={handleSelection}>
          {TournamentNames}
        </Select>
    </FormControl>
  )
}

export default TournamentSelector