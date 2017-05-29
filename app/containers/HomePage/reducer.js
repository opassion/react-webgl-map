/*
 * HomeReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */
import { fromJS } from 'immutable';

import {
  UPDATE_TOPOLOGY,
  UPDATE_ALARM,
  UPDATE_REMEDIATION,
  UPDATE_CURRENT_INCIDENT,
  ADD_INCIDENT_TAB,
  REMOVE_INCIDENT_TAB,
  SET_TAB
} from './constants';

// The initial state of the App
const initialState = fromJS({
  topologyPaths: false,
  alarms: false,
  remediations: false,
  currentIncident: false,
  incidentTabs: [],
  selectedTab: 'tab1'
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    // Update Topology Paths for MAP
    case UPDATE_TOPOLOGY:
      return state
        .set('topologyPaths', action.paths);
    // Update Alarms List for Table and ICONS on MAP
    case UPDATE_ALARM:
      return state
        .set('alarms', action.alarms);
    // Update Remediation List
    case UPDATE_REMEDIATION:
      return state
        .set('remediation', action.remediation);
    case UPDATE_CURRENT_INCIDENT:
    // Update Current Incident
      return state
        .set('currentIncident', action.incident)
        .set('selectedTab', 'tab1');
    case ADD_INCIDENT_TAB:
      const tabs = state.get('incidentTabs').toJS();
      if (tabs.indexOf(action.id) === -1)
        return state.updateIn(['incidentTabs'], tabs =>  tabs.push(action.id)).set('selectedTab', action.id);
      else
        return state;
    case REMOVE_INCIDENT_TAB:
      return state.updateIn(['incidentTabs'], tabs => tabs.filter(id => id != action.id)).set('selectedTab', 'tab1');
    case SET_TAB:
      return state.set('selectedTab', action.id);
    default:
      return state;
  }
}

export default homeReducer;
