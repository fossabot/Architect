import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { transform } from 'lodash';

const linear = x => x;

function* easing(from, to, duration, easingMethod = linear) {
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
    propTypes = {
      from: PropTypes.object,
      to: PropTypes.object,
    };

    componentWillReceiveProps(newProps) {
      // initalise props
      this.startAnimation(newProps);
    }

    startAnimation() {
      this.start = performance.now();

      this.transitions = transform(
        this.props.to,
        (memo, value, key) => ({
          [key]: easing(this.props.from[key], value, 1000),
          ...memo,
        }),
        {},
      );

      this.update();
    }

    update = () => {
      if (performance.now() - this.start >= 1000) { return; }

      const props = transform(
        this.transitions,
        (memo, value, key) => ({
          [key]: value.next(),
          ...memo,
        }),
        {},
      );

      this.setState({
        props,
      });

      requestAnimationFrame(this.update);
    }

    render() {
      return <WrappedComponent {...this.props} {...this.state.props} />;
    }
  };

export default easeProps;
