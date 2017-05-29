import React from 'react';
import styled from 'styled-components';
import { Button, Glyphicon } from 'react-bootstrap';
import { autobind } from 'core-decorators';

const Container = styled.div`
  position: absolute;
  right: 20px;
  bottom: 20px;
  width: 100px;
  height: 100px;
  background: white;
  border-radius: 50%;
  padding: 5px 0;
  box-shadow: 1px 1px 3px rgba(0,0,0,.2);
`;

const Btn = styled.button`
    outline: none !important;
    border-radius: 50% !important;
`

@autobind
export default class MapControl extends React.Component {


  rotate(val) {

    this.props.onRotate(val);
  }

  pitch(val) {
    this.props.onPitch(val);
  }

  handleMouseDown(callback, val) {
    this._timer = setInterval(() => callback(val), 0);
  }

  clearInterval() {
    clearInterval(this._timer);
  }

  render() {
    return (
      <Container>
        <table>
          <tbody>
            <tr>
              <td></td>
              <td>
                <Btn className="btn btn-sm" onClick={() => this.pitch(1)} onMouseDown={e => this.handleMouseDown(this.pitch, 1)} onMouseUp={this.clearInterval}>
                  <Glyphicon glyph="chevron-up" />
                </Btn>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>
                <Btn className="btn btn-sm" onClick={() => this.rotate(-1)} onMouseDown={e => this.handleMouseDown(this.rotate, -1)} onMouseUp={this.clearInterval}>
                  <Glyphicon glyph="chevron-left" />
                </Btn>
              </td>
              <td>
                <Btn className="btn btn-sm" onClick={this.props.onReset}>
                  <Glyphicon glyph="record" />
                </Btn>
              </td>
              <td>
                <Btn className="btn btn-sm" onClick={() => this.rotate(1)}  onMouseDown={e => this.handleMouseDown(this.rotate, 1)} onMouseUp={this.clearInterval}>
                  <Glyphicon glyph="chevron-right" />
                </Btn>
              </td>
            </tr>
            <tr>
              <td>
              </td>
              <td>
                <Btn className="btn btn-sm" onClick={() => this.pitch(-1)}  onMouseDown={e => this.handleMouseDown(this.pitch, -1)} onMouseUp={this.clearInterval}>
                  <Glyphicon glyph="chevron-down" />
                </Btn>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </Container>
    );
  }
}
