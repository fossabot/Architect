import React, { PureComponent } from 'react';
import { constant, times } from 'lodash';
import Timeline from './Timeline';

const items = times(5, constant({ title: 'foo', type: 'name-generator' }));

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
        items={items}
        addStage={this.addStage}
        editStage={this.editStage}
        editSkip={this.editSkip}
      />
    );
  }
}

export default Start;
