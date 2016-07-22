/* @flow */

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

const CvSummary = ({propOrder, summary} : {propOrder: string[], summary: Object}) => (
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

const Scatterplot = ({label, stats}: {label: Object, stats: Object}) => {
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

const ROCPlot = ({modelId, plotFilename} : {modelId: number, plotFilename: string}) => {
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

const CrossValidation = (
  {modelId, label, cv, summary, stats, roc_plot}
: { modelId: number,
    label: { name: string },
    cv: { type: string },
    summary: Object,
    stats: Object,
    roc_plot: string }
) => {
  const cvMeta = Object.assign({}, summary, {method: cv.type});

  return (
    <div>
      <h3>Cross Validation</h3>

      <CvSummary propOrder={propOrder} summary={cvMeta} />
      {roc_plot
        ? <ROCPlot modelId={modelId} plotFilename={roc_plot} />
        : <Scatterplot label={label} stats={stats} />}
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
