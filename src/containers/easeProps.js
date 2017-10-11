import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { reduce, isEqual } from 'lodash';

// const linear = x => x;
// const sq = x => x;
const easeInOutSine = x =>
  -(Math.cos(Math.PI * x) - 1) / 2;

function* easing(from, to, duration, easingMethod = easeInOutSine) {
  const start = performance.now();
  let dt = 0;
  while (true) {
    if (dt > duration) { yield to; }
    dt = performance.now() - start;
    yield from + ((to - from) * easingMethod(dt / duration));
  }
}

const easeProps = WrappedComponent =>
  class extends PureComponent {
    static propTypes = {
      from: PropTypes.object,
      to: PropTypes.object,
      base: PropTypes.object,
    };

    static defaultProps = {
      from: {},
      to: {},
      base: {},
    };

    constructor(props) {
      super(props);

      this.state = {
        props: {},
      };

      this.easedProps = {};
      this.transitions = {};
    }

    componentDidMount() {
      this.end();
      console.log('mounted');
    }

    componentWillReceiveProps(nextProps) {
      if (!isEqual(nextProps.to, this.props.to) || !isEqual(nextProps.from, this.props.from)) {
        this.startAnimation(nextProps);
      }
    }

    end() {
      this.transitions = {};

      this.easedProps = { ...this.props.to };

      this.setState({
        props: this.props.to,
      });
    }

    startAnimation(nextProps) {
      if (this.animationFrame) { cancelAnimationFrame(this.animationFrame); }

      this.start = performance.now();

      const from = {
        ...this.props.from,
        ...this.easedProps,
      };

      console.log('startAnim', from, nextProps.to);

      this.transitions = reduce(
        nextProps.to,
        (memo, value, key) => ({
          [key]: easing(from[key], value, 1000),
          ...memo,
        }),
        {},
      );

      this.update();
    }

    update = () => {
      if (performance.now() - this.start >= 1000) {
        this.end();
        return;
      }

      const props = reduce(
        this.transitions,
        (memo, value, key) => ({
          [key]: value.next().value,
          ...memo,
        }),
        {},
      );

      this.easedProps = { ...props };

      this.setState({
        props,
      });

      this.animationFrame = requestAnimationFrame(this.update);
    }

    render() {
      const props = reduce(
        this.state.props,
        (memo, value, key) => ({
          [key]: value + (this.props.base[key] ? this.props.base[key] : 0),
          ...memo,
        }),
        {},
      );
      return <WrappedComponent {...this.props} {...props} />;
    }
  };

export default easeProps;
