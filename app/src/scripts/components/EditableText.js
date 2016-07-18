import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { Button } from 'react-bootstrap';

import ModalDialog from './ModalDialog';
import InputWithSelectedText from './InputWithSelectedText';


export default class EditableText extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      value: ''
    };

    this.handleTextClick = this.handleTextClick.bind(this);
    this.handleChangeValue = this.handleChangeValue.bind(this);
    this.handleSaveModelName = this.handleSaveModelName.bind(this);
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

  handleSaveModelName(e) {
    e.preventDefault();

    const value = this.state.value.trim();

    if (value) {
      this.props.onChange(value);
      this.setState({ showModal: false });
    }
  }

  handleChangeValue(e) {
    this.setState({ value: e.target.value });
  }

  renderEditModelName() {
    return (
      <form onSubmit={this.handleSaveModelName}>
        <InputWithSelectedText
          autoFocus
          type="text"
          value={this.state.value}
          onChange={this.handleChangeValue}
          className="form-control"
        />
      </form>
    );
  }

  render() {
    const { value } = this.props;
    return (
      <span>
        <span className="editable-text-label" onClick={this.handleTextClick}>{value}</span>
        {this.state.showModal &&
          <ModalDialog
            title='Rename Model'
            body={this.renderEditModelName()}
            actionButton={<Button bsStyle="primary"
                                  disabled={!this.state.value || (value == this.state.value)}
                                  onClick={this.handleSaveModelName}>Save</Button>}
            onHide={this.handleHide} />
        }
      </span>
    );
  }
}
