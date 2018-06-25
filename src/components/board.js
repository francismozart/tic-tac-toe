import React from 'react';

import Square from './square';

class Board extends React.Component {

  renderSquare(i) {
    let squareClasses = "square";

    const arrayWinner = this.props.winnerSquares.map((winnerSquare, ind)=> {
      if (winnerSquare === i) {
        squareClasses += " winner";
      }

      return null;
    });

    return (
    	<Square key={i} squareClasses={squareClasses}
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)} 
      />
    );
  }

  render() {
    let  oldBoardRows = Array(3).fill(Array(3).fill(null)),
    counter = 0;

    let newBoardRows = oldBoardRows.map((val, i) => {
      let arrayInside = val.map((e, indice) => {
        let initialCounter = counter;
        counter++;

        return (
          this.renderSquare(initialCounter)
        );
      });
      
      return (
        <div key={i} className="board-row">
          {arrayInside}
        </div>
      );
    });

    return (
      <div>
        {newBoardRows}
      </div>
    );
  }
}

export default Board;