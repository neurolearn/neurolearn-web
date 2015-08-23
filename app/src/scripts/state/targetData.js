export const SET_TARGET_DATA = 'SET_TARGET_DATA';

export function setTargetData(targetData) {
  return {
    type: SET_TARGET_DATA,
    targetData
  };
}

export default function reducer(state = [], action) {
  switch (action.type) {
    case SET_TARGET_DATA:
      return action.targetData;
    default:
      return state;
  }
}
