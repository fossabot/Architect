/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { Start } from '../Start';

const mockProps = {
};

describe('<Start />', () => {
  it('can render', () => {
    const component = shallow(<Start {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
