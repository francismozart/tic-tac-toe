

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={props.squareClasses} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

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

class Game extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          colRow: null,
          playCount: 0
        }
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
  	const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([
        {
          squares: squares,
          colRow: this.getColRow(i),
          playCount: current.playCount+1
        }
      ]), 
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    let history;

    if (step === 0) {
      history = [
        {
          squares: Array(9).fill(null),
          colRow: null,
          playCount: 0
        }
      ];

      this.setState({
        history: history,
        stepNumber: 0,
        xIsNext: true,
      });
    } else {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }
  }

  getColRow(renderNumber){
    let vector = [0,1,2,3,4,5,6,7,8];
    const col = [0,3,6].includes(renderNumber) ? 1 : [1,4,7].includes(renderNumber) ? 2 : 3;
    const row = renderNumber < 3 ? 1 : renderNumber > 5 ? 3 : 2;

    return `Col: ${col}, Row: ${row}`;
  }

  toggleOrder(){
    const history = this.state.history.slice(1),
    first = this.state.history.slice(0,1),
    oldStepNumber = this.state.stepNumber;
    let newStepNumber;

    history.reverse();

    const completeArray = first.concat(history);

    newStepNumber = completeArray.length - oldStepNumber;

    this.setState({
      history: completeArray,
      stepNumber: newStepNumber
    });
  }

  render() {
  	const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const classToHide = this.state.stepNumber === 0 ? "hidden": "";

    const moves = history.map((step, move) => {
    	const classToBold = this.state.stepNumber === move ? "PActive" : "";
      const desc = move ?
      'Go to move #' + move :
      'Go to game start';
      return (
        <p key={move} className={classToBold}>
          {history[move].colRow} <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </p>
      );
    });

    let status, winnerSquares;
    if (winner) {
      status = 'Winner: ' + winner.winner;
      winnerSquares = winner.winSquares;
    } else if (current.playCount === 9) {
      status = "Draw!"
      winnerSquares = [];
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      winnerSquares = [];
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
          squares={current.squares} winnerSquares={winnerSquares}
          onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <h2 className="status">{status}</h2>
          <div>{moves}</div>
          <div className={classToHide}>
            <button onClick={() => this.toggleOrder()}>Toggle Moves's Order</button>
          </div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
  );

function calculateWinner(squares) {
  const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      console.log(lines[i]);

      const winObj = {
        winner: squares[a],
        winSquares: lines[i]
      }
      return winObj;
    }
  }
  return null;
}
