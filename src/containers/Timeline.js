/* eslint-disable */
/* eslint-disable react/sort-comp, no-underscore-dangle */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Layer, Stage, Group, Rect } from 'react-konva';
import { flow as compose, map, sum, filter, pick, find, reduce } from 'lodash';
import Scroller from 'scroller';
import TimelineStage from './TimelineStage';

const byId = (items) => reduce(
  items,
  (memo, item) => ({ [item.id]: item, ...memo }),
  {},
);

class Timeline extends PureComponent {
  propTypes = {
    items: PropTypes.array,
    snapping: PropTypes.bool,
    scrollingDeceleration: PropTypes.number,
    scrollingPenetrationAcceleration: PropTypes.number,
    onScroll: PropTypes.func,
    onAddStage: PropTypes.func,
    onEditStage: PropTypes.func,
    onEditSkip: PropTypes.func,
  };

  defaultProps = {
    items: [],
    snapping: false,
    scrollingDeceleration: 0.95,
    scrollingPenetrationAcceleration: 0.08,
    onAddStage: () => {},
    onEditStage: () => {},
    onEditSkip: () => {},
  };

  itemLayouts = (items) => {
    const surfaceWidth = window.innerWidth;
    const surfaceHeight = window.innerHeight;

    const itemHeight = surfaceHeight * (2 / 3);

    return map(
      items,
      (item, index) => ({
        id: item.id,
        height: itemHeight,
        width: surfaceWidth,
        y: itemHeight * index,
        x: 0,
      }),
    )
  }

  constructor(props) {
    const surfaceWidth = window.innerWidth;
    const surfaceHeight = window.innerHeight;

    super(props);

    this.state = {
      scrollTop: 0,
      width: surfaceWidth,
      height: surfaceHeight,
      layout: {}
    };
  }

  componentDidMount() {
    this.createScroller();
    this.updateLayoutState(this.props.items);
  }

  componentWillReceiveProps(newProps) {
    this.updateLayoutState(newProps.items);
  }

  updateLayoutState(items) {
    this.setState({
      layout: this.itemLayoutsFromProps(items),
    }, () => {
      this.updateScrollingDimensions();
    });
  }

  itemLayoutsFromProps = compose(
    this.itemLayouts,
    byId,
  );

  itemCount = () => this.props.items.length;

  getItem = index => this.props.items[index];

  getLayout = id => this.state.layout[id];

  renderItem = (index) => {
    const item = this.getItem(index);
    const layout = this.getLayout(item.id);
    const style = {
      width: layout.width,
      height: layout.height,
      x: 0,
      y: layout.y - this.state.scrollTop,
      zIndex: index,
    };

    return (
      <Group key={index} {...style}>
        <TimelineStage
          {...item}
          onAddStage={() => this.props.onAddStage(index)}
          onEditStage={() => this.props.onEditStage(index)}
          onEditSkip={() => this.props.onEditSkip(index)}
        />
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
    const scrollHeight = sum(this.itemHeights()) + height; // scroll past end
    this.scroller.setDimensions(width, height, scrollWidth, scrollHeight);
  }

  itemIds = () => map(this.props.items, 'id');

  itemHeights = () => reduce(
    this.itemIds,
    (memo, id) => ({ [id]: this.state.items[id], ...memo }),
    {},
  );

  getVisibleItemIndexes() {
    const {
      height,
      scrollTop,
      items,
    } = this.state;

    const isOnScreen = (itemHeight, itemScrollTop, screenHeight) =>
      ((itemScrollTop <= screenHeight) && (itemScrollTop + itemHeight >= 0));

    const itemsOnScreen = map(
      items,
      (item, index) => (isOnScreen(item.height, item.y - scrollTop, height) ? index : null),
    );

    return filter(itemsOnScreen, index => index !== null);
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
