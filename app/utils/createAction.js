/*
  This helper module can automatically create actions with different stats so we don't have to manually type
  different actions.
 */
import isArray from 'lodash/isArray';

const APP = 'AUGUR';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';
const RESET = 'RESET';

export const success = (action) => `${APP}/${action}/${SUCCESS}`;
export const fail = (action) => `${APP}/${action}/${ERROR}`;
export const reset = (action) => `${APP}/${action}/${RESET}`;
export const createAction = (action, module) => {
  const prefix = `${APP}/${module ? (module+'/') : ''}`;

  if(isArray(action)) {
    return action.map(i => `${prefix}${i}`)
  } else {
    return `${prefix}${action}`;
  }

};
