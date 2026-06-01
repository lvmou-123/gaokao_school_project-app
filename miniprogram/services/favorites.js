import request from '../utils/request'

export function addFavorite(schoolId) {
  return request.post(`/favorites/schools/${schoolId}`)
}

export function removeFavorite(schoolId) {
  return request.delete(`/favorites/schools/${schoolId}`)
}

export function checkFavorite(schoolId) {
  return request.get(`/favorites/schools/check/${schoolId}`)
}

export function listFavorites(params) {
  return request.get('/favorites/schools', params)
}
