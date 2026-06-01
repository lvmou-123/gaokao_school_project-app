import request from '../utils/request'

export function getMajors(params) {
  return request.get('/majors', params)
}

export function getMajorById(id) {
  return request.get(`/majors/${id}`)
}
