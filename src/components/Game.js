import { Button, Typography } from "@material-ui/core";
import React, { useState } from "react";
import Board from "./Board";

const Game = ({ setFlagCounter, flagCounter }) => {

    const [newBoard, setNewBoard] = useState(false);

    const newGame = () => {
        setNewBoard(true);
    }

    return (
        <div className="game">
            <div style={{marginTop: "150px", textAlign: "center"}}>
            {!newBoard && <Typography variant="h2">WELCOME!</Typography>}
            {!newBoard && <Button style={{margin: "50px", padding: "20px", width: "200px"}} onClick={newGame} variant="contained" color="primary">NEW GAME</Button>}
            </div>
            {newBoard && <Board setFlagCounter={setFlagCounter} flagCounter={flagCounter} />}
        </div>
    )
}

export default Game;