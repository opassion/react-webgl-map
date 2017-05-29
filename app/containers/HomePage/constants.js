/*
 * HomeConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const UPDATE_TOPOLOGY = 'UPDATE_TOPOLOGY';
export const UPDATE_ALARM = 'UPDATE_ALARM';
export const UPDATE_REMEDIATION = 'UPDATE_REMEDIATION';
export const UPDATE_CURRENT_INCIDENT = 'UPDATE_CURRENT_INCIDENT';
export const ADD_INCIDENT_TAB = 'ADD_INCIDENT_TAB';
export const REMOVE_INCIDENT_TAB = 'REMOVE_INCIDENT_TAB';
export const SET_TAB = 'SET_TAB';
