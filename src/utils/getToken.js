
const getToken = () => {
  try {
    // check if token is in local storage
    let token = localStorage.getItem('token');
    // FIXME: returning false might be what causes this error below
    //if token is not valid, app breaks, handle error if token is not valid
    if (!token) return false;
    let parsedToken = JSON.parse(token);
    // if so parse token and return 'Bearer [TOKEN]'
    return `Bearer ${parsedToken}`
  } catch (error) {
    console.log(error);
  }
}

export default getToken