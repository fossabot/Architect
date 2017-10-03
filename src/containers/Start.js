/* eslint-disable */

import React, { PureComponent } from 'react';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import Transition from 'react-transition-group/Transition';

const colors = [
  '#ff00ff',
  '#00ffff',
  '#ffff00',
  '#ff0000',
  '#00ff00',
  '#0000ff',
];

const duration = 300;

const defaultStyle = {
  transition: `all ${duration}ms ease-in-out`,
  opacity: 0,
}

const transitionStyles = {
  entering: { opacity: 0, height: 0, transform: 'scaleY(0)' },
  entered:  { opacity: 1, height: 200, transform: 'scaleY(1)' },
};

const Fade = ({ children, ...props }) => (
  <Transition {...props} timeout={duration} appear={true} enter={true} exit={true}>
    {(state) => (
      <div style={{
        ...defaultStyle,
        ...transitionStyles[state]
      }}>
        {children}
      </div>
    )}
  </Transition>
);

class Start extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      items: [1],
      styles: { transform: 'perspective(500px) scale3d(1, 1, 1)' },
    };
  }

  getItemHeight() {
    const surfaceHeight = window.innerHeight;

    return surfaceHeight / 5;
  }

  renderItem = (value, index) => {

    const surfaceWidth = window.innerWidth;
    const surfaceHeight = window.innerHeight;

    const height = this.getItemHeight();
    const width = surfaceWidth;

    const groupStyle = { position: 'relative', width, height };

    const snapshotStyles = {
      position: 'absolute',
      backgroundColor: colors[value % colors.length],
      height: height/2,
      width: height/2,
      top: 0,
      left: ((width/2) - (height/4)),
    };

    const addStyle = {
      position: 'absolute',
      backgroundColor: '#ffffff',
      top: (height/2) + 25,
      left: ((width/2) - 25),
      width: 50,
      height: 50,
    };

    return (
      <Fade key={value}>
        <div
          style={groupStyle}
        >
          <div style={snapshotStyles}>Snapshot {value}</div>
          <div style={addStyle} onClick={() => { this.addItem(index); }}>add</div>
        </div>
      </Fade>
    );
  }

  getItems() {
    return this.state.items.map(this.renderItem);
  }

  addItem = (index) => {
    console.log(index);
    const newItem = this.state.items.length + 1;
    const newItems = [...this.state.items.slice(0, index), newItem, ...this.state.items.slice(index) ];
    this.setState({ items: newItems });
  }

  zoom = () => {
    this.setState({
      styles: {
        transform: 'perspective(500px) scale3d(0, 0, 1)',
        transition: 'none',
      }
    }, () => {
      setTimeout(() => {
        this.setState({
          styles: {
            transform: 'perspective(500px) scale3d(1, 1, 1)'
          }
        })
      }, 1);
    })
  }

  render() {
    const surfaceWidth = window.innerWidth;
    const surfaceHeight = window.innerHeight;

    return (
      <div>
        <div style={{ transition: 'all 500ms ease', width: surfaceWidth, height: surfaceHeight, top: 0, left: 0, position: 'absolute', overflow: 'scroll', ...this.state.styles }}>
          <TransitionGroup>
            {this.getItems()}
          </TransitionGroup>
        </div>
        <div style={{ top: 0, left: 0, position: 'absolute' }} onClick={this.zoom}>Zoom!</div>
      </div>
    );
  }
}

export default Start;
