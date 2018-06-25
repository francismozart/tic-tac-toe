import React from 'react';

class Clock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      time: 30
    };
  }

  render() {

    const stateTime = this.state.time;

    let timePassing = setTimeout(() => {
      const time = this.state.time-1;
      this.setState({time: time});
    }, 1000);

    if (this.state.time < 1) { clearTimeout(timePassing); }

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