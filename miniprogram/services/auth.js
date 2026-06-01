import request from '../utils/request'

export function postSendSms(data) {
  return request.post('/auth/sms', data)
}

export function postLogin(data) {
  return request.post('/auth/login/phone', data)
}

export function postWechatLogin(data) {
  return request.post('/auth/login/wechat', data)
}

export function postWechatPhoneLogin(data) {
  return request.post('/auth/login/wechat-phone', data)
}
