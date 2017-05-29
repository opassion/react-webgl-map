import React from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

const Container = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  .legend {
    display: flex;
    align-items: center;
      
    span {
      font-size: 12px;
    }
  }
  .line {
    height: 5px;
    width: 50px;
    margin-right: 5px;  
    &.blue {
      background-color: ${COLORS.blue};
    }
    &.yellow {
      background-color: ${COLORS.yellow};
    }
    &.darkBlue {
      background-color: ${COLORS.darkBlue};
    }
  }
`;

export default class Legends extends React.Component {
  render() {
    return (
      <Container>
        <div>
          <div className="legend"><div className="line blue"></div> <span>Tunnel</span></div>
          <div className="legend"><div className="line darkBlue"></div> <span>IP</span></div>
          <div className="legend"><div className="line yellow"></div> <span>LTE</span></div>
        </div>
      </Container>
    );
  }
}
