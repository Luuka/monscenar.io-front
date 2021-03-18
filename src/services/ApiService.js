export default class ApiService {
    constructor() {
        this.authToken = window.localStorage.getItem('authToken');
    }

    sendRequest(route, method, body = null) {
        return fetch(process.env.VUE_APP_API_URL + route,
            {
                method: method,
                headers: new Headers({
                    'content-type': 'application/json',
                    'X-AUTH-TOKEN': this.authToken
                }),
                body: body
            }
        ).then(function (response) {

            if (response.status === 403 || response.status === 404) {
               // window.location = '/';
            }

            return response.text();
        });
    }

    sendBlobRequest(route, method, body = null) {
        return fetch(process.env.VUE_APP_API_URL + route,
            {
                method: method,
                headers: new Headers({
                    'content-type': 'application/json',
                    'X-AUTH-TOKEN': this.authToken
                }),
                body: body
            }
        ).then(function (response) {

            if (response.status === 403) {
                window.location = '/';
            }

            return response.blob();
        });
    }
}