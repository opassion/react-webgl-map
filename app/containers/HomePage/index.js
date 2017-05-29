/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import window from 'global/window';
import { Tabs, Tab } from 'react-bootstrap';
import IncidentTable from 'components/IncidentTable';
import IncidentDetailsContauner from './IncidentDetails';

import styled from 'styled-components';

import { createStructuredSelector } from 'reselect';
import { selectHome, makeSelectTopologyPaths, makeSelectAlarms, makeSelectRemediations, makeSelectCurrentIncident, selectIncidentTabs } from './selectors';
import { updateTopology, closeIncidentTab, setTab } from './actions';

const BottomWrapper = styled.div`
  .current-incident-id {
    text-align: right;
    padding: 5px 10px;
    span {
      font-weight: bold;
    }
  }
`;

const TabContent = styled.div`
  padding-top: 10px;
  min-height: 500px;
`;

@autobind
export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  changeTab(id) {
	  this.props.setTab(id);
  }

  removeTab(e, id) {
	  e.stopPropagation();
	  this.props.removeTab(id);
  }

  renderPastIncidentTabs() {
    return this.props.selectedIncidents.map((id, idx) => (
      <Tab
        key={idx}
        eventKey={id}
        title={<div><button onClick={(e) => this.removeTab(e, id)}>&times;</button> <span>Incident #{id}</span></div>}
      >
        <TabContent>
          {this.props.selectedTab == id && <IncidentDetailsContauner id={id} />}
        </TabContent>
      </Tab>
    ));
  }

  renderCurrentIncidentTab() {
	  if (this.props.currentIncident) {
	    const id = this.props.currentIncident.object.id;
	    return (
        <Tab key="tab1" eventKey="tab1" title={`Incident #${id}`}>
          <TabContent>
            {this.props.selectedTab === 'tab1' && <IncidentDetailsContauner id={id} />}
          </TabContent>
        </Tab>
      );
  } else {
    return null;
  }
  }

  render() {
    return (
      <div>
        <IncidentTable />
        <BottomWrapper id="tab-container">
          <Tabs id="bottom-detail" animation={false} activeKey={this.props.selectedTab} onSelect={this.changeTab} unmountOnExit>
            {this.renderCurrentIncidentTab()}
            {this.renderPastIncidentTabs()}
          </Tabs>
        </BottomWrapper>
      </div>
    );
  }
}

HomePage.propTypes = {
  topologyPaths: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  alarms: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  remediations: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  currentIncident: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
};

export function mapDispatchToProps(dispatch) {
  return {
    onUpdateTopology: (paths) => dispatch(updateTopology(paths)),
    removeTab: (id) => dispatch(closeIncidentTab(id)),
    setTab: (id) => dispatch(setTab(id)),
  };
}

const mapStateToProps = createStructuredSelector({
  topologyPaths: makeSelectTopologyPaths(),
  alarms: makeSelectAlarms(),
  remediations: makeSelectRemediations(),
  currentIncident: makeSelectCurrentIncident(),
  selectedIncidents: selectIncidentTabs(),
  selectedTab: (state) => selectHome(state).get('selectedTab'),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

HomePage.propTypes = {
  onUpdateTopology: React.PropTypes.func,
};
