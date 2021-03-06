import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Zoom } from '../behaviours';
import TimelineEditSkipLogic from './TimelineEditSkipLogic';

const EditStageButton = Zoom(
  ({
    onEditStage,
    snapshotSrc,
  }) => (
    <div
      className="timeline-stage__preview"
      role="button"
      onClick={onEditStage}
      tabIndex="0"
    >
      <img
        src={snapshotSrc}
        alt=""
        className="timeline-stage__preview-image"
      />
    </div>
  ),
);

class TimelineStage extends PureComponent {
  static propTypes = {
    type: PropTypes.string.isRequired,
    onEditStage: PropTypes.func.isRequired,
    onEditSkipLogic: PropTypes.func.isRequired,
  };

  snapshotSrc() {
    return `/images/timeline/stage--${this.props.type}.png`;
  }

  render() {
    const {
      onEditStage,
      onEditSkipLogic,
    } = this.props;

    return (
      <div className="timeline-stage">
        <EditStageButton
          onEditStage={onEditStage}
          snapshotSrc={this.snapshotSrc()}
        />
        <TimelineEditSkipLogic
          onEditSkipLogic={onEditSkipLogic}
        />
      </div>
    );
  }
}

export default TimelineStage;
