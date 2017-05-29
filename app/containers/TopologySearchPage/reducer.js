import { fromJS } from 'immutable';
import { success, fail } from 'utils/createAction';
import {
  FETCH
} from './constants';
import parseData from 'utils/parseTopologyData';

const initialState = fromJS({
  topologyPaths: false
});

function topologyReducer(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case success(FETCH):
      return state
        .set('topologyPaths', parseData(payload.paths));
    default:
      return state;
  }
}

export default topologyReducer;
