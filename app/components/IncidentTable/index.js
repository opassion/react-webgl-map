import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import moment from 'moment';
import axios from 'axios';
import { autobind } from 'core-decorators';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Glyphicon } from 'react-bootstrap';
import { updateTopology, updateAlarm, updateRemediation, updateCurrentIncident, openIncidentTab } from 'containers/HomePage/actions';
import TableWrapper from './TableWrapper';
import ShortenCell from './ShortenCell';
import ServiceCell from './ServiceCell';
import IncidentEditModal from '../IncidentEditModal';
import { API_URL } from '../../constants';
import incidentList from './incidents.json';

const EditButton = styled(Glyphicon)`
    position: absolute !important;
    bottom: 3px;
    top: initial !important;
    right: 23px;
    cursor: pointer;
`;

function cellFormatter(cell, row) {
  return `${cell}`;
}

function contentWithTooltip(cell, row) {
  return <span title={row.description}>{cell}</span>
}


function serviceFormatter(cell, row) {
  return <ServiceCell value={cell} length={2} />;
}

const IncidnetLink = styled.a`
  padding: 3px;
  font-weight: 600;
  cursor: pointer;
  display: inline-block;
`;

@autobind
class IncidentTable extends Component {
  constructor() {
    super();

    this.state = {
      incidents: [],
      pendingIncidents: [],
      editModal: {
        visible: false,
        data: null,
      },
    };
  }

  componentDidMount() {
    this.getIncidentDetails();
  }

  async getIncidentDetails(nextSince = 0) {
    // let apiUrl = `${API_URL}/stream?query=select * from correlated_alarm`;
    // if (nextSince) {
    //   apiUrl += ` where updatedTime > ${nextSince}`;
    // }

    // const data = await fetch(apiUrl);
    // const result = await data.json();
    // if (result) {
    //   this.refineIncidentData(result);
    //   const nextSince = parseInt(moment(result.nextSince).valueOf() / 1000);
    //   setTimeout(() => {
    //     this.getIncidentDetails(nextSince);
    //   }, 5000);
    // }
    this.refineIncidentData(incidentList);
  }

  toggleEditModal(data) {
    this.setState({
      editModal: {
        visible: !this.state.editModal.visible,
        data,
      },
    });
  }

  saveEdit(data) {
    const row = this.state.editModal.data.row;
    const editField = this.state.editModal.data.field;

    const fields = {
      probableRootCause: 'root_cause',
      possibleRemediation: 'remediation'
    };

    axios.post(`http://ec2-34-210-23-118.us-west-2.compute.amazonaws.com:8080/update_ca_details`, {
      "incident_id": row.id,
      [fields[editField]]: data.description
    });

    this.setState({
      incidents: this.state.incidents.map(i => {
        if (i.object && i.object.id == row.id) {
          i.object.content[this.state.editModal.data.field] = data.description;
          return i;
        } else {
          return i;
        }
      }),
    });
    this.toggleEditModal();
  }

  _renderTime(time, reverse = true) {
    if (time === 'None' || !time) {
      return '';
    }

    if (!reverse) {
      return moment(time).format('HH:mm:ss <br> MMM DD YYYY');
    }

    return moment.unix(time).format('HH:mm:ss MMM DD YYYY');
  }

  customizeServices(services, degradation = false) {
    let result = '';

    services.forEach((item) => {
      result += `<br>${item.deviceName} | ${item.serviceType}`;
      if (degradation) {
        result += ` | ${item.attrs.capacity_loss}`;
      }
    });
    return result.substr(4);
  }

  refineIncidentData(result) {
    const incidents = [];

    result.entries.forEach((entry) => {
      let exists = false;

      this.state.incidents.forEach((incident) => {
        if (entry.id === incident.id) {
          exists = true;
        }
      });

      if (!exists) {
        incidents.push(entry);
      }
    });

    if (this.state.incidents.length === 0) {
      this.setState({
        incidents,
      });
    } else {
      this.setState({
        pendingIncidents: [...this.state.pendingIncidents, ...incidents],
      });
    }
  }

  onIncidentClick(row) {
    this.props.onUpdateCurrentIncident(this.state.incidents[row.index]);
    // this.getTopologySearch(row.id);
    // this.getAlarms(row.id);
    // this.getRemediations(row.id);
    // console.log(`${row} clicked!`);
  }

  refreshData() {
    this.setState({
      incidents: [...this.state.incidents, ...this.state.pendingIncidents],
      pendingIncidents: [],
    });
  }

  selectPastIncident(e, id) {
    e.preventDefault();
    e.stopPropagation();
    this.props.openIncidentTab(id);
    return false;
  }

  RenderPastIncidents(data) {
    return <div>{data.map((i) => <IncidnetLink onClick={(e) => this.selectPastIncident(e, i)} key={i}>{i}</IncidnetLink>)}</div>;
  }

