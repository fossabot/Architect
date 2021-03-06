import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { reducer as formReducer } from 'redux-form';
import undoable, { excludeAction } from 'redux-undo';
import protocol, { protocolEpic } from './protocol';

export const rootEpic = combineEpics(
  protocolEpic,
);

export const rootReducer = combineReducers({
  form: formReducer,
  protocol: undoable(
    protocol,
    {
      limit: 25,
      filter: excludeAction(['persist/REHYDRATE']),
    },
  ),
});
