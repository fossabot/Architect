import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { toPairs, has, includes } from 'lodash';
import { SortableElement } from 'react-sortable-hoc';
import RuleDragHandle from './RuleDragHandle';
import RuleDropDown from './RuleDropDown';
import RuleInput from './RuleInput';

const operators = toPairs({
  EXACTLY: 'is Exactly',
  EXISTS: 'Exists',
  NOT_EXISTS: 'Not Exists',
  NOT: 'is Not',
  GREATER_THAN: 'is Greater Than',
  GREATER_THAN_OR_EQUAL: 'is Greater Than or Exactly',
  LESS_THAN: 'is Less Than',
  LESS_THAN_OR_EQUAL: 'is Less Than or Exactly',
});

class AlterRule extends PureComponent {
  static propTypes = {
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    onUpdateRule: PropTypes.func,
    onDeleteRule: PropTypes.func,
    options: PropTypes.shape({
      type: PropTypes.string,
      operator: PropTypes.string,
      attribute: PropTypes.string,
      value: PropTypes.string,
    }),
    nodeTypes: PropTypes.array,
    nodeAttributes: PropTypes.object,
    className: PropTypes.string,
  };

  static defaultProps = {
    options: {
      type: '',
      operator: '',
      attribute: '',
      value: '',
    },
    onUpdateRule: () => {},
    onDeleteRule: () => {},
    nodeTypes: [],
    nodeAttributes: {},
    className: '',
  };

  showAttributes() {
    return has(this.props.nodeAttributes, this.props.options.type);
  }

  showOperator() {
    return !!this.props.options.attribute;
  }

  showValue() {
    return !!this.props.options.operator &&
      !includes(['EXISTS', 'NOT_EXISTS'], this.props.options.operator);
  }

  render() {
    const {
      id,
      nodeTypes,
      nodeAttributes,
      onUpdateRule,
      onDeleteRule,
      options: { type, operator, attribute, value },
      className,
    } = this.props;

    return (
      <div className={cx('rule', 'rule--alter', className)}>
        <RuleDragHandle />
        <div className="rule__options">
          <div className="rule__option rule__option--type">
            <RuleDropDown
              options={nodeTypes}
              value={type}
              placeholder="{type}"
              onChange={newValue => onUpdateRule(newValue, id, 'type')}
            />
          </div>
          {this.showAttributes() && (
            <div className="rule__option rule__option--attribute">
              <RuleDropDown
                options={has(nodeAttributes, type) ? nodeAttributes[type] : []}
                value={attribute}
                placeholder="{variable}"
                onChange={newValue => onUpdateRule(newValue, id, 'attribute')}
              />
            </div>
          )}
          {this.showOperator() && (
            <div className="rule__option rule__option--operator">
              <RuleDropDown
                options={operators}
                value={operator}
                placeholder="{rule}"
                onChange={newValue => onUpdateRule(newValue, id, 'operator')}
              />
            </div>
          )}
          {this.showValue() && (
            <div className="rule__option rule__option--value">
              <RuleInput
                value={value}
                onChange={newValue => onUpdateRule(newValue, id, 'value')}
              />
            </div>
          )}
        </div>
        <div className="rule__delete" onClick={() => onDeleteRule(id)} />
      </div>
    );
  }
}

export { AlterRule };

export default SortableElement(AlterRule);
