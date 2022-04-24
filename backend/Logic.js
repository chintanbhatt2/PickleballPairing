//For now just dump all the functions here and sort them later
import mongoose from "mongoose";
import { Match } from "./schemas/Match.js";
import { Player } from "./schemas/Player.js";

export function CreateNewTournament(TournamentName, Players) {
    const NewTourney = new Tournament({
        Name: TournamentName,
        Date: Date.now(),
        ActivePlayers: Players,
        Matches: [],
    });
    console.log(NewTourney);
    return NewTourney;
}

export function CreateNewMatch(Tournament, Players, Singles = false) {
    //Grab Random Player
    const PossiblePlayers = [...Players];
    const RandomNumber = Math.floor(Math.random() * PossiblePlayers.length);
    const RandomPlayer = PossiblePlayers[RandomNumber];
    PossiblePlayers.splice(RandomNumber, 1);
    //Teammate should be taken from a list of the active players minus games where the team and the person matches the random player

    let PossibleTeammates = [...PossiblePlayers];
    const PlayedAgainst = PossibleTeammates.map((obj) => ({
        ...obj,
        PlayedAgainstCount: 0,
    }));
    for (let i = 0; i < Tournament.Matches.length; i++) {
        let p;
        p = (() => {
            for (let j = 0; j < Tournament.Matches[i].Players.length; j++) {
                if (
                    Tournament.Matches[i].Players[j].Player._id.toString() ===
                    RandomPlayer._id.toString()
                ) {
                    return Tournament.Matches[i].Players[j];
                }
            }
        })();
        if (p != null) {
            for (let j = 0; j < Tournament.Matches[i].Players.length; j++) {
                if (Tournament.Matches[i].Players[j].Team === p.Team) {
                    for (let k = 0; k < PossibleTeammates.length; k++) {
                        if (
                            PossibleTeammates[k]._id.toString() ===
                            Tournament.Matches[i].Players[j].Player._id.toString()
                        ) {
                            PossibleTeammates.splice(k, 1);
                        }
                    }
                } else {
                    let index = PlayedAgainst.map((pl) => pl._id.toString()).indexOf(
                        Tournament.Matches[i].Players[j].Player._id.toString()
                    );
                    if (index != -1) PlayedAgainst[index].PlayedAgainstCount += 1;
                }
            }
        }
    }

    //Grab random teammate
    let RandomTeammate;
    if (!Singles) {
        const randomTeamIndex = Math.floor(
            Math.random() * PossibleTeammates.length
        );
        RandomTeammate = PossibleTeammates[randomTeamIndex];
        PlayedAgainst.splice(
            PlayedAgainst.map((pl) => pl._id).indexOf(RandomTeammate._id),
            1
        );

        for (let i = 0; i < Tournament.Matches.length; i++) {
            let p;
            let t;
            // const p = Tournament.Matches[i].Players.filter(person => person.Player._id === RandomPlayer._id)
            for (let j = 0; j < Tournament.Matches[i].Players.length; j++) {
                if (
                    Tournament.Matches[i].Players[j].Player._id.toString() ===
                    RandomTeammate._id.toString()
                ) {
                    p = Tournament.Matches[i].Players[j];
                }
            }
            if (p != null) {
                for (let j = 0; j < Tournament.Matches[i].Players.length; j++) {
                    if (Tournament.Matches[i].Players[j].Team !== p.Team) {
                        let index = PlayedAgainst.map((pl) => pl._id.toString()).indexOf(
                            Tournament.Matches[i].Players[j].Player._id.toString()
                        );
                        if (PlayedAgainst[index]) {
                            PlayedAgainst[index].PlayedAgainstCount += 1;
                        }
                    }
                }
            }
        }
    }

    //Get list of enemy team pairs
    // {
    //     Players{
    //         PlayerID1
    //         PlayerID2
    //     },
    //     TeamElo = Player1+Player2 / 2
    //     Times Played against = player1Times + player2Times / 2
    // }
    let OpponentTeamPairs = [];
    if (!Singles) {
        for (let i = 0; i < PlayedAgainst.length - 1; i++) {
            for (let j = i + 1; j < PlayedAgainst.length; j++) {
                const newPair = {
                    Players: {
                        Player1: PlayedAgainst[i],
                        Player2: PlayedAgainst[j],
                    },
                    TeamElo: (PlayedAgainst[i].Elo + PlayedAgainst[j].Elo) / 2,
                    PlayedAgainst: PlayedAgainst[i].PlayedAgainstCount +
                        PlayedAgainst[j].PlayedAgainstCount,
                };
                OpponentTeamPairs.push(newPair);
            }
        }
    } else {
        for (let i = 0; i < PlayedAgainst.length; i++) {
            const newPair = {
                Players: {
                    Player1: PlayedAgainst[i],
                },
                TeamElo: PlayedAgainst[i].Elo,
                PlayedAgainst: PlayedAgainst[i].PlayedAgainstCount,
            };
            OpponentTeamPairs.push(newPair);
        }
    }

    //Sort by abs(Random Player team elo - Enemy Team Elo)
    //Order by Least times played against, and then Elo
    OpponentTeamPairs.sort((teamA, teamB) => {
        let teamElo = Singles ?
            RandomPlayer.Elo :
            (RandomPlayer.Elo + RandomTeammate.Elo) / 2;
        let aOdds = 1 / (1 + Math.pow(20, 3 * (teamA.TeamElo - teamElo)));
        let bOdds = 1 / (1 + Math.pow(20, 3 * (teamB.TeamElo - teamElo)));
        return (
            teamA.PlayedAgainst - teamB.PlayedAgainst ||
            Math.abs(aOdds - 0.5) - Math.abs(bOdds - 0.5)
        );
    });

    let ReturnMatch;
    if (Singles) {
        ReturnMatch = new Match({
            Players: [{
                    Team: 1,
                    Player: RandomPlayer,
                },
                {
                    Team: 2,
                    Player: OpponentTeamPairs[0].Players.Player1,
                },
            ],
            Score: [{
                    Points: 0,
                    Team: 1,
                },
                {
                    Points: 0,
                    Team: 2,
                },
            ],
            Winner: 0,
        });
    } else {
        ReturnMatch = new Match({
            Players: [{
                    Team: 1,
                    Player: RandomPlayer,
                },
                {
                    Team: 1,
                    Player: RandomTeammate,
                },
                {
                    Team: 2,
                    Player: OpponentTeamPairs[0].Players.Player1,
                },
                {
                    Team: 2,
                    Player: OpponentTeamPairs[0].Players.Player2,
                },
            ],
            Score: [{
                    Points: 0,
                    Team: 1,
                },
                {
                    Points: 0,
                    Team: 2,
                },
            ],
            Winner: 0,
        });
    }
    return ReturnMatch;
}

export function CreateNewRound(Tournament, Players = [], AllowSingles = false) {
    console.log(Tournament);
    Players = [...Tournament.ActivePlayers];
    let newRound = {
        Matches: [],
        PlayersSittingOut: [],
    };
    let Matches = [];
    while (Players.length >= 4) {
        const newMatch = CreateNewMatch(Tournament, Players);

        for (let i = 0; i < newMatch.Players.length; i++) {
            const playerIDs = Players.map((pl) => pl._id);
            const playerIndex = playerIDs.indexOf(
                newMatch.Players[i].Player._id.toString()
            );
            Players.splice(playerIndex, 1);
        }
        Matches.push(newMatch);
    }
    if (AllowSingles && Players.length > 1) {
        const newMatch = CreateNewMatch(Tournament, Players, true);
        Matches.push(newMatch);
        for (let i = 0; i < newMatch.Players.length; i++) {
            Players.splice(
                Players.map((pl) => pl._id).indexOf(newMatch.Players[i].Player._id),
                1
            );
        }
    }

    newRound.Matches = Matches;
    newRound.PlayersSittingOut = Players;
    return newRound;
}