import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { times, random } from 'lodash';
import Timeline from './Timeline';
import { actionCreators as stageActions } from '../ducks/modules/stages';

// const items = times(5, () => ({ title: `foo ${random(0, 100)}`, type: 'name-generator' }));

class Start extends PureComponent {
  propTypes = {
    addStage: PropTypes.func.isRequired,
    stages: PropTypes.array.isRequired,
  };

  onAddStage = (index) => {
    this.props.addStage('name-generator', index);
  };

  onEditStage = () => {
  };

  onEditSkip = () => {
  };

  render() {
    return (
      <Timeline
        items={this.props.stages}
        onAddStage={this.onAddStage}
        onEditStage={this.onEditStage}
        onEditSkip={this.onEditSkip}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    stages: state.stages,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addStage: bindActionCreators(stageActions.addStage, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Start);
