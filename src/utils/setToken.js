export default function setToken(userData) {
  let token = JSON.stringify(userData.token);
  localStorage.setItem('token', token);
}