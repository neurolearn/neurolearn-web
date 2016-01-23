export const SET_TARGET_DATA = 'SET_TARGET_DATA';
export const RESET_TARGET_DATA = 'RESET_TARGET_DATA';

export function setTargetData(targetData) {
  return {
    type: SET_TARGET_DATA,
    targetData
  };
}

export function resetTargetData() {
  return {
    type: RESET_TARGET_DATA
  };
}

const initialState = {
  targetColumn: {
    index: null
  }
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_TARGET_DATA:
      return action.targetData;
    case RESET_TARGET_DATA:
      return initialState;
    default:
      return state;
  }
}
