/* @flow */

/**
 * Dynamic type test for Event
 * Courtesy of rosskevin (https://github.com/facebook/flow/issues/368#issuecomment-224990683)
 */
function target<E> (e:SyntheticEvent, t:E) {
  if (e.target instanceof t) {
    // Now we know it's an <input />, with a `value` property.
    return e.target
  } else {
    throw new Error(`Expected Event target to be ${t} but found ${typeof e.target}`)
  }
}

export default { target }
