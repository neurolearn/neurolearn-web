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

function renderCvSummaryProp(summary, propName) {
  return (
    <tr key={propName}>
      <th>{summaryPropsNameMap[propName]}</th>
      <td>{summary[propName].toFixed(2)}</td>
    </tr>
  );
}

function renderCvSummary(summary) {
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
          ? <td>{summary[propName].toFixed(2)}</td>
          : false;
        })}
        </tr>
      </tbody>
    </table>
  );
}

const CrossValidation = ({label, cv, summary, stats}) => {
  const spData = [{
      label: label.name,
      values: scatterplotData(stats)
  }];

  return (
    <div>
      <h3>Cross Validation</h3>
      <p>Method: <strong>{cv.type}</strong></p>

      {renderCvSummary(summary)}

      <h4>Actual vs. Predicted</h4>
      <ScatterPlot data={spData}
                   width={500}
                   height={400}
                   margin={{top: 10, bottom: 30, left: 30, right: 0}}
                   xAxis={{label: label.name}}
                   yAxis={{label: `Predicted ${label.name}`}} />
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
