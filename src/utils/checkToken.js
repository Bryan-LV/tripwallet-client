import JwtDecode from "jwt-decode";

export default function checkToken() {
  try {
    // Check if token is set in local storage
    let token = JSON.parse(localStorage.getItem('token'));
    // No token - return false
    if (!token) return false;
    // Token ? check if expired
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