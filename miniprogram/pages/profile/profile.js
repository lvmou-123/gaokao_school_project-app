import { postWechatPhoneLogin } from '../../services/auth'

const app = getApp()

Page({
  data: {
    isLoggedIn: false,
    userInfo: {},
    logging: false,
  },

  onShow() {
    this.checkLogin()
  },

  checkLogin() {
    const token = wx.getStorageSync('token')
    const userInfo = wx.getStorageSync('userInfo') || {}
    this.setData({
      isLoggedIn: !!token,
      userInfo,
    })
  },

  onGetPhoneNumber(e) {
    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      wx.showToast({ title: '需要授权手机号才能登录', icon: 'none' })
      return
    }

    this.setData({ logging: true })

    // 先获取 wx.login code
    wx.login({
      success: async (loginRes) => {
        try {
          const res = await postWechatPhoneLogin({
            code: loginRes.code,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
          })

          const authData = res.data
          if (authData?.token) {
            wx.setStorageSync('token', authData.token)
            wx.setStorageSync('userInfo', {
              userId: authData.userId,
              nickname: authData.nickname || '微信用户',
              avatar: authData.avatar || '',
              phone: authData.phone || '',
            })
            wx.showToast({ title: '登录成功', icon: 'success' })
            this.setData({
              isLoggedIn: true,
              userInfo: {
                userId: authData.userId,
                nickname: authData.nickname || '微信用户',
                avatar: authData.avatar || '',
                phone: authData.phone || '',
              },
              logging: false,
            })
          }
        } catch (err) {
          console.error('[Login] 手机号一键登录失败:', err)
          wx.showToast({ title: '登录失败，请重试', icon: 'none' })
          this.setData({ logging: false })
        }
      },
      fail: () => {
        wx.showToast({ title: '获取微信凭证失败', icon: 'none' })
        this.setData({ logging: false })
      },
    })
  },

  goFavorites() {
    if (!this.data.isLoggedIn) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    wx.navigateTo({ url: '/pages/favorites/favorites' })
  },

  goAiChat() {
    wx.navigateTo({ url: '/pages/ai-chat/ai-chat' })
  },

  goSchools() {
    wx.switchTab({ url: '/pages/schools/schools' })
  },

  goMajors() {
    wx.switchTab({ url: '/pages/majors/majors' })
  },

  handleLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('token')
          wx.removeStorageSync('userInfo')
          this.setData({ isLoggedIn: false, userInfo: {} })
          wx.showToast({ title: '已退出', icon: 'success' })
        }
      },
    })
  },
})
