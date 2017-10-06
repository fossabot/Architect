/* eslint-disable */

import React, { PureComponent } from 'react';
import ListView from './ListView';
import { constant, times, debounce } from 'lodash';
import { Group, Image, Text, Rect } from 'react-konva';

class ListItem extends PureComponent {

  constructor(props) {
    super(props);

    console.log(props);

    this.state = {
      image: null,
    };
  }


  componentDidMount() {
    const image = new window.Image();
    image.src = 'http://konvajs.github.io/assets/yoda.jpg';
    image.onload = () => {
      this.setState({
        image: image
      });
    }
  }

  render() {
    const index = this.props.index;
    const surfaceWidth = window.innerWidth;
    const surfaceHeight = window.innerHeight;

    const height = surfaceHeight / 2;
    const width = surfaceWidth;

    const groupProps = {
      y: 0,
      x: 0,
      width,
      height,
    };

    const snapshotProps = {
      height: height / 2,
      width: height / 2,
      y: 0,
      x: ((width / 2) - (height / 4)),
    };

    const addStyle = {
      y: (height / 2) + 25,
      x: ((width / 2) - 25),
      width: 50,
      height: 50,
      fill: 'white',
    };

    const textStyles = {
      y: 0,
      x: 0,
      width: surfaceWidth,
      height: 20,
      fontSize: 30,
      fontFamily: 'Calibri',
      fill: 'green'
    };

    return (
      <Group
        {...groupProps}
        {...this.props}
      >
        <Text
          {...textStyles}
          text={this.props.title}
        />
        <Image
          image={this.state.image}
          {...snapshotProps}
        />
        <Rect
          {...addStyle}
          onClick={() => { this.props.addAtItem(index); }}
        />
      </Group>
    );
    // Render the item at the given index, usually a <Group>
  }
}

export default ListItem;
