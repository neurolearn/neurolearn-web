import React from 'react';
import { Link } from 'react-router';

export default class HomePage extends React.Component {
  render() {
    return (
      <div>
        <h1>Homepage</h1>
        <Link to="/train-model">Train Model</Link>
      </div>
    );
  }
}
