import React from 'react';

class Clock extends React.Component {

  render() {
    const stateTime = this.props.time;

    return (
      <div className="clock">
        <p>
          {stateTime}
        </p>
      </div>
    );
  }
}

export default Clock;