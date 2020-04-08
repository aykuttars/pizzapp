import { API_URL } from './constants';
import { handleResponse } from './helpers';
export const taskHelper = {
    getTasks,
    getTask,
    createTask,
    startTask,
    //stopTask,
};


function getTasks(token) {
  const requestOptions = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization':  `Bearer ${token}`
    },
  }
  return fetch(`${API_URL}/task_list/`, requestOptions)
      .then(handleResponse)
      .then(data => {
          return data;
      })
}

function getTask(taskId, token) {
  const requestOptions = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization':  `Bearer ${token}`
    },
  }
  return fetch(`${API_URL}/task_list/${taskId}/`, requestOptions)
      .then(handleResponse)
      .then(data => {
          return data;
      })
}

function createTask(task, token) {
  const requestOptions = {
    method: 'POST',
    headers: {
        'Authorization':  `Bearer ${token}`,
    },
    body: task
  }
  return fetch(`${API_URL}/task_list/`, requestOptions)
      .then(handleResponse)
      .then(data => {
          return data;
      })

}

function startTask(task, token) {
  const requestOptions = {
    method: 'POST',
    headers: {
        'Authorization':  `Bearer ${token}`,
    },
  }
  return fetch(`${API_URL}/task_list/${task.id}/start_task/`, requestOptions)
      .then(handleResponse)
      .then(data => {
          return data;
      })

}