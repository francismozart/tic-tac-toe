import React from 'react';

class Clock extends React.Component {
  
  render() {
    const stateTime = this.props.timeCount;
    
    return (
      <div className="clock">
        <p className="helpText">turn ends in</p>
        <p>
          {stateTime}
        </p>
        <p className="helpText">seconds</p>
      </div>
    );
  }
}

export default Clock;