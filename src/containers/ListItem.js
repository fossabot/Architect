/* eslint-disable */

import React, { PureComponent } from 'react';
import ListView from './ListView';
import { constant, times, debounce } from 'lodash';
import { Group, Image } from 'react-konva';

class ListItem extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      image: null,
    };
  }

  getItemHeight(index) {
    const surfaceHeight = window.innerHeight;

    return surfaceHeight / 2;
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

    const height = this.getItemHeight(index);
    const width = surfaceWidth;

    const groupProps = { top: 0, left: 0, width, height };

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
        {...groupProps}
      >

        <Image
          image={this.state.image}
          {...snapshotProps}
        />
      </Group>
    );
    // Render the item at the given index, usually a <Group>
  }
}

// <Group style={addStyle} onClick={() => { this.props.addAtItem(index); }}>
//   <Gradient
//     style={addStyle}
//     colorStops={[{ color: "#fff", position: 0 }]}
//   />
// </Group>
// <Text style={textStyles}>{ this.props.title }</Text>

export default ListItem;
