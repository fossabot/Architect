import React, { PureComponent } from 'react';
import { Group, Image } from 'react-konva';

class ProtocolStage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      image: null,
    };
  }

  componentDidMount() {
    const image = new window.Image();
    image.src = 'http://konvajs.github.io/assets/yoda.jpg';
    image.onload = () => {
      this.setState({
        image,
      });
    };
  }

  render() {
    const image = this.state.image;
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
      y: 0,
      x: 0,
      height,
      width,
    };

    return (
      <Group
        {...groupProps}
        {...this.props}
      >
        <Image
          image={image}
          {...snapshotProps}
        />
      </Group>
    );
  }
}

export default ProtocolStage;
