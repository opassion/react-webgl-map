import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import moment from 'moment';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import TableWrapper from './TableWrapper';

class RemediationsTable extends Component {
  render() {
    const {remediations} = this.props;
    
    return (
      <TableWrapper>
        {remediations && 
          <BootstrapTable data={remediations} striped={true} hover={true} search pagination >
            <TableHeaderColumn dataField='id' isKey={true} dataAlign='center' dataSort={true}>ID</TableHeaderColumn>
            <TableHeaderColumn dataField='createdTime' dataSort={true}>Created At</TableHeaderColumn>
            <TableHeaderColumn dataField='similarity' dataSort={true}>Similarity</TableHeaderColumn>
            <TableHeaderColumn dataField='remediation' dataSort={true}>Remediation Steps</TableHeaderColumn>
          </BootstrapTable>
        }
      </TableWrapper>
    );
  }
}

export function mapDispatchToProps(dispatch) {
  return {};
}

const mapStateToProps = createStructuredSelector({});

export default connect(mapStateToProps, mapDispatchToProps)(RemediationsTable);

RemediationsTable.propTypes = {
  remediations: React.PropTypes.oneOfType([
                    React.PropTypes.array,
                    React.PropTypes.bool,
                  ]),
};
