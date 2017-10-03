/* eslint-disable */

import React, { PureComponent } from 'react';
import ReactCanvas, { Gradient, Group, Image, ListView, Surface, Text } from 'react-canvas';

class Start extends PureComponent {

  getNumberOfItems() {
    return 10;
  }

  getItemHeight() {
    const surfaceHeight = window.innerHeight;

    return surfaceHeight / 2;
  }

  renderItem = () => {
    const surfaceWidth = window.innerWidth;
    const surfaceHeight = window.innerHeight;

    const height = this.getItemHeight();
    const width = surfaceWidth;

    const groupStyle = { top: 0, left: 0, width, height };

    const snapshotStyles = {
      height: height/2,
      width: height/2,
      top: 0,
      left: ((width/2) - (height/4)),
    };

    const addStyle = {
      top: (height/2) + 25,
      left: ((width/2) - 25),
      width: 50,
      height: 50,
    };

    return (
      <Group
        style={groupStyle}
      >
        <Group style={addStyle}>
          <Gradient
            style={addStyle}
            colorStops={[{ color: "#fff", position: 0 }]}
          />
        </Group>
        <Image
          src="https://unsplash.it/800/300"
          style={snapshotStyles}
        />
      </Group>
    );
    // Render the item at the given index, usually a <Group>
  }

  getListViewStyle() {
    const surfaceWidth = window.innerWidth;
    const surfaceHeight = window.innerHeight;

    return {
      top: 0,
      left: 0,
      width: surfaceWidth,
      height: surfaceHeight,
    };
  }

  render() {
    const surfaceWidth = window.innerWidth;
    const surfaceHeight = window.innerHeight;

    const textStyles = {
      top: 0,
      left: 0,
      width: surfaceWidth,
      height: 20,
      lineHeight: 20,
      fontSize: 12,
      color: '#ffffff',
    };

    return (
      <Surface width={surfaceWidth} height={surfaceHeight} left={0} top={0}>
        <Text style={textStyles}>
          Here is some text below an image.
        </Text>
        <ListView
          style={this.getListViewStyle()}
          numberOfItemsGetter={this.getNumberOfItems}
          itemHeightGetter={this.getItemHeight}
          itemGetter={this.renderItem}
        />
      </Surface>
    );
  }
}

export default Start;
