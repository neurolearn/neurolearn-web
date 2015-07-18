'use strict';

import React from 'react';
import { Input } from 'react-bootstrap';

export default class SearchInput extends React.Component {
  render() {
    return (
      <Input
        type='text'
        placeholder='Search NeuroVault Collections' />
    );
  }
}
