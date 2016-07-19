import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { Button } from 'react-bootstrap';

import ModalDialog from './ModalDialog';
import InputWithSelectedText from './InputWithSelectedText';


export default class EditableText extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    modalTitle: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.node
  }

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      value: ''
    };

    this.handleTextClick = this.handleTextClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleHide = this.handleHide.bind(this);
  }

  handleTextClick(e) {
    e.preventDefault();

    this.setState({
      showModal: true,
      value: this.props.value
    });
  }

  handleHide() {
    this.setState({ showModal: false });
  }

  handleSave(e) {
    e.preventDefault();

    const value = this.state.value.trim();

    if (value) {
      this.props.onChange(value);
      this.setState({ showModal: false });
    }
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
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
            actionButton={<Button bsStyle="primary"
                                  disabled={!this.state.value || (value == this.state.value)}
                                  onClick={this.handleSave}>Save</Button>}
            onHide={this.handleHide} />
        }
      </span>
    );
  }
}
