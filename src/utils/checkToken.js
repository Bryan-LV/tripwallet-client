import JwtDecode from "jwt-decode";

export default async function checkToken() {
  try {
    // check if token is set in local storage
    let token = JSON.parse(localStorage.getItem('token'));
    // no token - return false
    if (!token) return false;
    // token ? check if expired
    let decodedToken = JwtDecode(token);
    if (Date.now() >= decodedToken.exp * 1000) {
      localStorage.clear();
      return false;
    } else {
      return true
    }
  } catch (error) {
    return false;
  }
}