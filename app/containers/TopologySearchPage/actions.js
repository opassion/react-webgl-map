import {
  FETCH
} from './constants';

export const doTopologySearch = (params) => ({
  type: FETCH,
  payload: params
});
