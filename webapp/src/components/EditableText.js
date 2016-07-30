/* @flow */

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { Button } from 'react-bootstrap';

import ModalDialog from './ModalDialog';
import InputWithSelectedText from './InputWithSelectedText';


export default class EditableText extends React.Component {
  state: {
    showModal: boolean,
    value: string
  };

  static propTypes = {
    value: PropTypes.string,
    modalTitle: PropTypes.string,
    allowBlank: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.node
  }

  constructor(props: Object) {
    super(props);
    this.state = {
      showModal: false,
      value: ''
    };

    (this:any).handleTextClick = this.handleTextClick.bind(this);
    (this:any).handleChange = this.handleChange.bind(this);
    (this:any).handleSave = this.handleSave.bind(this);
    (this:any).handleHide = this.handleHide.bind(this);
  }

  handleTextClick(e: Object) {
    e.preventDefault();

    this.setState({
      showModal: true,
      value: this.props.value
    });
  }

  handleHide() {
    this.setState({ showModal: false });
  }

  handleSave(e: Object) {
    e.preventDefault();

    const value = this.state.value.trim();

    if (this.isValid()) {
      this.props.onChange(value);
      this.setState({ showModal: false });
    }
  }

  handleChange(e: Object) {
    this.setState({ value: e.target.value });
  }

  isValid() {
    if (this.props.allowBlank) {
      return true;
    }

    const value = this.state.value.trim();
    return value && (value !== this.props.value);
  }

  renderModalBody() {
    return (
      <form onSubmit={this.handleSave}>
        <InputWithSelectedText
          autoFocus
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
          className="form-control"
        />
      </form>
    );
  }

  render() {
    const { value, modalTitle, children } = this.props;
    return (
      <span>
        <span className="editable-text-label" onClick={this.handleTextClick}>{children || value}</span>
        {this.state.showModal &&
          <ModalDialog
            title={modalTitle}
            body={this.renderModalBody()}
            actionButton={
              <Button bsStyle="primary"
                disabled={!this.isValid()}
                onClick={this.handleSave}>Save</Button>
            }
            onHide={this.handleHide} />
        }
      </span>
    );
  }
}
