/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectHome = (state) => state.get('home');

const makeSelectTopologyPaths = () => createSelector(
  selectHome,
  (homeState) => homeState.get('topologyPaths')
);

const makeSelectAlarms = () => createSelector(
  selectHome,
  (homeState) => homeState.get('alarms')
);

const makeSelectRemediations = () => createSelector(
  selectHome,
  (homeState) => homeState.get('remediation')
);

const makeSelectCurrentIncident = () => createSelector(
  selectHome,
  (homeState) => homeState.get('currentIncident')
);

const selectIncidentTabs = () => createSelector(
  selectHome,
  (homeState) => homeState.get('incidentTabs').toJS()
);

export {
  selectHome,
  makeSelectTopologyPaths,
  makeSelectAlarms,
  makeSelectRemediations,
  makeSelectCurrentIncident,
  selectIncidentTabs,
};
