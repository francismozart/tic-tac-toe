

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
    	<Square 
		    value={this.props.squares[i]} 
		    onClick={() => this.props.onClick(i)} 
	    />
    );
  }

  render() {
  	let boardRows = [];



    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        colRow: null
      }],
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
  		history: history.concat([{
        squares: squares,
        colRow: this.getColRow(i)
      }]), 
      stepNumber: history.length,
  		xIsNext: !this.state.xIsNext
  	});
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  getColRow(renderNumber){
  	let colRowToRender;

  	switch(renderNumber) {
  		case 0:
  		colRowToRender = "Col: 1, Row: 1";
  		break;

  		case 1:
  		colRowToRender = "Col: 2, Row: 1";
  		break;

  		case 2:
  		colRowToRender = "Col: 3, Row: 1";
  		break;

  		case 3:
  		colRowToRender = "Col: 1, Row: 2";
  		break;

  		case 4:
  		colRowToRender = "Col: 2, Row: 2";
  		break;

  		case 5:
  		colRowToRender = "Col: 3, Row: 2";
  		break;

  		case 6:
  		colRowToRender = "Col: 1, Row: 3";
  		break;

  		case 7:
  		colRowToRender = "Col: 2, Row: 3";
  		break;

  		case 8:
  		colRowToRender = "Col: 3, Row: 3";
  		break;

  		default:
  		colRowToRender = null;
  	}

  	return colRowToRender;
  }

  render() {
  	const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

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

    console.log(moves);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
          	squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <h2 className="status">{status}</h2>
          <div>{moves}</div>
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
      return squares[a];
    }
  }
  return null;
}
