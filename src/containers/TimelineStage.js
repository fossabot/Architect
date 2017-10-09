import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Group, Image } from 'react-konva';

class TimelineStage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      image: null,
    };
  }

  componentDidMount() {
    const image = new window.Image();
    const imageSrc = `/images/timeline/stage--${this.props.type}.png`;
    image.src = imageSrc;
    image.onload = () => {
      this.setState({
        image,
      });
    };
  }

  render() {
    const image = this.state.image;
    const {
      width,
      height,
    } = this.props;

    const snapshotWidth = height * (4 / 3);
    const snapshotX = (width - snapshotWidth) / 2;

    const groupProps = {
      y: 0,
      x: 0,
      width,
      height,
    };

    const snapshotProps = {
      y: 0,
      x: snapshotX,
      height,
      width: snapshotWidth,
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

TimelineStage.propTypes = {
  type: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};

TimelineStage.defaultProps = {
  width: 0,
  height: 0,
};

export default TimelineStage;
