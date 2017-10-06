/* eslint-disable */

import React, { PureComponent } from 'react';
import { Layer, Rect, Stage, Group } from 'react-konva';
import { constant, times, debounce } from 'lodash';
import ListView from './ListView';
import ListItem from './ListItem';

class Start extends PureComponent {

  constructor(props) {
    const surfaceHeight = window.innerHeight;

    super(props);

    this.state = {
      targetHeight: surfaceHeight / 2,
      items: times(5, constant({ title: 'foo', height: surfaceHeight / 2, scaleY: 1 })),
    };

    console.log(this.state);
    this.update();
  }

  getNumberOfItems = () => {
    return this.state.items.length;
  }

  getItemHeight = (index) => {
    return this.state.items[index].height * this.state.items[index].scaleY;
  }

  addAtItem = (index) => {
    this.setState({
      items: [
        ...this.state.items.slice(0, index + 1),
        { title: 'bar', height: this.state.targetHeight, scaleY: 0.01 },
        ...this.state.items.slice(index + 1),
      ],
    }, () => {
      if (!this.list) { return; }
      this.list.updateScrollingDimensions();
    });
  }

  update() {
    const items = this.state.items.map((item) => {
      if (item.scaleY >= 1) { return item; }
      return {
        ...item,
        scaleY: item.scaleY + ((1 - item.scaleY) / 2) + 0.01,
      }
    });

    this.setState({
      items
    });

    requestAnimationFrame(() => this.update());
  }

  renderItem = (index) => {
    return (
      <ListItem
        index={index}
        scaleY={this.state.items[index].scaleY}
        addAtItem={this.addAtItem}
        title={this.state.items[index].title}
      />
    );
  }

  doScroll(e) {
    if(!this.list) { return; }
    this.list.mouseScroll(e);
  }

  componentDidMount() {
    // this.node.addEventListener(
    //   'wheel',
    //   (e) => {
    //     this.doScroll(e);
    //   }
    // );
  }

  render() {
    const surfaceWidth = window.innerWidth;
    const surfaceHeight = window.innerHeight;

    const listViewStyle = {
      top: 0,
      left: 0,
      width: surfaceWidth,
      height: surfaceHeight,
      alpha: 0.5,
    };

    const textStyles = {
      top: 0,
      left: 100,
      width: surfaceWidth,
      height: 20,
      lineHeight: 20,
      fontSize: 12,
      color: '#ffffff',
    };

    return (
      <div ref={(node) => { this.node = node; }}>
        <Stage
          width={surfaceWidth}
          height={surfaceHeight}
          left={0}
          top={0}
          onWheel={(e) => { console.log(e); }}
        >
          <Layer>
            <ListView
              style={listViewStyle}
              numberOfItemsGetter={this.getNumberOfItems}
              itemHeightGetter={this.getItemHeight}
              itemGetter={this.renderItem}
              ref={(list) => { this.list = list; }}
            />
          </Layer>
        </Stage>
      </div>
    );
  }
}


  // <Text style={textStyles}>
  //   Here is some text below an image.
  // </Text>


export default Start;
