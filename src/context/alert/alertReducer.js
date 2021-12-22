import { CLEAR_ALERT, SET_ALERT } from './alertTypes'

const alertReducer = (state, { type, payload }) => {

  switch (type) {
    case SET_ALERT:
      // before setting alert check if payload string is already in array as to not duplicate the error
      const checkDuplicateMsgs = state.some(alert => alert.msg === payload.msg);
      if (checkDuplicateMsgs) return state;
      return [...state, payload];
    case CLEAR_ALERT:
      const filteredState = state.filter(alert => alert.id !== payload.id);
      return filteredState
    default:
      return state;
      break;
  }
}

export default alertReducer