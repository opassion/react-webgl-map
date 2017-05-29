import styled from 'styled-components';

const TableWrapper = styled.div`
  .table-top {
    padding: 5px 10px;

    .incident-counts {
      span {
        font-weight: bold;
      }
    }

    .incident-empty-space {
      min-height: 1px;
    }
  }

	.react-bs-table-container {
    font-size: 12px;

    th, td {
      white-space: pre-line;

      &:last-child {
        display: none;
      }
    }

    th {
      .order {
        .dropup, .dropdown {
          display: none;
        }
      }
    }
  }
`

export default TableWrapper;
