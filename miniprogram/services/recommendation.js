import request from '../utils/request'

export function postRecommend(data) {
  return request.post('/recommendations', data)
}
