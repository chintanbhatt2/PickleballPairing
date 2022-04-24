import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  TextField,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { IState } from "../types/ReduxStateTypes";
import { IPlayer, ITournament } from "../types/MongooseTypes";
import {
  createNewTournament,
  newRound,
} from "../redux/Tournaments/TournamentActions";
import { createNewPlayer } from "../redux/Player/PlayerActions";

function NewButtons() {
  const dispatch = useDispatch();
  const [openNewTournament, setOpenNewTournament] = useState(false);
  const [openNewPlayer, setOpenNewPlayer] = useState(false);
  const [openNewRound, setOpenNewRound] = useState(false);
  const [openNewMatch, setOpenNewMatch] = useState(false);
  const ATournament = useSelector((state: IState) => state.Tournament.Active);

  const handleNewTournament = () => {
    setOpenNewTournament(true);
    setOpenNewMatch(false);
    setOpenNewPlayer(false);
    setOpenNewRound(false);
  };

  const handleNewPlayer = () => {
    setOpenNewPlayer(true);
    setOpenNewTournament(false);
    setOpenNewMatch(false);
    setOpenNewRound(false);
  };

  const handleNewRound = () => {
    setOpenNewRound(true);
    setOpenNewTournament(false);
    setOpenNewMatch(false);
    setOpenNewPlayer(false);
  };

  const handleNewMatch = () => {
    setOpenNewMatch(true);
    setOpenNewTournament(false);
    setOpenNewPlayer(false);
    setOpenNewRound(false);
  };

  const handleClose = () => {
    setOpenNewMatch(false);
    setOpenNewTournament(false);
    setOpenNewPlayer(false);
    setOpenNewRound(false);
  };

  const handleTournamentSubmission = () => {
    if (newTournament.Name === "") {
      alert("INVALID TOURNAMENT NAME: " + newTournament.Name);
      return;
    } else if (newTournament.ActivePlayers.length < 2) {
      alert(
        "INVALID NUMBER OF PLAYERS: " +
          newTournament.ActivePlayers.length.toString()
      );
      return;
    }

    console.log("Dispatching new tournament");
    console.log(newTournament);
    dispatch(createNewTournament(newTournament));
    handleClose();
  };

  const handlePlayerSubmission = () => {
    if (newPlayer.Name === "") {
      alert("INVALID NAME: " + newPlayer.Name);
      return;
    }
    console.log(newPlayer);
    dispatch(createNewPlayer(newPlayer));
    handleClose();
  };

  const handlePlayerChange = (player: IPlayer) => {
    const index = ActivePlayers.indexOf(player);
    if (index === -1) {
      setActivePlayers([...ActivePlayers, player]);
    } else {
      setActivePlayers(ActivePlayers.filter((p) => p._id !== player._id));
    }
  };

  const handleNewRoundSubmit = () => {
    console.log("Making new Round");
    if (ATournament) {
      console.log(ATournament);
      dispatch(newRound(ATournament, singles));
    } else {
      alert("NO TOURNAMENT SELECTED");
    }
    handleClose();
  };

  const [ActivePlayers, setActivePlayers] = useState<IPlayer[]>([]);
  const [newPlayer, setNewPlayer] = useState<IPlayer>({
    _id: "",
    Name: "",
    Elo: 2.5,
    GamesPlayed: 0,
  });
  const [newTournament, setNewTourament] = useState<ITournament>({
    _id: "",
    Name: "",
    ActivePlayers: ActivePlayers,
    Matches: [],
    Date: Date.now(),
  });
  const allPlayers = useSelector((state: IState) => state.Player.All);

  const [singles, setSingles] = useState(false);

  useEffect(() => {
    newTournament.ActivePlayers = ActivePlayers;
  }, [ActivePlayers]);

  useEffect(() => {}, [allPlayers]);
  return (
    <div>
      <ButtonGroup variant="outlined" aria-label="outlined button group">
        <Button onClick={handleNewTournament}>New Tournament</Button>
        <Button onClick={handleNewPlayer}>New Player</Button>
        <Button onClick={handleNewRound}>New Round</Button>
        <Button onClick={handleNewMatch}>New Match</Button>
      </ButtonGroup>
      <Dialog fullScreen open={openNewTournament} onClose={handleClose}>
        <DialogTitle>New Tournament</DialogTitle>
        <DialogContent>
          <DialogContentText>New Tournament Name</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            required
            id="Name"
            fullWidth
            variant="standard"
            value={newTournament.Name}
            onChange={(e) =>
              setNewTourament({ ...newTournament, Name: e.target.value })
            }
          />
          <DialogContentText>Select Players</DialogContentText>
          <FormControl>
            <FormLabel>Players</FormLabel>
            <FormGroup>
              {allPlayers.map((player) => (
                <FormControlLabel
                  label={player.Name}
                  control={
                    <Checkbox
                      checked={ActivePlayers.includes(player)}
                      onChange={() => handlePlayerChange(player)}
                    />
                  }
                />
              ))}
            </FormGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => handleTournamentSubmission()}>Submit</Button>
        </DialogActions>
      </Dialog>
      <Dialog fullScreen open={openNewPlayer} onClose={handleClose}>
        <DialogTitle>New Player</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            required
            id="Name"
            fullWidth
            variant="standard"
            value={newPlayer.Name}
            onChange={(e) =>
              setNewPlayer({ ...newPlayer, Name: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handlePlayerSubmission}>Submit</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openNewRound} onClose={handleClose}>
        <DialogTitle>New Round</DialogTitle>
        <DialogContent>
          <FormControlLabel
            label="Allow Singles?"
            control={
              <Checkbox
                checked={singles}
                onChange={() => setSingles(!singles)}
              />
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleNewRoundSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default NewButtons;
