import { LOGIN_USER, LOGOUT, REGISTER_USER, PERSIST_USER } from './authTypes'
import JwtDecode from "jwt-decode";

const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN_USER:
    case REGISTER_USER:
      // payload : {_id: [ID], username: [username]}
      return { user: action.payload };
      break;
    case LOGOUT:
      localStorage.clear()
      return { user: null };
    case PERSIST_USER:
      let token = JSON.parse(localStorage.getItem('token'));
      let decodedToken = JwtDecode(token);
      let user = {
        _id: decodedToken._id,
        username: decodedToken.username
      }
      return { user }
    default:
      return state;
      break;
  }
}

export default authReducer;