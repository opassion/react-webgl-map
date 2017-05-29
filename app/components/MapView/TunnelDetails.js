import React from 'react';
import styled from 'styled-components';
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

export default class TunnelDetails extends React.Component {

  render() {
    const { data, name } = this.props;
    const rows = [];
    data.forEach((p, idx) => {
      p.nodes.forEach(i => {
        rows.push({
          label: 'P'+(idx+1),
          details: i.attrs.name,
          role: i.attrs.role
        })
      })
    });

    return (
      <ColapsibleContainer right>
        <div>
          <h5>Paths for Tunnel <em>{name}</em></h5>
          <table className="table table-condensed">
            <thead>
              <tr>
                <th>Path Number</th>
                <th>Device</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
            {rows.map(i => (
              <tr>
                <td>{i.label}</td>
                <td>{i.details}</td>
                <td>{i.role}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </ColapsibleContainer>
    );
  }
}
