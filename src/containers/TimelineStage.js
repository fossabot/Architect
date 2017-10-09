import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Group, Image, Rect, Text } from 'react-konva';

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

    const addProps = {
      y: height + 20,
      x: (width / 2) + 20,
      fill: 'white',
      height: 40,
      width: 40,
    };

    const ruleProps = {
      y: height / 2,
      x: snapshotX + snapshotWidth + 20,
      fill: 'white',
      height: 40,
      width: 40,
    };

    return (
      <Group
        {...groupProps}
      >
        <Text
          fill="white"
          x={0}
          y={0}
          height={20}
          width={200}
          text={this.props.title}
          fontSize={30}
          fontFamily="Calibri"
        />

        <Image
          image={image}
          {...snapshotProps}
        />

        <Rect {...addProps} />
        <Rect {...ruleProps} />
      </Group>
    );
  }
}

TimelineStage.propTypes = {
  type: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  title: PropTypes.title,
};

TimelineStage.defaultProps = {
  width: 0,
  height: 0,
  title: '',
};

export default TimelineStage;
