import React, { PureComponent } from 'react';
import { Layer, Stage } from 'react-konva';
import { constant, times } from 'lodash';
import ListView from './ListView';
import ListItem from './ListItem';

class Timeline extends PureComponent {
  constructor(props) {
    const surfaceHeight = window.innerHeight;

    super(props);

    this.state = {
      targetHeight: surfaceHeight / 2,
      items: times(5, constant({ title: 'foo', height: surfaceHeight / 2, scaleY: 1 })),
    };

    this.update();
  }

  getItemProps = index => this.state.items[index];

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
      };
    });

    this.setState({ items });

    requestAnimationFrame(() => this.update());
  }

  renderItem = index => (
    <ListItem
      index={index}
      addAtItem={this.addAtItem}
      {...this.getItemProps(index)}
    />
  );

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

    return (
      <Stage
        width={surfaceWidth}
        height={surfaceHeight}
        left={0}
        top={0}
      >
        <Layer>
          <ListView
            style={listViewStyle}
            numberOfItems={this.state.items.length}
            itemPropsGetter={this.getItemProps}
            itemGetter={this.renderItem}
            ref={(list) => { this.list = list; }}
          />
        </Layer>
      </Stage>
    );
  }
}

export default Timeline;
