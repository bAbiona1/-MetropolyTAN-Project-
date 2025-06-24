import {get, post, put, del} from './axios.service'

export const getLocations = () => {
    return get('/locations')
}

export const getLocationById = (id) => {
    return get('/locations/' + id)
}

export const createLocation = (loc) => {
    return post('/locations', loc)
}

export const updateLocation = (loc) => {
    return put('/locations/' + loc.id, loc);
}

export const deleteLocation = (id) => {
    return del('/locations/' + id)
}