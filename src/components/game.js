import React from 'react';

import Clock from './clock';
import Board from './board';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import '../index.css';

library.add(faSort)

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
      time: 30,
      stepNumber: 0,
      xIsNext: true,
      gameIsOver: false,
      isSidebarCollapsed: true
    };
  }

  handleClick(i) {
    if (this.state.gameIsOver) {
      return;
    } else {
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
        time: 30,
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext
      });
    }
  }

  componentDidMount() {
    this.startClock();
  }

  componentDidUpdate(){

  }

  componentWillUnmount() {
    clearInterval(this.timePassing);
  }

  startClock(){
    this.timePassing = setInterval(() => this.clockTick(), 1000);

    const gameIsOver = false;
    this.setState({gameIsOver: gameIsOver});
  }

  gameOver(){
    clearInterval(this.timePassing);

    const gameIsOver = true;
    this.setState({gameIsOver: gameIsOver});
  }

  jumpTo(step) {
    let history;

    if (step === 0) {
      this.startClock();

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

  clockTick(){
    if (this.state.time < 1) {
      this.gameOver();
    } else {
      const timeNumber = this.state.time-1;
      this.setState({time: timeNumber});
    }
  }

  toggleSideBar(){
    const sideBarStatus = !this.state.isSidebarCollapsed;
    this.setState({isSidebarCollapsed: sideBarStatus});
  }

  render() {
  	const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const classToHide = this.state.stepNumber === 0 ? "hidden": "";

    const moves = history.map((step, move) => {
    	const classToBold = this.state.stepNumber === move ? "PActive" : "";
      const desc = move ?
      'Go to move #' + step.playCount :
      'Restart Game';
      return (
        <p key={move} className={'txt-reset '+classToBold}>
          {history[move].colRow} <button className='btn-reset' onClick={() => this.jumpTo(move)}>{desc}</button>
        </p>
      );
    });

    let status, winnerSquares;

    if (winner) {
      status = 'Winner: ' + winner.winner;
      winnerSquares = winner.winSquares;
      clearInterval(this.timePassing);
    } else if (current.playCount === 9) {
      status = "Draw!"
      winnerSquares = [];
      clearInterval(this.timePassing);
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      winnerSquares = [];
    }

    const isSidebarCollapsed = this.state.isSidebarCollapsed ? "" : "show";
    const timeNumber = this.state.time;

    if (this.state.time < 1) {
      status = 'Time out! Winner: ' + (this.state.xIsNext ? 'X' : 'O');
      winnerSquares = [];
    }

    return (
      <div className="game">
        <h2 className="status">{status}</h2>

        <Clock timeCount={timeNumber} />

        <button className="sideBarToggle" onClick={() => this.toggleSideBar()}>Toggle Game History</button>

        <div className="game-wrapper">
          <div className="game-board">
            <Board 
              squares={current.squares} winnerSquares={winnerSquares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
        </div>

        <div className={"game-info sideBar "+isSidebarCollapsed}>
          <div>{moves}</div>
          <div className={classToHide}>
            <button onClick={() => this.toggleOrder()}><FontAwesomeIcon icon="sort" /> Invert Order</button>
          </div>
        </div>
      </div>
    );
  }
}

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
      const winObj = {
        winner: squares[a],
        winSquares: lines[i]
      }
      return winObj;
    }
  }
  return null;
}

export default Game;