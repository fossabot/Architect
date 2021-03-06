/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import ScreenTransition from '../ScreenTransition';

const mockProps = {
};

describe('<ScreenTransition />', () => {
  it('can render', () => {
    const component = shallow(<ScreenTransition {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
