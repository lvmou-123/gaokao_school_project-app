App({
  onLaunch() {
    const sysInfo = wx.getSystemInfoSync()
    this.globalData.systemInfo = sysInfo
    this.restoreLogin()
  },

  restoreLogin() {
    const token = wx.getStorageSync('token')
    this.globalData.isLoggedIn = !!token
    this.globalData.loginReady = true
    this.notifyLoginReady()
  },

  notifyLoginReady() {
    this.globalData._loginCallbacks?.forEach(fn => fn())
    this.globalData._loginCallbacks = []
  },

  onLoginReady(callback) {
    if (this.globalData.loginReady) {
      callback()
    } else {
      if (!this.globalData._loginCallbacks) this.globalData._loginCallbacks = []
      this.globalData._loginCallbacks.push(callback)
    }
  },

  globalData: {
    systemInfo: null,
    isLoggedIn: false,
    loginReady: false,
    pendingMajorFilter: null,
    _loginCallbacks: [],
  },
})
