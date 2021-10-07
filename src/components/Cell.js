import React from "react";

export default function Cell({ details, updateFlag, revealCell }) {
  const cellstyle = {
    border: "1px solid darkgreen",
    background: details.revealed
      ? details.value === "X"
        
        : chexPattern(details.x, details.y),
  };

  return (
    <div
      onContextMenu={(e) => updateFlag(e, details.x, details.y)}
      onClick={() => revealCell(details.x, details.y)}
      style={cellstyle}
      className="cellStyle"
    >
      {!details.revealed && details.flagged ? (
        "🚩"
      ) : details.revealed && details.value !== 0 ? (
        details.value === "X" ? (
        "💣"
        ) : (
          details.value
        )
      ) : (
        ""
      )}
    </div>
  );
}

const chexPattern = (x, y) => {
  if (x % 2 === 0 && y % 2 === 0) {
    return "#aad751";
  } else if (x % 2 === 0 && y % 2 !== 0) {
    return "#a2d249";
  } else if (x % 2 !== 0 && y % 2 === 0) {
    return "#a2d249";
  } else {
    return "#aad751";
  }
};
