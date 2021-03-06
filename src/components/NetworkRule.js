import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { toPairs, includes } from 'lodash';
import RuleDropDown from './RuleDropDown';
import RuleInput from './RuleInput';

const operators = toPairs({
  ANY: 'Any',
  NONE: 'None',
  EXACTLY: 'COUNT Exactly',
  NOT: 'COUNT Not',
  GREATER_THAN: 'COUNT Greater Than',
  GREATER_THAN_OR_EQUAL: 'COUNT Greater Than or Exactly',
  LESS_THAN: 'COUNT Less Than',
  LESS_THAN_OR_EQUAL: 'COUNT Less Than or Exactly',
});

class NetworkRule extends PureComponent {
  static propTypes = {
    onUpdateRule: PropTypes.func,
    options: PropTypes.shape({
      operator: PropTypes.string,
      value: PropTypes.string,
    }),
  };

  static defaultProps = {
    options: {
      operator: '',
      value: '',
    },
    onUpdateRule: () => {},
  };

  showValue() {
    return !!this.props.options.operator &&
      !includes(['ANY', 'NONE'], this.props.options.operator);
  }

  render() {
    const {
      onUpdateRule,
      options: { operator, value },
    } = this.props;

    return (
      <div className="rule rule--outer">
        <div className="rule__options">
          <div className="rule__option rule__option--operator">
            <RuleDropDown
              options={operators}
              value={operator}
              placeholder="{rule}"
              onChange={newValue => onUpdateRule(newValue, 'operator')}
            />
          </div>
          {this.showValue() && (
            <div className="rule__option rule__option--value">
              <RuleInput
                type="number"
                value={value}
                onChange={newValue => onUpdateRule(newValue, 'value')}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default NetworkRule;
