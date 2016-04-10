import { isEmpty, every, pick, take } from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import DataGrid from './DataGrid';
import Spinner from '../Spinner';

import { loadImagesMetadata } from '../../state/imagesMetadata';
import { setTargetData } from '../../state/targetData';

function columnValues(data, index) {
  return data.slice(1).map((row, i) => row[index]);
}

// Thanks, jQuery
function isNumeric(obj) {
  const type = typeof(obj);
  return (type === 'number' || type === 'string') && !isNaN(obj - parseFloat(obj));
}

function guessType(values) {
  return every(values, isNumeric) ? 'Number' : 'Categorical';
}

function parseColumns(data) {
  return data[0].map((column, i) => {
    const values = columnValues(data, i);
    return {
      'name': column,
      'dataType': guessType(values),
      'sampleValues': take(values, 3)
    }
  });
}

export default class TrainingLabel extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    selectedImages: PropTypes.object,
    imagesMetadata: PropTypes.object,
    targetData: PropTypes.object
  };

  componentDidMount() {
    const images = pick(this.props.selectedImages.images,
                        this.countSelectedImages);
    if (!isEmpty(Object.keys(images))
        && isEmpty(this.props.imagesMetadata.data)) {
      this.props.dispatch(loadImagesMetadata(images));
    }
  }

  countSelectedImages(collection) {
    return Object.keys(collection).reduce((accum, key) =>
      collection[key] ? accum + 1 : accum,
    0);
  }

  handleTargetSelection(targetData) {
    this.props.dispatch(setTargetData(targetData));
  }

  prependRowWithColumnNames(data) {
    let firstRow = {};
    Object.keys(data[0]).map(key => firstRow[key] = key);
    return [firstRow].concat(data);
  }

  renderDataGrid(data, targetData) {
    const columns = parseColumns(data);

    return (
      <div>
        <p className="lead">Select the column you would like to use for training labels by right clicking
 (control-click) on the column and selecting ‘Use&nbsp;as&nbsp;training&nbsp;label’.</p>
        <p>
          <ul>
            <li>You can also optionally select a column indicating the subject labels to ensure they are held out together when using cross-validation.</li>
            <li>You can use formulas and functions in the cells.</li>
          </ul>
        </p>

        <table className="table table-hover">
          <thead>
            <tr>
              <th>Target</th>
              <th>Name</th>
              <th>Data Type</th>
              <th>Sample Field Values</th>
            </tr>
          </thead>
          <tbody>
            {
              columns.map(column =>
                <tr key={column.name}>
                  <td>
                    <input type="radio" checked={false}/>
                  </td>
                  <td>
                    {column.name}
                  </td>
                  <td>
                    {column.dataType}
                  </td>
                  <td>
                    {column.sampleValues.join(', ')}
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>

        <DataGrid onSelectTarget={this.handleTargetSelection.bind(this)} data={data} targetData={targetData} />
      </div>
    );
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.imagesMetadata !== this.props.imagesMetadata;
  }

  renderLoading() {
    return (
      <div className="row">
        <div className="col-md-12" >
          <div style={{'paddingTop': 30, 'height': 30}}><Spinner opts={{position: 'relative'}}/></div>
          <div style={{'color': 'gray', 'margin': 40, 'textAlign': 'center'}}>Loading image metadata…</div>
        </div>
      </div>
    );
  }

  render() {
    const { imagesMetadata, targetData } = this.props;
    return (
      <div>
        <h1 className="page-header">Training Label</h1>
        { imagesMetadata.isFetching && this.renderLoading() }
        { !isEmpty(imagesMetadata.data) &&
          this.renderDataGrid(imagesMetadata.data, targetData) }

        <hr/>
        <Link disabled={false} className="btn btn-primary continue-button" to="/models/new/model-preferences">Continue to Model Preferences</Link>
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(TrainingLabel);
