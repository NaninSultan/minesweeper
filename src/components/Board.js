import React, { useState, useEffect } from "react";
import createBoard from "../util/createBoard";
import Cell from "./Cell";
import { revealed } from "../util/reveal";
import Modal from "./Modal";

const Board = ({ flagCounter, setFlagCounter }) => {
  const [grid, setGrid] = useState([]);
  const [nonMineCount, setNonMineCount] = useState(0);
  const [mineLocations, setMineLocations] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [msg, setMsg] = useState('');
  
  const revealBoard = () => {
    let updatedData = grid;
    updatedData.forEach((datarow) => {
        datarow.forEach((dataitem) => {
            dataitem.revealed = true;
        });
    });
    setGrid(
        updatedData
    )
}

  useEffect(() => {
    freshBoard();
  }, []);

  const freshBoard = () => {
    const newBoard = createBoard(8, 8, 10);
    setNonMineCount(8 * 8 - 10);
    setMineLocations(newBoard.mineLocation);
    setGrid(newBoard.board);
  };

  const restartGame = () => {
    freshBoard();
    setFlagCounter(10);
    setGameOver(false);
    setMsg('');
  };

  const updateFlag = (e, x, y) => {
    e.preventDefault();
    let newGrid = JSON.parse(JSON.stringify(grid));
    newGrid[x][y].flagged = !newGrid[x][y].flagged;
    if (newGrid[x][y].flagged && flagCounter >= 1) setFlagCounter(flagCounter - 1)
    else if (!newGrid[x][y].flagged && flagCounter <= 9) setFlagCounter(flagCounter + 1)
    else return
    setGrid(newGrid);
  };

  const revealCell = (x, y) => {
    if (grid[x][y].revealed || gameOver) {
      return;
    }
    let newGrid = JSON.parse(JSON.stringify(grid));
    if (newGrid[x][y].flagged) {
      return 
    }
    if (newGrid[x][y].value === "X") {
      for (let i = 0; i < mineLocations.length; i++) {
        newGrid[mineLocations[i][0]][mineLocations[i][1]].revealed = true;
      }
      setGrid(newGrid);
      setGameOver(true);
      setMsg('You Lost!');
      revealBoard();
    } else {
      let newRevealedBoard = revealed(newGrid, x, y, nonMineCount);
      setGrid(newRevealedBoard.arr);
      setNonMineCount(newRevealedBoard.newNonMinesCount);
      if (newRevealedBoard.newNonMinesCount === 0) {
        setGameOver(true);
        setMsg('Congrats! You Won!')
      }
    }

  };

  console.log(nonMineCount)


  return (
    <div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          marginTop: "100px",
        }}
      >
        {gameOver && <Modal msg={msg} restartGame={restartGame} />}
        {grid.map((singleRow, index1) => {
          return (
            <div style={{ display: "flex" }} key={index1}>
              {singleRow.map((singleBlock, index2) => {
                return (
                  <Cell
                    revealCell={revealCell}
                    details={singleBlock}
                    updateFlag={updateFlag}
                    key={index2}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Board;