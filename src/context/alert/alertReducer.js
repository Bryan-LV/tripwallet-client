import { CLEAR_ALERT, SET_ALERT } from './alertTypes'

const alertReducer = (state, { type, payload }) => {

  switch (type) {
    case SET_ALERT:
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