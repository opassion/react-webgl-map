import React from 'react';
import { autobind } from 'core-decorators';
import { Modal, ModalBody, ButtonGroup, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

@autobind
export default class IncidentEditModal extends React.Component {
  constructor() {
    super();
    this.state = {
      category: '',
      description: ''
    }
  }

  onChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }

  onSubmit() {
    this.props.onSubmit(this.state);
  }

  render() {
    return (
      <Modal show>
        <ModalBody>
          <div>
            <FormGroup>
              <ControlLabel>Category</ControlLabel>
              <FormControl type="text" value={this.state.category} name="category" onChange={this.onChange} />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <FormControl componentClass="textarea" value={this.state.description} name="description" onChange={this.onChange}  />
            </FormGroup>
          </div>
          <ButtonGroup>
            <Button bsStyle="default" onClick={this.props.onHide}>Cancel</Button>
            <Button bsStyle="primary" onClick={this.onSubmit}>Save</Button>
          </ButtonGroup>
        </ModalBody>
      </Modal>
    );
  }
}
