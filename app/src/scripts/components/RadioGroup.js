/* @flow */

import React, { PropTypes } from 'react';

type Item = {
  value: string,
  name: string
};

const RadioGroup = (
  { items, selected, onChange }
: { items: Array<Item>,
    selected: string,
    onChange: () => void }
) => (
  <div>
    {items.map(item =>
        <div className="radio" key={item.value}>
          <label>
            <input type="radio"
                   onChange={onChange}
                   value={item.value}
                   checked={item.value === selected} />
            {item.name}
          </label>
        </div>)
    }
  </div>
);

RadioGroup.propTypes = {
  items: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  selected: PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
  ])
}

export default RadioGroup;
