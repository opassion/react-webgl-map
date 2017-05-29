import React from 'react';
import styled from 'styled-components';
import map from 'lodash/map';
import ColapsibleContainer from 'components/ColapsibleContainer';

const Container = styled.div`
  width: 400px;
  min-height: 200px;
  max-height: 400px;
  border: 1px solid #eee;
  box-shadow: 1px 1px 3px rgba(0,0,0,.1);
  padding: 10px;
  background-color: white;
  position: absolute;
  top: 5px;
  left: 5px;
`;

function customizeServices(services, degradation = false) {
  const result = [];

  services.forEach((item) => {
    let s = ''
    s += `${item.deviceName} | ${item.serviceType}`;
    if (degradation) {
      s += ` | ${item.attrs.capacity_loss}`;
    }
    s = s.substr(4);
    result.push(<div>{s}</div>)
  });

  return result;
}

export default class IncidentDetails extends React.Component {

  render() {
    const { data, alarms, navigateTo } = this.props;

    return (
      <ColapsibleContainer left>
        <dl className="dl-horizontal">
          <dt>ID</dt>
          <dd>{data.object.id}</dd>
          <dt>Summary</dt>
          <dd>{data.object.content.summary}</dd>
          <dt>Changed at</dt>
          <dd>{data.updatedTime}</dd>
          <dt>Correlated Alarm Count</dt>
          <dd>{data.object.content.alarmCount}</dd>
          <dt>Priority</dt>
          <dd>{data.object.content.priority}</dd>
          <dt>Alarm locations</dt>
          <dd>
            {map(alarms, (d) => (
              <div id={d.id}>
                <a onClick={e => navigateTo(d.coordinates)}>{d.display_name}</a>
              </div>
            ))}
          </dd>
          <dt>Service Outage</dt>
          <dd>{customizeServices(data.object.content.serviceOutage)}</dd>
          <dt>Service Degradation</dt>
          <dd>{customizeServices(data.object.content.serviceDegradation, true)}</dd>
          <dt>Similar Past Incidents</dt>
          <dd>{data.object.content.similarPastIncidents.join(', ')}</dd>
          <dt>Domains</dt>
          <dd>{data.object.content.domains}</dd>
          <dt>Probable Root Cause</dt>
          <dd>{data.object.content.probableRootCause}</dd>
          <dt>Possible Remediation</dt>
          <dd>{data.object.content.possibleRemediation}</dd>
        </dl>
      </ColapsibleContainer>
    );
  }
}
