import { call, put } from 'redux-saga/effects'
import { takeEvery } from 'redux-saga';
import { topologySearch } from './api';
import { success, fail } from 'utils/createAction';
import { FETCH } from './constants';

function* searchTopology(action) {
  const { payload } = action;
  try {
    const result = yield call(topologySearch, payload);
    yield put({type: success(FETCH), payload: result});
  } catch (e) {
    yield put({type: fail(FETCH), payload: e});
  }
}

export default function* () {
  yield [
    takeEvery(FETCH, searchTopology)
  ]
}
