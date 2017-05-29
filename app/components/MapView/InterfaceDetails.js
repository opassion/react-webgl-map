import React from 'react';
import styled from 'styled-components';
import ColapsibleContainer from 'components/ColapsibleContainer';
import { Tabs, Tab} from 'react-bootstrap';

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

export default class InterfaceDetails extends React.Component {

  render() {
    const { data } = this.props;
    return (
      <ColapsibleContainer right >
        <table className="table table-condensed">
          <thead>
          <tr>
            <th>Hostname</th>
            <th>Subnet</th>
            <th>IP</th>
            <th>Name</th>
          </tr>
          </thead>
          <tbody>
          {data.map(n => (
            <tr>
              <td>{n.attrs.hostname}</td>
              <td>{n.attrs.subnet}</td>
              <td>{n.attrs.ip_addr}</td>
              <td>{n.attrs.name}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </ColapsibleContainer>
    );
  }
}
