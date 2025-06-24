import {get, post, put, del} from './axios.service'

export const getModes = () => {
    return get('/modes')
}

export const getModeById = (id) => {
    return get('/modes/' + id)
}

export const createMode = (mode) => {
    return post('/modes', mode)
}

export const updateMode = (mode) => {
    return put('/modes/' + mode.id, mode);
}

export const deleteMode = (id) => {
    return del('/modes/' + id)
}