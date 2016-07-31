/* @flow */

import React, { PropTypes } from 'react';

import update from 'react/lib/update';
import { isEmpty, omit } from 'lodash';
import { Input } from 'react-bootstrap';
import RangeFilter from './RangeFilter';
import TermsFilter from './TermsFilter';
import Events from '../../utils/events';

function unsetFilter(fieldName: string, filter: Object) {
  return omit(filter, fieldName);
}

function setFilter(fieldName: string, filter: Object, clause: Object) {
  return update(filter, {[fieldName]: {$set: clause}});
}

function markSelected(filter, fieldName: string, terms) {
  const selected = filter[fieldName] && filter[fieldName].terms[fieldName];

  if (isEmpty(selected)) {
    return terms;
  }

  const reduced = selected.reduce((accum, term) => {
    accum[term] = true;
    return accum;
  }, {});

  return terms.map(item =>
    Object.assign({}, item, {selected: reduced[item.key]})
  );
}

function getBuckets(results, aggregation: string) {
  return results ? results.aggregations[aggregation].buckets : [];
}

export default class RefineSearchResults extends React.Component {
  static propTypes = {
    filter: PropTypes.object,
    results: PropTypes.object,
    onChange: PropTypes.func
  }

  constructor(props: Object) {
    super(props);
    (this:any).handleRangeFilterChange = this.handleRangeFilterChange.bind(this);
    (this:any).handleHasDOIChange = this.handleHasDOIChange.bind(this);
  }

  handleRangeFilterChange(value: [number, number]) {
    const { filter } = this.props;
    const clause = value && {
      'range': {
        'number_of_images': {
          'gte': parseInt(value[0]),
          'lte': parseInt(value[1])
        }
      }
    };

    const newFilter = value
      ? setFilter('number_of_images', filter, clause)
      : unsetFilter('number_of_images', filter);
    this.props.onChange(newFilter);
  }

  handleTermsFilterChange(fieldName: string, terms: Array<{selected: boolean, key: string}>) {
    const selectedTerms = terms
      .filter(term => term.selected)
      .map(term => term.key);

    const clause = {
      'terms': {
        [fieldName]: selectedTerms
      }
    };

    const newFilter = isEmpty(selectedTerms)
      ? unsetFilter(fieldName, this.props.filter)
      : setFilter(fieldName, this.props.filter, clause);

    this.props.onChange(newFilter);
  }

  handleHasDOIChange(e: SyntheticEvent) {
    const { filter } = this.props;
    const { checked } = Events.target(e, HTMLInputElement);

    const clause = {
      'exists': {'field': 'DOI'}
    };

    const newFilter = checked
      ? setFilter('hasDOI', filter, clause)
      : unsetFilter('hasDOI', filter);

    this.props.onChange(newFilter);
  }

  render() {
    const { results, filter } = this.props;

    const imagesStats = results
      ? results.aggregations.number_of_images_stats : {max: 0, min: 0};

    const hasDOI = results
      ? results.aggregations.has_DOI
      : null;

    const termFilters = [
      {
        label: 'Image Map Types',
        fieldName: 'image_map_types',
        terms: getBuckets(results, 'image_map_types')
      },
      {
        label: 'Image Types',
        fieldName: 'image_image_types',
        terms: getBuckets(results, 'image_image_types')
      },
      {
        label: 'Image Modalities',
        fieldName: 'image_modalities',
        terms: getBuckets(results, 'image_modalities')
      },
      {
        label: 'Image Analysis Levels',
        fieldName: 'image_analysis_levels',
        terms: getBuckets(results, 'image_analysis_levels')
      }
    ];

    return (
      <div className="panel panel-default">
        <div className="panel-body">
          <RangeFilter
            label="Number of images"
            value={[imagesStats.min, imagesStats.max]}
            onChange={this.handleRangeFilterChange}
          />

          {hasDOI && hasDOI.doc_count > 0 &&
            <Input
              type="checkbox"
              label={`Has DOI (${hasDOI.doc_count})`}
              onChange={this.handleHasDOIChange}
            />
          }

          {termFilters.map((tf, i) =>
              !isEmpty(tf.terms) &&
                <TermsFilter
                  key={i}
                  label={tf.label}
                  terms={markSelected(filter, tf.fieldName, tf.terms)}
                  onChange={terms => this.handleTermsFilterChange(tf.fieldName, terms)}
                />
            )
          }

        </div>
      </div>
    );
  }
}
