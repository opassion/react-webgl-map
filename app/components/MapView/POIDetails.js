import React from 'react';
import styled from 'styled-components';
import ColapsibleContainer from 'components/ColapsibleContainer';
import { Tabs, Tab} from 'react-bootstrap';
import map from 'lodash/map';

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

export default class POIDetails extends React.Component {

  render() {
    const { data: { devices, alarms } } = this.props;
    const nodes = [];
    devices.forEach(a => nodes.push.apply(nodes, a.nodes));

    return (
      <ColapsibleContainer right >
        <Tabs>
          <Tab title="Alarms" eventKey="1">
            <table className="table table-condensed">
              <thead>
                <tr>
                  <th>AlarmID</th>
                  <th>Host</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {map(alarms, a => (
                  <tr>
                    <td>{a.object.id}</td>
                    <td>{a.actor.id}</td>
                    <td>{a.object.content.alarmType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Tab>
          <Tab title="Devices" eventKey="2">
            <table className="table table-condensed">
              <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>layers</th>
              </tr>
              </thead>
              <tbody>
              {map(nodes, n => (
                <tr>
                  <td>{n.attrs.name}</td>
                  <td>{n.attrs.role}</td>
                  <td>{n.layers.join(', ')}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </Tab>
        </Tabs>
      </ColapsibleContainer>
    );
  }
}
