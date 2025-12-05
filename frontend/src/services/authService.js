const API_BASE_URL = 'http://localhost:3000/api';

export const authService = {
    async login(email, password) {
        // TEMPORARY: Fake login for testing
        // Remove this after backend is ready
        if (email && password) {
            localStorage.setItem('token', 'fake-token');
            localStorage.setItem('user', JSON.stringify({ email }));
            return { token: 'fake-token', user: { email } };
        }
        throw new Error('Invalid credentials');
    },

    async signup(fullName, email, password) {
        // TEMPORARY: Fake signup for testing
        // Remove this after backend is ready
        if (fullName && email && password) {
            return { message: 'Account created' };
        }
        throw new Error('Signup failed');
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getToken() {
        return localStorage.getItem('token');
    },

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated() {
        return !!this.getToken();
    }
};