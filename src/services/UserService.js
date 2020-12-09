export default class UserService {
    constructor(store) {
        this.store = store;
        this.localStorage = window.localStorage;
    }

    getUser() {
        let storeUser = this.store.state.user;
        if(storeUser !== null &&storeUser.username !== undefined) {
            return storeUser;
        } else {
            let userJson = this.localStorage.getItem('user');
            let authToken = this.localStorage.getItem('authToken');

            if (userJson != null && authToken != null) {
                let user = JSON.parse(userJson);
                this.store.commit('setUser', user);
                this.store.commit('setAuthToken', authToken);
                return user;
            }
        }

        return null;
    }

    logout() {
        this.localStorage.removeItem('user');
        this.localStorage.removeItem('authToken');
        this.store.commit('setAuthToken', null);
        this.store.commit('setUser', null);
    }
}