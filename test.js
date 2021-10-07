import React, { useState } from "react";
import PropTypes from "prop-types";
import Cell from './Cell';
import { Typography } from "@material-ui/core";

const Board = ({ props }) => {


    const initBoardData = (height, width, mines) => {
        let data = createEmptyArray(height, width);
        data = plantMines(data, height, width, mines);
        data = getNeighbours(data, height, width);
        return data;
    }

    const [boardData, setBoardData] = useState(initBoardData(props.height, props.width, props.mines));
    const [gameStatus, setGameStatus] = useState("Game in progress");
    const [mineCount, setMineCount] = useState(props.mines);

    const getMines = (data) => {
        let mineArray = [];

        data.map(datarow => {
            datarow.map((dataitem) => {
                if (dataitem.isMine) {
                    mineArray.push(dataitem);
                }
            });
        });

        return mineArray;
    }

    const getFlags = (data) => {
        let mineArray = [];

        data.map(datarow => {
            datarow.map((dataitem) => {
                if (dataitem.isFlagged) {
                    mineArray.push(dataitem);
                }
            });
        });

        return mineArray;
    }

    const getHidden = (data) => {
        let mineArray = [];

        data.map(datarow => {
            datarow.map((dataitem) => {
                if (dataitem.isRevealed) {
                    mineArray.push(dataitem);
                }
            });
        });

        return mineArray;
    }

    const getRandomNumber = (dimension) => {
        return Math.floor((Math.random() * 1000) + 1) * dimension;
    }



    const createEmptyArray = (height, width) => {
        let data = [];

        for (let i = 0; i < height; i++) {
            data.push([]);
            for (let j = 0; j < width; j++) {
                data[i][j] = {
                    x: i,
                    y: j,
                    isMine: false,
                    neighbour: 0,
                    isRevealed: false,
                    isEmpty: false,
                    isFlagged: false,
                };
            }
        }
        return data;
    }

    const plantMines = (data, height, width, mines) => {
        let randomX, randomY, minesPlaned = 0;

        while (minesPlaned < mines) {
            randomX = getRandomNumber(width);
            randomY = getRandomNumber(height);
            if (!(data[randomX][randomY].isMine)) {
                data[randomX][randomY].isMine = true;
                minesPlaned++;            
            }
        }

        return (data);
    }

    const getNeighbours = (data, height, width) => {
        let updateData = data, index = 0;

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (data[i][j].isMine !== true) {
                    let mine = 0;
                    const area = traverseBoard(data[i][j].x, data[i][j].y, data);
                    area.map(value => {
                        if (value.isMine) {
                            mine++
                        }
                    });
                    if (mine === 0) {
                        updateData[i][j].isEmpty = true;
                    }
                    updateData[i][j].neighbour = mine;
                }
            }
        }

        return (updateData);
    }

    const traverseBoard = (x, y, data) => {
        const el = [];

        if (x > 0) {
            el.push(data[x-1][y]);
        }

        if (x < props.height - 1) {
            el.push(data[x + 1][y]);
          }
      
        if (y > 0) {
            el.push(data[x][y - 1]);
        }
      
        if (y < props.width - 1) {
            el.push(data[x][y + 1]);
        }
      
        if (x > 0 && y > 0) {
            el.push(data[x - 1][y - 1]);
        }
      
        if (x > 0 && y < props.width - 1) {
            el.push(data[x - 1][y + 1]);
        }
      
        if (x < props.height - 1 && y < props.width - 1) {
            el.push(data[x + 1][y + 1]);
        }
      
        if (x < props.height - 1 && y > 0) {
            el.push(data[x + 1][y - 1]);
        }
      
        return el;
    }

    const revealBoard = () => {
        let updateData = boardData;
        updateData.map((datarow) => {
            datarow.map((dataitem) => {
                dataitem.isRevealed = true;
            });
        });
    }

    const revealEmpty = (x, y, data) => {
        let area = traverseBoard(x, y, data);
        area.map(value => {
            if (!value.isFlagged && !value.isRevealed && (value.isEmpty || !value.isMine)) {
                data[value.x][value.y].isRevealed = true;
                if (value.isEmpty) {
                    revealEmpty(value.x, value.y, data);
                }
            }
        });

        return data;
    }

    const handleCellClick = (x, y) => {
        if (boardData[x][y].isRevealed || boardData[x][y].isFlagged) return null;

        if (boardData[x][y].isMine) {
            setGameStatus('You Lost.');
            revealBoard();
            alert('game over');
        }

        let updateData = boardData;
        updateData[x][y].isFlagged = false;
        updateData[x][y].isRevealed = true;

        if (updateData[x][y].isEmpty) {
            updateData = revealEmpty(x, y, updateData)
        }

        if (getHidden(updateData).length === props.mines) {
            setMineCount(0);
            setGameStatus('You Win!');
            revealBoard();
            alert('You Won!');
        }

        setBoardData(updateData);
        setMineCount(props.mines - getFlags(updateData).length);
    }

    const handleContextMenu = (e, x, y) => {
        e.preventDeadult();
        let updateData = boardData;
        let mines = mineCount;

        if (updateData[x][y].isRevealed) return;

        if (updateData[x][y].isFlagged) {
            updateData[x][y].isFlagged = false;
            mines++
        } else {
            updateData[x][y].isFlagged = true;
            mines--;
        }

        if (mines === 0) {
            const mineArray = getMines(updateData);
            const FlagArray = getFlags(updateData);
            if (JSON.stringify(mineArray) === JSON.stringify(FlagArray)) {
                setMineCount(0);
                setGameStatus('You Win!');
                revealBoard();
                alert('You Win!');
            }
        }

        setBoardData(updateData);
        setMineCount(mines);
    }

    const renderBoard = (data) =>  {
        return data.map((datarow) => {
            return datarow.map((dataitem) => {
                return (
                    <div key={dataitem.x * datarow.length + dataitem.y}>
                        <Cell 
                            onClick={() => handleCellClick(dataitem.x, dataitem.y)}
                            cMenu={(e) => handleContextMenu(e, dataitem.x, dataitem.y)}
                            value={dataitem}
                        />
                        {(datarow[datarow.length - 1] === dataitem) ? <div className="clear" /> : ""}
                    </div>
                );
            });
        })
    }

    return (
        <div className="board">
            <div className="game-info">
                <span className="info">Mines remaining: {mineCount}</span>
                <Typography>{gameStatus}</Typography>
            </div>
            {renderBoard(boardData)}
        </div>
    )

}

