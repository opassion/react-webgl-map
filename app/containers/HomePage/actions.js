/*
 * Home Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  UPDATE_TOPOLOGY,
  UPDATE_ALARM,
  UPDATE_REMEDIATION,
  UPDATE_CURRENT_INCIDENT,
  ADD_INCIDENT_TAB,
  REMOVE_INCIDENT_TAB,
  SET_TAB,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CHANGE_USERNAME
 */

export function updateTopology(paths) {
  return {
    type: UPDATE_TOPOLOGY,
    paths,
  };
}

export function updateAlarm(alarms) {
  return {
    type: UPDATE_ALARM,
    alarms,
  };
}

export function updateRemediation(remediations) {
  return {
    type: UPDATE_REMEDIATION,
    remediations,
  };
}

export function updateCurrentIncident(incident) {
  return {
    type: UPDATE_CURRENT_INCIDENT,
    incident,
  };
}

export function openIncidentTab(id) {
  return {
    type: ADD_INCIDENT_TAB,
    id,
  };
}

export function closeIncidentTab(id) {
  return {
    type: REMOVE_INCIDENT_TAB,
    id,
  };
}

export function setTab(id) {
  return {
    type: SET_TAB,
    id,
  };
}
