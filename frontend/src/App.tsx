import React, { useEffect } from "react";

import { Container, AppBar, Typography, Grow, Grid } from "@mui/material";

import { useDispatch, connect, useSelector } from "react-redux";
import { getTournaments } from "./redux/Tournaments/TournamentActions";
import { getAllPlayers } from "./redux/Player/PlayerActions";

import { IState } from "./types/ReduxStateTypes";

import TournamentDisplay from "./components/TournamentDisplay";
import TournamentSelector from "./components/TournamentSelector";
import MatchDisplay from "./components/MatchDisplay";
import NewButtons from "./components/NewButtons";

function App({ Tournament }: any) {
  const dispatch = useDispatch();
  const ATournament = useSelector((state: IState) => state.Tournament.Active);
  const AMatch = useSelector((state: IState) => state.Match.Active);

  useEffect(() => {
    dispatch(getTournaments());
    dispatch(getAllPlayers());
  }, []);

  return (
    <Container maxWidth="lg">
      <AppBar position="static" color="inherit">
        <Typography variant="h2" align="center">
          Pickleball Tournament
        </Typography>
        <NewButtons />
        <TournamentSelector />
      </AppBar>

      {ATournament ? <TournamentDisplay /> : ""}
      {AMatch ? <MatchDisplay Match={AMatch} /> : ""}
    </Container>
  );
}

export default App;
