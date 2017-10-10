const ADD_STAGE = 'ADD_STAGE';

const initialState = [{ id: 1, type: 'name-generator' }, { id: 2, type: 'name-generator' }];

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_STAGE:
      return [
        ...state.slice(0, action.index + 1),
        { type: action.interfaceType },
        ...state.slice(action.index + 1),
      ];
    default:
      return state;
  }
}

function addStage(interfaceType, index) {
  return {
    type: ADD_STAGE,
    interfaceType,
    index,
  };
}

const actionCreators = {
  addStage,
};

const actionTypes = {
  ADD_STAGE,
};

export {
  actionCreators,
  actionTypes,
};
