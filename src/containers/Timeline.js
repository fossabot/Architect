/* eslint-disable react/sort-comp, no-underscore-dangle */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Layer, Stage, Group, Rect } from 'react-konva';
import { map, sum, filter } from 'lodash';
import Scroller from 'scroller';
import ProtocolStage from './ProtocolStage';

class Timeline extends PureComponent {
  propTypes = {
    stages: PropTypes.array,
    snapping: PropTypes.bool,
    scrollingDeceleration: PropTypes.number,
    scrollingPenetrationAcceleration: PropTypes.number,
    onScroll: PropTypes.func,
  };

  defaultProps = {
    stages: [],
    snapping: false,
    scrollingDeceleration: 0.95,
    scrollingPenetrationAcceleration: 0.08,
  };

  constructor(props) {
    const surfaceWidth = window.innerWidth;
    const surfaceHeight = window.innerHeight;

    super(props);

    this.state = {
      scrollTop: 0,
      width: surfaceWidth,
      height: surfaceHeight,
      stages: this.listViewState(props.stages),
    };
  }

  componentDidMount() {
    this.createScroller();
    this.updateScrollingDimensions();
  }

  listViewState = (stages) => {
    const surfaceWidth = window.innerWidth;
    const surfaceHeight = window.innerHeight;
    const stageHeight = surfaceHeight / 2;
    return stages.map((stage, index) => (
      {
        title: stage.title,
        height: stageHeight,
        width: surfaceWidth,
        y: stageHeight * index,
        x: 0,
      }
    ));
  }

  itemCount = () => this.state.stages.length;

  getItem = index => this.state.stages[index];

  renderItem = (index) => {
    const item = this.getItem(index);
    const itemHeights = item.y;
    const style = {
      width: item.width,
      height: item.height,
      x: 0,
      y: itemHeights - this.state.scrollTop,
      zIndex: index,
    };

    return (
      <Group key={index} {...style}>
        <ProtocolStage />
      </Group>
    );
  }

  render() {
    const items = this.getVisibleItemIndexes().map(this.renderItem);

    return (
      <Stage
        width={this.state.width}
        height={this.state.height}
        left={0}
        top={0}
      >
        <Layer>
          <Group
            onTouchStart={this.handleTouchStart}
            onTouchMove={this.handleTouchMove}
            onTouchEnd={this.handleTouchEnd}
            onTouchCancel={this.handleTouchEnd}
            onWheel={this.handleMouseWheel}
          >
            <Rect
              width={this.state.width}
              height={this.state.height}
            />
            {items}
          </Group>
        </Layer>
      </Stage>
    );
  }


  handleTouchStart = (e) => {
    if (this.scroller) {
      this.scroller.doTouchStart(e.evt.touches, e.evt.timeStamp);
    }
  }

  handleTouchMove = (e) => {
    if (this.scroller) {
      e.evt.preventDefault();
      this.scroller.doTouchMove(e.evt.touches, e.evt.timeStamp, e.evt.scale);
    }
  }

  handleTouchEnd = (e) => {
    if (this.scroller) {
      this.scroller.doTouchEnd(e.evt.timeStamp);
      if (this.props.snapping) {
        this.updateScrollingDeceleration();
      }
    }
  }

  handleScroll = (left, top) => {
    this.setState({ scrollTop: top });
    if (this.props.onScroll) {
      this.props.onScroll(top);
    }
  }

  handleMouseWheel = (e) => {
    if (this.scroller) {
      this.scroller.scrollBy(0, e.evt.deltaY, false);
    }
  }


  // Scrolling
  // =========

  createScroller() {
    const options = {
      scrollingX: false,
      scrollingY: true,
      decelerationRate: this.props.scrollingDeceleration,
      penetrationAcceleration: this.props.scrollingPenetrationAcceleration,
    };

    this.scroller = new Scroller(this.handleScroll, options);
  }

  updateScrollingDimensions() {
    const width = this.state.width;
    const height = this.state.height;
    const scrollWidth = width;
    const scrollHeight = sum(this.itemHeights()) + height;
    this.scroller.setDimensions(width, height, scrollWidth, scrollHeight);
  }

  itemHeights() {
    return map(this.state.stages, 'height');
  }

  getVisibleItemIndexes() {
    const {
      height,
      scrollTop,
      stages,
    } = this.state;

    const isOffScreen = (itemScrollTop, screenHeight) =>
      ((itemScrollTop >= screenHeight) || (itemScrollTop <= -screenHeight));

    const onScreen = filter(
      stages,
      (item) => {
        if (isOffScreen(item.y - scrollTop, height)) {
          return false;
        }
        return true;
      },
    );

    return map(onScreen, (item, index) => index);
  }

  updateScrollingDeceleration() {
    let currVelocity = this.scroller.__decelerationVelocityY;
    const currScrollTop = this.state.scrollTop;
    let targetScrollTop = 0;
    let estimatedEndScrollTop = currScrollTop;

    while (Math.abs(currVelocity).toFixed(6) > 0) {
      estimatedEndScrollTop += currVelocity;
      currVelocity *= this.props.scrollingDeceleration;
    }

    // Find the page whose estimated end scrollTop is closest to 0.
    let closestZeroDelta = Infinity;
    const itemHeights = this.itemHeights();
    const pageCount = this.itemCount();
    let pageScrollTop;

    for (let pageIndex = 0, len = pageCount; pageIndex < len; pageIndex += 1) {
      pageScrollTop = sum(itemHeights.slice(0, pageIndex)) - estimatedEndScrollTop;
      if (Math.abs(pageScrollTop) < closestZeroDelta) {
        closestZeroDelta = Math.abs(pageScrollTop);
        targetScrollTop = sum(itemHeights.slice(0, pageIndex));
      }
    }

    this.scroller.__minDecelerationScrollTop = targetScrollTop;
    this.scroller.__maxDecelerationScrollTop = targetScrollTop;
  }
}

export default Timeline;
