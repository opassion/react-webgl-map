import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, FormGroup, FormControl, ControlLabel, Button, Form } from 'react-bootstrap';
import styled from 'styled-components';
import { autobind } from 'core-decorators';
import MapView from 'components/MapView';

import { doTopologySearch } from './actions';

const mapStateToProps = state => ({
  topologyPaths: state.get('topology').toObject().topologyPaths
});

@connect(mapStateToProps, { doTopologySearch })
@autobind
class TopologySearchPage extends React.Component {
  constructor() {
    super();
    this.state = {
      startnode: 'BHPLSTTNESR001',
      endnode: 'BHPLHRSVPAR001',
      aggregate_group_type: 'Location'
    };
  }

  onChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }

  submit(e) {
    e.preventDefault();
    this.search();
  }

  search() {
    const { startnode, aggregate_group_type, endnode } = this.state;
    this.props.doTopologySearch({startnode, endnode, aggregate_group_type});
  }

  render() {
    const { startnode, endnode, aggregate_group_type } = this.state;

    console.log(this.props.topologyPaths)

    return (
      <Grid fluid>
        <Row>
          <Col xs={12}>
            <Form inline onSubmit={this.submit} className="m-b-10">
              <FormGroup>
                <ControlLabel>Start Node:</ControlLabel>
                {' '}
                <FormControl type="text" name="startnode" value={startnode} onChange={this.onChange} />
              </FormGroup>
              {' '}
              <FormGroup>
                <ControlLabel>End Node:</ControlLabel>
                {' '}
                <FormControl type="text" name="endnode" value={endnode} onChange={this.onChange} />
              </FormGroup>
              {' '}
              <FormGroup>
                <FormControl componentClass="select" placeholder="select" name="aggregate_group_type" value={aggregate_group_type} onChange={this.onChange} >
                  <option value="default">All Paths</option>
                  <option value="filter-by-alarms">Paths With Alarms Only</option>
                </FormControl>
              </FormGroup>
              {' '}
              <Button type="submit" bsStyle="primary">
                Search
              </Button>
            </Form>
          </Col>
          <Col xs={12}>
            <MapView topologyData={this.props.topologyPaths} />
          </Col>
        </Row>
      </Grid>
    )
  }
}


export default TopologySearchPage;
