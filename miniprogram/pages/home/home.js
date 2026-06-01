import { postWechatPhoneLogin } from '../../services/auth'

const app = getApp()

Page({
  data: {
    isLoggedIn: false,
    logging: false,
  },

  onShow() {
    this.checkLogin()
  },

  checkLogin() {
    const token = wx.getStorageSync('token')
    this.setData({ isLoggedIn: !!token })
  },

  onGetPhoneNumber(e) {
    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      return
    }

    this.setData({ logging: true })

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
            this.setData({
              isLoggedIn: true,
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

  goSchools() {
    wx.switchTab({ url: '/pages/schools/schools' })
  },

  goAiChat() {
    wx.navigateTo({ url: '/pages/ai-chat/ai-chat' })
  },

  goPage(e) {
    const path = e.currentTarget.dataset.path
    if (path.includes('schools') || path.includes('majors')) {
      wx.switchTab({ url: path })
    } else {
      wx.navigateTo({ url: path })
    }
  },
})
