import React, { Component } from 'react';
import styled from 'styled-components';

const Cell = styled.div`
  position: relative;

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

class ServiceCell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value.split('<br>'),
      length: props.length || 2,
      shortened: true
    }
  }

  toggle(event) {
    event.stopPropagation();
    this.setState({shortened: !this.state.shortened});
  }

  render() {
    let {value, length, shortened} = this.state;
    const showIcon = value.length > length;
    
    if(shortened) {
      value = value.slice(0, length);
    }

    return (
      <Cell>
        { value.map(item => (<span>{item}</span>))}
        { showIcon && <i onClick={this.toggle.bind(this)} className='glyphicon glyphicon-option-horizontal'></i> }
      </Cell>
    )
  }
}

export default ServiceCell
