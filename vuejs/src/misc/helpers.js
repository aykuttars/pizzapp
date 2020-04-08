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

export function getDateRange(startDate, endDate, type) {
    let fromDate = moment(startDate);
    let toDate = moment(endDate);
    let diff = toDate.diff(fromDate, type);
    let range = [];
    for (let i = 0; i < diff; i++) {
      range.push(moment(startDate).add(i, type));
    }
    return range;
  }

export function findMatches(fArr, sArr) {
    /*
        Find matching element on given two array
        Returns the matched elements
    */
    const matches = [];
    fArr.forEach((v, k) => sArr[k] === v ? matches.push(v) : null);
    return matches;
}