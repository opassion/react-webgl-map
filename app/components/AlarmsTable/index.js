import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import moment from 'moment';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import TableWrapper from './TableWrapper';

class AlarmsTable extends Component {
  render() {
    const {alarms} = this.props;
    
    return (
      <TableWrapper>
        {alarms && 
          <BootstrapTable data={alarms} striped={true} hover={true} search pagination >
            <TableHeaderColumn dataField='id' isKey={true} dataAlign='center' dataSort={true}>ID</TableHeaderColumn>
            <TableHeaderColumn dataField='createdTime' dataSort={true}>Created At</TableHeaderColumn>
            <TableHeaderColumn dataField='hostId' dataSort={true}>Host</TableHeaderColumn>
            <TableHeaderColumn dataField='alarmType' dataSort={true}>Type</TableHeaderColumn>
            <TableHeaderColumn dataField='alarmText' dataSort={true}>Text</TableHeaderColumn>
          </BootstrapTable>
        }
      </TableWrapper>
    );
  }
}

export function mapDispatchToProps(dispatch) {
  return {
  };
}

const mapStateToProps = createStructuredSelector({});

export default connect(mapStateToProps, mapDispatchToProps)(AlarmsTable);

AlarmsTable.propTypes = {
  alarms: React.PropTypes.oneOfType([
                    React.PropTypes.array,
                    React.PropTypes.bool,
                  ]),
};
