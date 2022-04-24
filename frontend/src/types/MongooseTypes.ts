export interface ITournament {
  _id: string;
  Name: String;
  ActivePlayers: IPlayer[] | [];
  Matches: IMatch[] | [];
  Date?: number;
}

export interface IMatch {
  _id: string;
  Players: [
    {
      Team: number;
      Player: IPlayer;
    },
    {
      Team: number;
      Player: IPlayer;
    },
    {
      Team: number;
      Player: IPlayer;
    },
    {
      Team: number;
      Player: IPlayer;
    }
  ];
  Score: [
    {
      Points: number;
      Team: number;
    },
    {
      Points: number;
      Team: number;
    }
  ];
  Winner: Number;
}

export interface IPlayer {
  _id: string;
  Name: String;
  Elo: number;
  GamesPlayed: number;
}
