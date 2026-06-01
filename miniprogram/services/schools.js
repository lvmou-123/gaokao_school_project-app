import request from '../utils/request'

export function getSchools(params) {
  return request.get('/schools', params)
}

export function getSchoolById(id) {
  return request.get(`/schools/${id}`)
}

export function getSchoolsByMajor(majorId, params) {
  return request.get(`/schools/by-major/${majorId}`, params)
}
