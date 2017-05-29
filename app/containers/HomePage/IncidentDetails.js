import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { autobind } from 'core-decorators';
import { Tabs, Tab } from 'react-bootstrap';
import MapView from 'components/MapView';
import AlarmsTable from 'components/AlarmsTable';
import RemediationsTable from 'components/RemediationsTable';
import { API_URL } from '../../constants';
import parseToplologyData from 'utils/parseTopologyData';

import incidentJson from './json/incident.json';
import alarmJson from './json/alarm.json';
import remediationJson from './json/remediation.json';
import topologyJson from './json/topology.json';

@autobind
export default class IncidentDetailsView extends React.Component {
  constructor() {
    super();
    this.state = {
      alarms: false,
      remediation: false,
      topology: false,
      incident: null,
      tunnelPaths: [],
      nodeDetails: [],
      selected: null
    };
  }

  componentWillMount() {
    this.fetchIncident(this.props.id);
    this.getTopologySearch(this.props.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.fetchIncident(nextProps.id);
      this.getTopologySearch(nextProps.id);
    }
  }

  async fetchIncident(id) {
    // const data = await fetch(`${API_URL}/stream?query=select * from correlated_alarm where correlatedAlarmId=${id}`);
    // const incidentJson = await data.json();
    if (incidentJson && incidentJson.entries.length) {
      this.setState({
        incident: incidentJson.entries[0],
      });
      // to scroll down into mapview on alarm click
      const element = document.getElementById('bottom-detail');
      element.scrollIntoView();

      this.getTopologySearch(id);
      this.getAlarms(id);
      this.getRemediations(id);
    }
  }

  async getAlarms(incidentId) {
    // const apiUrl = `${API_URL}/stream?query=select%20*%20from%20alarm%20where%20correlatedAlarmId=${incidentId}`;
    // const data = await fetch(apiUrl);
    // const alarmJson = await data.json();
    if (alarmJson) {
      alarmJson.extracted = [];
      alarmJson.entries.forEach((entry) => {
        // prepare coordinates for alarms icons
        if (entry.geo.geometry.coordinates[0] != null) {
          entry.geo.geometry.coordinates[0] = parseFloat(entry.geo.geometry.coordinates[0]);
        }
        if (entry.geo.geometry.coordinates[1] != null) {
          entry.geo.geometry.coordinates[1] = parseFloat(entry.geo.geometry.coordinates[1]);
        }
        // prepare data for table
        alarmJson.extracted.push({
          id: entry.object.id,
          createdTime: moment.unix(entry.createdTime).format('HH:mm:ss MMM DD YYYY'),
          hostId: entry.actor.id,
          alarmType: entry.object.content.alarmType,
          alarmText: entry.object.content.text,
        });
      });
      this.setState({ alarms: alarmJson });
    }
  }

  async getRemediations(incidentId) {
    // const apiUrl = `${API_URL}/stream?query=select%20similar_correlated_alarms%20from%20correlated_alarm%20where%20correlatedAlarmId=${incidentId}`;
    // const data = await fetch(apiUrl);
    // const remediationJson = await data.json();

    if (remediationJson) {
      remediationJson.extracted = [];
      remediationJson.entries.forEach((entry) => {
        const date = moment.unix(entry.createdTime);
        remediationJson.extracted.push({
          id: entry.object.id,
          createdTime: date.isValid() ? date.format('HH:mm:ss MMM DD YYYY') : null,
          similarity: `${entry.object.content.similarity}%`,
          remediation: entry.object.content.remediation,
        });
      });
      this.setState({ remediation: remediationJson });
    }
  }

  async getTopologySearch(incidentId) {
    // const apiUrl = `${API_URL}/topology-search?correlated_alarm_id=${incidentId}&aggregate_group_type=Location`;
    // const data = await fetch(apiUrl);
    // const topologyJson = await data.json();
    setTimeout(() => {
      if (topologyJson) {
        console.log("------", topologyJson);
        parseToplologyData(topologyJson.paths);
        this.setState({ topology: topologyJson.paths });
      }
    }, 100);
  }

  render() {
    const { topology, incident, alarms, remediation, strokeWidth, tunnelPaths } = this.state;
    console.log("TOpology", topology);
    if (!incident) return null;

    return (
      <div>
        <Tabs>
          <Tab eventKey={1} title="Topology">
            <MapView incidentId={this.props.id} incidentDetails={incident} topologyData={topology} alarms={alarms} />
          </Tab>
          <Tab eventKey={2} title="Alarms">
            <AlarmsTable alarms={alarms.extracted} />
          </Tab>
          <Tab eventKey={3} title="Remediation">
            <RemediationsTable remediations={remediation.extracted} />
          </Tab>
        </Tabs>
      </div>
    );
  }
}
