import axios from 'axios'
import store from '../store' // ajuste ce chemin si nécessaire

const myaxios = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    withCredentials: true,
});

// Intercepteur pour ajouter le token sauf pour /auth
myaxios.interceptors.request.use(config => {
    // N'ajoute pas le token si l'URL contient /auth
    if (!config.url.includes('/auth')) {
        const token = store.state.authenticate.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export const get = (url, params) => {
    return myaxios.get(url, { params })
}

export const post = (url, data, params) => {
    return myaxios.post(url, data, { params })
}

export const put = (url, data, params) => {
    return myaxios.put(url, data, { params })
}

export const patch = (url, data, params) => {
    return myaxios.patch(url, data, { params })
}

export const del = (url, params) => {
    return myaxios.delete(url, { params })
}
