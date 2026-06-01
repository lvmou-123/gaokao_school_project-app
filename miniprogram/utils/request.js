import config from '../config/index'

let _authToastShown = false

const request = {
  baseURL: config.API_BASE_URL,

  request(method, url, data, options = {}) {
    const token = wx.getStorageSync('token') || ''

    return new Promise((resolve, reject) => {
      wx.request({
        url: this.baseURL + url,
        method,
        data,
        header: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers,
        },
        timeout: config.TIMEOUT,
        success(res) {
          if (res.statusCode === 401) {
            wx.removeStorageSync('token')
            wx.removeStorageSync('userInfo')
            // 防止重复弹窗
            if (!_authToastShown) {
              _authToastShown = true
              wx.showToast({ title: '请先完成微信登录', icon: 'none', duration: 2000 })
            }
            reject(new Error(res.data?.message || '未登录'))
            return
          }

          const body = res.data
          if (body.code === 200) {
            resolve(body)
          } else {
            console.warn(`[API Error] ${method} ${url}:`, body)
            reject(new Error(body.message || '请求失败'))
          }
        },
        fail(err) {
          console.warn(`[API Error] ${method} ${url}:`, err)
          wx.showToast({ title: '网络错误，请检查后端是否启动', icon: 'none' })
          reject(err)
        },
      })
    })
  },

  get(url, params, options) {
    return this.request('GET', url, params, options)
  },

  post(url, data, options) {
    return this.request('POST', url, data, options)
  },

  put(url, data, options) {
    return this.request('PUT', url, data, options)
  },

  delete(url, data, options) {
    return this.request('DELETE', url, data, options)
  },
}

export default request
