import React, { PureComponent } from 'react';
import { constant, times } from 'lodash';
import Timeline from './Timeline';

const stages = times(5, constant({ title: 'foo' }));

class Start extends PureComponent {
  addStage = () => {
    // const surfaceHeight = window.innerHeight;
    //
    // this.setState({
    //   items: [
    //     ...this.state.items.slice(0, index + 1),
    //     { title: 'bar', height: surfaceHeight / 2, scaleY: 0.01 },
    //     ...this.state.items.slice(index + 1),
    //   ],
    // });
  };

  editStage = () => {
  };

  editSkip = () => {
  };

  render() {
    return (
      <Timeline
        stages={stages}
        addStage={this.addStage}
        editStage={this.editStage}
        editSkip={this.editSkip}
      />
    );
  }
}

export default Start;
