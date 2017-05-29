import React from 'react';
import styled from 'styled-components';
import { autobind } from 'core-decorators';
import cx from 'classnames';

const Container = styled.div`
  border: 1px solid #eee;
  box-shadow: 1px 1px 3px rgba(0,0,0,.1);
  padding: 10px;
  background-color: white;
  position: absolute;
  top: 5px;
  
  .left {
    left: 5px;
  }
  &.right {
    right: 5px;
  }
  
  .content {
    position: relative;
    //width: 400px;
    min-height: 100px;
    max-height: 400px;
    overflow: auto;
  }
`;

const Button = styled.div`
  cursor: pointer;
  position: 'absolute;
  right: 10px;
  top: 10px;
  text-align: right;
`;

@autobind
export default class ColapsibleContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      expanded: true
    };
  }

  toggle() {
    this.setState({expanded: !this.state.expanded});
  }

  render() {
    const className = this.props.right ? 'right' : 'left';
    return (
      <Container className={className}>
        <Button onClick={this.toggle}>
          <i className={cx('glyphicon', {'glyphicon-resize-full': !this.state.expanded, 'glyphicon-resize-small': this.state.expanded})} />
        </Button>
        {this.state.expanded ? <div className="content">{React.cloneElement(this.props.children, { toggle: this.toggle })}</div> : null}
      </Container>
    );
  }
}
