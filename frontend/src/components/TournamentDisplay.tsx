import {
  TableRow,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  accordionActionsClasses,
  Grid,
} from "@mui/material";
import { experimentalStyled as styled } from "@mui/material";
import React, { useState, useEffect } from "react";
import { IMatch, ITournament } from "../types/MongooseTypes";
import { IState } from "../types/ReduxStateTypes";
import Paper from "@mui/material/Paper";
import { useDispatch, useSelector } from "react-redux";
import { setActiveMatch } from "../redux/Match/MatchActions";

const Item = styled(Paper)(({ theme }: any) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function TournamentDisplay() {
  const [ActiveMatch, setAMatch] = useState<IMatch | undefined>();
  const dispatch = useDispatch();
  const ATournament = useSelector((state: IState) => state.Tournament.Active);

  const handleRowClick = (e: IMatch) => {
    console.log(e);
    setAMatch(e);
  };

  const [playerScores, setPlayerScores] = useState(
    ATournament.ActivePlayers.map((player) => ({
      ...player,
      Points: 0,
    }))
  );

  const [matchUpdate, setMatchUpdate] = useState(false);

  useEffect(() => {
    setMatchUpdate(true);
  }, [ATournament.Matches]);

  useEffect(() => {
    const AplayerScores = ATournament.ActivePlayers.map((player) => ({
      ...player,
      Points: 0,
    }));

    AplayerScores.map((p) => (p.Points = 0));

    for (let i = 0; i < ATournament.Matches.length; i++) {
      let team1Points = ATournament.Matches[i].Score[0].Points;
      let team2Points = ATournament.Matches[i].Score[1].Points;
      for (let j = 0; j < ATournament.Matches[i].Players.length; j++) {
        let player = AplayerScores.find(
          (p) => p._id === ATournament.Matches[i].Players[j].Player._id
        );
        if (player) {
          if (ATournament.Matches[i].Players[j].Team === 1) {
            player.Points += team1Points;
          } else {
            player.Points += team2Points;
          }
        }
      }
    }
    AplayerScores.sort((a, b) => (a.Points > b.Points ? -1 : 1));
    setPlayerScores(AplayerScores);
  }, [ATournament]);

  useEffect(() => {
    if (ActiveMatch) {
      dispatch(setActiveMatch(ActiveMatch));
    }
  }, [ActiveMatch]);

  return (
    <div>
      <Grid container spacing={{ xs: 1, md: 3 }} columns={{ xs: 2, sm: 4 }}>
        {playerScores.map((p, index) => (
          <Grid item xs={1} key={index}>
            <Item>
              {p.Name} : {p.Points}
            </Item>
          </Grid>
        ))}
      </Grid>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow key={"Header"}>
              <TableCell>Player 1</TableCell>
              <TableCell>Player 2</TableCell>
              <TableCell>Player 3</TableCell>
              <TableCell>Player 4</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Winner</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ATournament.Matches.map((match) => (
              <TableRow
                key={match._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                hover
                onClick={() => handleRowClick(match)}
              >
                {match.Players.map((player) => (
                  <TableCell key={player.Player._id}>
                    {player.Player.Name}
                  </TableCell>
                ))}
                <TableCell>
                  {match.Score[0].Points + "-" + match.Score[1].Points}
                </TableCell>
                <TableCell>{match.Winner}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default TournamentDisplay;
