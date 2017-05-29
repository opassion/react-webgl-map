import React, { Component } from 'react';
import styled from 'styled-components';

const Cell = styled.div`
  position: relative;
  min-height: 20px;
  i {
    background-color: #ccc;
    border-radius: 3px;
    padding: 1px 2px;
    cursor: pointer;
    position: absolute;
    right: 0;
    bottom: 2px;
    top: auto;

    &:hover {
      background-color: #aaa;
    }
  }

  span {
    display: block;
  }
`

class ShortenCell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
      length: props.length || 30,
      shortened: true
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value != this.state.value) {
      this.setState({value: nextProps.value});
    }
  }

  toggle(event) {
    event.stopPropagation();
    this.setState({shortened: !this.state.shortened});
  }

  render() {
    let { value, length, shortened } = this.state;
    if (!value) {
      return (
        <Cell>
          {this.props.children}
        </Cell>
      )
    }

    const showIcon = value.length > length;
    if (shortened) {
      value = value.substr(0, length);
    }

    return (
      <Cell>
        <span>{value}</span>
        { showIcon && <i onClick={this.toggle.bind(this)} className='glyphicon glyphicon-option-horizontal'></i> }
        {this.props.children}
      </Cell>
    )
  }
}

export default ShortenCell
