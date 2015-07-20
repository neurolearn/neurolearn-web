import React from 'react';

export default class FilePicker extends React.Component {
  handleChange(e) {
    this.props.onLoad(e.target.files[0]);
  }

  render() {
    return (
      <div className="FilePicker">
        <input className='FilePicker-input'
               type='file'
               accept={this.props.accept}
               onChange={this.handleChange.bind(this)} />
      </div>
    );
  }
}

FilePicker.defaultProps = {accept: 'text/csv'};
