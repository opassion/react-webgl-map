import styled from 'styled-components';

const TableWrapper = styled.div`
	.react-bs-table-container {
    font-size: 12px;

    th, td {
      white-space: pre-line;
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
