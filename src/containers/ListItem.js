/* eslint-disable */

import React, { PureComponent } from 'react';
import ReactCanvas, { Gradient, Group, Image, Surface, Text } from 'react-canvas';
import ListView from './ListView';
import { constant, times, debounce } from 'lodash';

class ListItem extends PureComponent {

  getItemHeight(index) {
    const surfaceHeight = window.innerHeight;

    return surfaceHeight / 2;
  }

  render() {
    const index = this.props.index;
    const surfaceWidth = window.innerWidth;

    const height = this.getItemHeight(index);
    const width = surfaceWidth;

    const groupStyle = { top: 0, left: 0, width, height };

    const snapshotStyles = {
      height: height / 2,
      width: height / 2,
      top: 0,
      left: ((width / 2) - (height / 4)),
    };

    const addStyle = {
      top: (height / 2) + 25,
      left: ((width / 2) - 25),
      width: 50,
      height: 50,
    };

    const textStyles = {
      top: 0,
      left: 0,
      width: surfaceWidth,
      height: 20,
      lineHeight: 20,
      fontSize: 12,
      color: '#808080',
    };

    return (
      <Group
        style={groupStyle}
      >
        <Group style={addStyle} onClick={() => { this.props.addAtItem(index); }}>
          <Gradient
            style={addStyle}
            colorStops={[{ color: "#fff", position: 0 }]}
          />
        </Group>
        <Text style={textStyles}>{ this.props.title }</Text>
        <Image
          src={`https://unsplash.it/800/600`}
          style={snapshotStyles}
        />
      </Group>
    );
    // Render the item at the given index, usually a <Group>
  }
}

export default ListItem;
