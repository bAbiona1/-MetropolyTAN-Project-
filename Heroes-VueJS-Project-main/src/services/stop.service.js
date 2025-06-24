import {get, post, put, del} from './axios.service'

export const getStops = () => {
    return get('/stops')
}

export const getStopById = (id) => {
    return get('/stops/' + id)
}

export const createStop = (stop) => {
    return post('/stops', stop)
}

export const updateStop = (stop) => {
    return put('/stops/' + stop.id, stop);
}

export const deleteStop = (id) => {
    return del('/stops/' + id)
}