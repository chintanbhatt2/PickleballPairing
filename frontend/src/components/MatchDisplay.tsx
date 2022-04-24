import * as api from "../api/Tournaments";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { IMatch } from "../types/MongooseTypes";
import { useDispatch, useSelector } from "react-redux";
import { IState } from "../types/ReduxStateTypes";
import { updateActiveMatch } from "../redux/Match/MatchActions";
import { updatePlayer } from "../redux/Player/PlayerActions";
import { updatePlayerInTournament } from "../redux/Tournaments/TournamentActions";

interface IProps {
  Match: IMatch;
}

function MatchDisplay(props: IProps) {
  const AMatch = useSelector((state: IState) => state.Match.Active);
  const ATournamentID = useSelector(
    (state: IState) => state.Tournament.Active._id
  );
  const [localMatch, setLocalMatch] = useState(AMatch);
  const dispatch = useDispatch();

  const handleChangeOne = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) {
      event.target.value = "0";
    }
    const score = parseInt(event.target.value);
    const scores: any = localMatch.Score;
    scores[0].Points = score;

    setLocalMatch({ ...localMatch, Score: scores });
  };

  const handleChangeTwo = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) {
      event.target.value = "0";
    }
    const score = parseInt(event.target.value);
    const scores: any = localMatch.Score;
    scores[1].Points = score;
    setLocalMatch({ ...localMatch, Score: scores });
  };

  const handleUpdateMatch = () => {
    if (localMatch) {
      if (localMatch.Score[0].Points > localMatch.Score[1].Points) {
        setLocalMatch({ ...localMatch, Winner: 1 });
      } else {
        setLocalMatch({ ...localMatch, Winner: 2 });
      }
      dispatch(updateActiveMatch(ATournamentID, AMatch._id, localMatch));
    }
  };

  const handleUpdateElo = () => {
    if (
      (AMatch.Score[0].Points < 11 && AMatch.Score[1].Points < 11) ||
      (AMatch.Score[0].Points > 15 && AMatch.Score[1].Points > 15)
    ) {
      alert("ERROR: Points not valid");
      return;
    }

    const team1 = AMatch.Players.filter((p) => {
      return p.Team === 1;
    });
    const team2 = AMatch.Players.filter((p) => {
      return p.Team === 2;
    });
    const t1Elo =
      team1.map((p) => p.Player.Elo).reduce((a, b) => a + b, 0) / team1.length;
    const t2Elo =
      team2.map((p) => p.Player.Elo).reduce((a, b) => a + b, 0) / team1.length;
    let winDiff = 0.0;
    if (AMatch.Winner === 1) {
      winDiff = t2Elo - t1Elo;
      let winProb = 1 / (1 + Math.pow(20, 3 * winDiff));
      for (let i = 0; i < team1.length; i++) {
        team1[i].Player.Elo += 0.1 * (1 - winProb);
        team1[i].Player.Elo.toFixed(3);
      }
      for (let i = 0; i < team2.length; i++) {
        team2[i].Player.Elo -= 0.1 * (1 - winProb);
        team2[i].Player.Elo.toFixed(3);
      }
    } else if (AMatch.Winner === 2) {
      winDiff = t1Elo - t2Elo;
      let winProb = 1 / (1 + Math.pow(20, 3 * winDiff));
      for (let i = 0; i < team1.length; i++) {
        team1[i].Player.Elo -= 0.1 * (1 - winProb);
        team1[i].Player.Elo.toFixed(3);
      }
      for (let i = 0; i < team2.length; i++) {
        team2[i].Player.Elo += 0.1 * (1 - winProb);
        team2[i].Player.Elo.toFixed(3);
      }
    }

    AMatch.Players.map((p) => {
      dispatch(updatePlayer(p.Player));
      dispatch(updatePlayerInTournament(p.Player));
    });
  };

  useEffect(() => {
    setLocalMatch(AMatch);
  }, [AMatch]);

  const Match = props.Match;
  return (
    <div>
      <Card>
        <CardContent>
          <Grid container spacing={2} columns={2}>
            <Grid item xs>
              <Typography variant="h4">Players</Typography>
              {Match.Players.map((p, i) => (
                <Typography
                  color={i < Match.Players.length / 2 ? "orange" : "purple"}
                >
                  {p.Player.Name}
                </Typography>
              ))}
            </Grid>
            <Grid item xs>
              <Typography variant="h4">Score</Typography>
              <Typography variant="overline">Team 1</Typography>
              <TextField
                onChange={handleChangeOne}
                variant="outlined"
                value={localMatch.Score[0].Points}
              />
              <Typography variant="overline">Team 2</Typography>
              <TextField
                onChange={handleChangeTwo}
                variant="outlined"
                value={localMatch.Score[1].Points}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button onClick={handleUpdateMatch}>Update Match</Button>
          <Button>Delete Match</Button>
          <Button onClick={handleUpdateElo}>Update Elo</Button>
        </CardActions>
      </Card>
    </div>
  );
}

export default MatchDisplay;
