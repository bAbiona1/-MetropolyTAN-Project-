import {get, post, put, del} from './axios.service'

export const getLines = () => {
    return get('/lines')
}

export const getLineById = (id) => {
    return get('/lines/' + id)
}

export const createLine = (line) => {
    return post('/lines', line)
}

export const updateLine = (line) => {
    return put('/lines/' + line.id, line);
}

export const deleteLine = (id) => {
    return del('/lines/' + id)
}