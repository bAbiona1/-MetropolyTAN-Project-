import {post} from './axios.service'

export const authenticate = (data) => {
    return post('/auth/login', data)
}