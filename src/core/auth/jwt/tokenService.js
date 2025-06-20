class TokenService {
  getLocalRefreshToken() {
    const user = JSON.parse(localStorage.getItem("userData"));
    return user?.refresh;
  }

  getLocalAccessToken() {
    const user = JSON.parse(localStorage.getItem("userData"));
    return user?.access;
  }

  updateLocalAccessToken(token) {
    let user = JSON.parse(localStorage.getItem("userData"));
    user.access = token;
    localStorage.setItem("userData", JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(localStorage.getItem("userData"));
  }

  setUser(user) {
    console.log(JSON.stringify(user));
    localStorage.setItem("userData", JSON.stringify(user));
  }

  removeUser() {
    localStorage.removeItem("userData");
  }
}

export default new TokenService();