export default Board;

Board.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    mines: PropTypes.number,
  }


  import { Typography } from "@material-ui/core"
  import Board from './Board';
  
  
  
  const Game = () => {
  
      const height = 8;
      const width = 8;
      const mines = 10;
  
      return (
          <div className="game">
              <Board 
                  height={height}
                  width={width}
                  mines={mines}
              />
          </div>
      )
  }
  
  export default Game;



  import React from "react";
import PropTypes from 'prop-types';


const Cell = ({ props }) => {
    const getValue = () => {
        const { value } = props
        if (!value.isRevealed) {
            return props.value.isFlagged ? '🚩' : null;
        }
        if (value.isMine) {
            return "💣";
        }
        if (value.neighbour === 0) {
            return null;
        }
        return value.neighbour;
    }

    const { value, onClick, cMenu } = props;
    let className = 
        "cell" +
            (value.isRevealed ? "" : " hidden")+
            (value.isMine ? " is-mine" : "") +
            (value.isFlagged ? " is-flag" : "");

    return (
        <div
            onClick={onClick}
            className={className}
            onContextMenu={cMenu}>
            {getValue}
        </div>
    )
}

export default Cell;

const cellItemShape = {
    isRevealed: PropTypes.bool,
    isMine: PropTypes.bool,
    isFlagged: PropTypes.bool
}

Cell.propTypes = {
    value: PropTypes.objectOf(PropTypes.shape(cellItemShape)),
    onClick: PropTypes.func,
    cMenu: PropTypes.func
}


import React, { useState, useEffect } from "react";
import createBoard from "../util/createBoard";
import Cell from "./Cell";
import { revealed } from "../util/reveal";
import Modal from "./Modal";
import { Grid, Typography } from "@material-ui/core";

const Board = () => {

  const [grid, setGrid] = useState([]);

  useEffect(() => {
    function freshBoard(){
      const newBoard = createBoard(5, 5, 10);
      setGrid(newBoard);
    }
    freshBoard();
  }, []);

  if (!grid.board) {
    return <div>Loading</div>
  }

  return (
    <div style={{marginTop: "150px", textAlign: "center"}} className="Board">
      <Typography >Board</Typography>
      {grid.board.map((singleRow) => {
        return (
          <div style={{display: "flex"}}>
            {singleRow.map(singleBlock=>{
              return (
                <div>
                  <Cell details={singleBlock} />
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )

};

export default Board;