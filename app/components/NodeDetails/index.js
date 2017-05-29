import React from 'react';
import styled from 'styled-components';
import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap';

const Container = styled.div`
  width: 200px;
  min-height: 200px;
  max-height: 400px;
  border: 1px solid #eee;
  box-shadow: 1px 1px 3px rgba(0,0,0,.15);
  padding: 10px;
  background-color: white;
  position: absolute;
  top: 0
`;

export default class NodeDetails extends React.Component {
  render() {
    return (
      <Container>
        <h3>Details</h3>
        <hr/>
        <div>
          <FormGroup>
            <ControlLabel>Search</ControlLabel>
            <FormControl/>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Select</ControlLabel>
            <FormControl componentClass="select">
              <option>One</option>
              <option>Two</option>
            </FormControl>
          </FormGroup>
        </div>
      </Container>
    );
  }
}
