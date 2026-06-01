import request from '../utils/request'

export function getUserById(id) {
  return request.get(`/users/${id}`)
}

export function updateScores(id, data) {
  return request.put(`/users/${id}/scores`, data)
}