  shortenFormatter(field, cell, row) {
    const show = (e) => {
      e.stopPropagation();
      this.toggleEditModal({cell, row, field});
    };
    return (
      <ShortenCell value={cell} length={30}>
        <EditButton glyph="edit" onClick={show} />
      </ShortenCell>
    );
  }

  render() {
    const { incidents, pendingIncidents } = this.state;

    const incidentFields = [];

    let index = 0;
    incidents.forEach((entry) => {
      incidentFields.push({
        index,
        fid: entry.id,
        id: entry.object.id,
        description: entry.object.content.summary,
        updatedTime: this._renderTime(entry.updatedTime, false),
        alarmCount: entry.object.content.alarmCount,
        priority: entry.object.content.priority,
        serviceOutage: this.customizeServices(entry.object.content.serviceOutage),
        serviceDegradation: this.customizeServices(entry.object.content.serviceDegradation, true),
        similarPastIncidents: entry.object.content.similarPastIncidents,
        domains: entry.object.content.domains,
        layers: entry.object.content.layers,
        createdTime: this._renderTime(entry.createdTime, false),
        probableRootCause: entry.object.content.probableRootCause,
        possibleRemediation: entry.object.content.possibleRemediation,
      });
      index++;
    });

    const options = {
      onRowClick: this.onIncidentClick.bind(this),
      defaultSortName: 'fid',
      defaultSortOrder: 'asc',
      sizePerPageList: [5, 10],
      sizePerPage: 5,
    };

    return (
      <TableWrapper>
        <div className="table-top clearfix">
          {pendingIncidents.length ? (
            <div className="text-center">
              <div>
                <strong>{pendingIncidents.length} new incidents. <a href="#" onClick={this.refreshData}>Refresh</a></strong>
              </div>
            </div>
          ) : null}
          <select className="incident-type pull-left">
            <option>Open Incidents</option>
            <option>Closed Incidents</option>
          </select>
          <div className="incident-counts pull-right">
            Closed Incidents :
            <span>0</span>
          </div>
          <div className="incident-empty-space pull-right">
          &nbsp;&nbsp;
          </div>
          <div className="incident-counts pull-right">
            Open Incidents :
            <span>{incidentFields.length}</span>
          </div>
        </div>
        <BootstrapTable data={incidentFields} striped hover search pagination options={options}>
          <TableHeaderColumn dataField="id" dataAlign="center" dataSort width="48px" dataFormat={contentWithTooltip}>ID</TableHeaderColumn>
          <TableHeaderColumn dataField="updatedTime" dataSort width="" dataFormat={cellFormatter}>Changed At</TableHeaderColumn>
          <TableHeaderColumn dataField="alarmCount" dataSort>Correlated Alarm Count</TableHeaderColumn>
          <TableHeaderColumn dataField="priority" dataAlign="center" dataSort width="60px">Priority</TableHeaderColumn>
          <TableHeaderColumn dataField="serviceOutage" dataSort width="170px" dataFormat={serviceFormatter}>Service Outage</TableHeaderColumn>
          <TableHeaderColumn dataField="serviceDegradation" dataSort width="250px" dataFormat={serviceFormatter}>Service Degradation</TableHeaderColumn>
          <TableHeaderColumn dataField="similarPastIncidents" dataFormat={this.RenderPastIncidents} dataSort>Similar Past Incidents</TableHeaderColumn>
          <TableHeaderColumn dataField="domains" dataSort>Domains</TableHeaderColumn>
          <TableHeaderColumn dataField="probableRootCause" dataSort width="150px" dataFormat={this.shortenFormatter.bind(this, 'probableRootCause')}>Probable Root Cause</TableHeaderColumn>
          <TableHeaderColumn dataField="possibleRemediation" dataSort dataFormat={this.shortenFormatter.bind(this, 'possibleRemediation')}>Possible Remediation</TableHeaderColumn>
          <TableHeaderColumn dataField="fid" isKey dataSort width="1px">Fake ID</TableHeaderColumn>
        </BootstrapTable>
        {this.state.editModal.visible && <IncidentEditModal onHide={e => this.toggleEditModal()} onSubmit={this.saveEdit} />}
      </TableWrapper>
    );
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    onUpdateTopology: (paths) => dispatch(updateTopology(paths)),
    onUpdateAlarm: (alarms) => dispatch(updateAlarm(alarms)),
    onUpdateRemediation: (remediations) => dispatch(updateRemediation(remediations)),
    onUpdateCurrentIncident: (incident) => dispatch(updateCurrentIncident(incident)),
    openIncidentTab: (incidentId) => dispatch(openIncidentTab(incidentId)),
  };
}

const mapStateToProps = createStructuredSelector({});

export default connect(mapStateToProps, mapDispatchToProps)(IncidentTable);

IncidentTable.propTypes = {
  onUpdateTopology: React.PropTypes.func,
  onUpdateAlarm: React.PropTypes.func,
  onUpdateRemediation: React.PropTypes.func,
  onUpdateCurrentIncident: React.PropTypes.func,
};
