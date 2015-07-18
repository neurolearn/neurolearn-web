'use strict';

import React from 'react';
import SelectImagesModal from './SelectImagesModal';
import { Button } from 'react-bootstrap';

export default class InputDataPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Input Data</h3>
        </div>
        <div className="panel-body">
          <p>Search NeuroVault's collections and select images to create a training dataset.</p>

            <Button bsStyle='primary' onClick={()=>this.setState({showModal: true})}>Select Images</Button>
        </div>
        <SelectImagesModal show={this.state.showModal} onHide={()=>this.setState({showModal: false})}/>
      </div>
    );
  }
}
