import { Button, Typography } from "@material-ui/core";
import React from "react";

export default function Modal({ restartGame, msg }) {

  return (
    <div
      style={{
        height: "100%",
        width: "495px",
        position: "absolute",
        textAlign: "center",
      }}
    >
      <div id="gameOverImage"></div>
      <Typography variant="h3" style={{padding: "20px"}}>{msg}</Typography>
      <Button style={{marginBottom: "40px"}} className="tryAgain" variant="contained" color="secondary" onClick={() => restartGame()}>
        Try Again
      </Button>
    </div>
  );
}