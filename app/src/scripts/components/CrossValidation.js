import zipWith from 'lodash/array/zipWith';

import React, { PropTypes } from 'react';
import ScatterPlot from './ScatterPlot';

import { summaryPropsNameMap, propOrder } from '../constants/SummaryProps';


function scatterplotData(stats) {
  const {Y, yfit_xval, yfit_all} = stats;
  const yfit = yfit_xval || yfit_all;

  return zipWith(Y, yfit_xval, (acc, value) => {
        return { x: acc, y: value };
  });
}

function formatProp(val) {
  return val.toFixed === undefined ? val : val.toFixed(2);
}

function renderCvSummary(propOrder, summary) {
  return (
    <table style={{marginTop: 10}} className="table">
      <thead>
        <tr>
        {propOrder.map(propName => {
          return summary[propName]
          ? <th>{summaryPropsNameMap[propName]}</th>
          : false;
        })}
        </tr>
      </thead>
      <tbody>
        <tr>
        {propOrder.map(propName => {
          return summary[propName]
          ? <td>{formatProp(summary[propName])}</td>
          : false;
        })}
        </tr>
      </tbody>
    </table>
  );
}

function renderScatterplot(label, stats) {
  const spData = [{
      label: label.name,
      values: scatterplotData(stats)
  }];
  return (
    <div>
      <h4>Actual vs. Predicted</h4>

      <ScatterPlot data={spData}
                        width={500}
                        height={400}
                        margin={{top: 10, bottom: 30, left: 30, right: 0}}
                        xAxis={{label: label.name}}
                        yAxis={{label: `Predicted ${label.name}`}} />
    </div>
  );
}

function renderROCPlot(modelId, plotFilename) {
  const plotUrl = `/media/${modelId}/${plotFilename}`;
  return (
    <div className="row">
      <div className="col-md-8">
        <h4>ROC</h4>
        <img style={{marginTop: 15}} src={plotUrl} className="img-responsive"/>
      </div>
    </div>
  );
}

const CrossValidation = ({modelId, label, cv, summary, stats, roc_plot}) => {
  const cvMeta = Object.assign({}, summary, {method: cv.type});

  return (
    <div>
      <h3>Cross Validation</h3>

      {renderCvSummary(propOrder, cvMeta)}
      {roc_plot
        ? renderROCPlot(modelId, roc_plot)
        : renderScatterplot(label, stats)}
    </div>
  );
};

CrossValidation.propTypes = {
  label: PropTypes.object.isRequired,
  cv: PropTypes.object.isRequired,
  summary: PropTypes.object.isRequired,
  stats: PropTypes.object.isRequired
};

export default CrossValidation;
