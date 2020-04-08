import { API_URL } from './constants';
import { handleResponse } from './helpers';

export const userHelper = {
  login,
  logout,
  register,
  checkLogin,
  update
};


function login(username, password) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  };

  // 'X-CSRFToken': Cookies.get('csrftoken')
  return fetch(`${API_URL}/auth-jwt/`, requestOptions)
    .then(handleResponse)
    .then(user => {
      // login successful if there's a jwt token in the response
      if (user.token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
      }

      return user;
    });
}

function checkLogin() {
  const user = localStorage.getItem('user', null)
  if (!user) return false
  const { token } = JSON.parse(user);
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization':  `Bearer ${token}`,
    },
  };

  return fetch(`${API_URL}/current_user/`, requestOptions)
    .then(handleResponse)
    .then(response => {
      if (response.detail) {
        localStorage.setItem('user', null)
        return false;
      }
      return true;
    });
}

function logout() {
  localStorage.removeItem('user')
}

function register(userData) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  };
  return fetch(`${API_URL}/users/register/`, requestOptions)
    .then(handleResponse)
    .then(result => {
      return result;
    });
}


function update(userData) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userData })
  };
  // 'X-CSRFToken': Cookies.get('csrftoken')
  return fetch(`${API_URL}/update-user/`, requestOptions)
    .then(handleResponse)
    .then(user => {
      // login successful if there's a jwt token in the response
      if (user.token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
      }
      return user;
    });
}

