import request from '../utils/request'

export function postAiChat(data) {
  return request.post('/ai/chat', data)
}
