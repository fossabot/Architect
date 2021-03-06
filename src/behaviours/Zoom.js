/* eslint-disable */
import React, { PureComponent } from 'react';
import { compose } from 'redux';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import anime from 'animejs';
import { getContext } from 'recompose';
import { animation } from 'network-canvas-ui';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const Zoom = WrappedComponent =>
  getContext(
    { constraints: PropTypes.array },
  )(
    class extends PureComponent {
      static propTypes = {
        zoomColors: PropTypes.array,
        constraints: PropTypes.array,
      };

      static defaultProps = {
        zoomColors: ['#ffffff', '#2d2955'],
        constraints: [0, 0, 0, 0],
      };

      static displayName = `Draft(${getDisplayName(WrappedComponent)})`;

      componentDidMount() {
        this.root = document.getElementsByTagName('body')[0];
        this.node = ReactDOM.findDOMNode(this); // eslint-disable-line react/no-find-dom-node
        this.node.addEventListener('click', this.onClick);
      }

      componentWillUnmount() {
        this.node.removeEventListener('click', this.onClick);
      }

      onClick = () => {
        const [top, right, bottom, left] = this.props.constraints;

        const start = this.node.getBoundingClientRect();
        const pseudoElement = document.createElement('div');

        const targetWidth = window.innerWidth - right - left;
        const targetHeight = window.innerHeight - top - bottom;

        const scaleX = start.width / targetWidth;
        const scaleY = start.height / targetHeight;

        // scaling gives us part of the neccessary offset, the difference
        // between the targetHeight and the start height:
        const scaleYoffset = (targetHeight - start.height) / 2;
        const scaleXoffset = (targetWidth - start.width) / 2;

        // We then need to find the difference between this offset, and
        // the location of the div on screen to work out what translation
        // we need:
        const translateY = start.top - top - scaleYoffset;
        const translateX = start.left - left - scaleXoffset;

        pseudoElement.setAttribute(
          'style',
          `position: absolute;
          transform: translateZ(0);
          top: ${top}px;
          left: ${left}px;
          width: ${targetWidth}px;
          height: ${targetHeight}px;`,
        );

        this.root.appendChild(pseudoElement);

        anime.timeline().add({
          targets: pseudoElement,
          elasticity: 0,
          easing: 'easeInOutQuad',
          duration: animation.duration.fast,
          translateX: [translateX, 0],
          translateY: [translateY, 0],
          scaleY: [scaleY, 1],
          scaleX: [scaleX, 1],
          backgroundColor: this.props.zoomColors,
        }).add({
          targets: pseudoElement,
          elasticity: 0,
          easing: 'easeInOutQuad',
          duration: animation.duration.fast,
          opacity: [1, 0],
        }).finished.then(() => {
          this.root.removeChild(pseudoElement);
        });
      }

      render() {
        return (
          <WrappedComponent {...this.props} />
        );
      }
    }
  )

export default Zoom;
