import { SET_ALERT } from './alertTypes'

const alertReducer = (state, { type, payload }) => {

  switch (type) {
    case SET_ALERT:
      return payload.msg
    default:
      break;
  }
}

export default alertReducer