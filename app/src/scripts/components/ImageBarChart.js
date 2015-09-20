import React, { PropTypes } from 'react';
import BarChartRowContainer from './BarChartRowContainer.js';
import ImageLabel from './ImageLabel.js';

export default class ImageBarChart extends React.Component {
  static propTypes = {
    images: PropTypes.array.isRequired,
    collections: PropTypes.object.isRequired
  }

  render() {
    return (
      <div>
      <h2>Images</h2>
      <BarChartRowContainer items={this.props.images}
                    label={ImageLabel}
                    collections={this.props.collections} />
      <h2>Groups</h2>

      </div>
    );
  }
}
