import moment from "moment";
export function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                logout();
                location.reload(true);
            }
            const error = (data) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}

export function logout() {
  localStorage.removeItem('user')
  localStorage.removeItem('vuex')
}