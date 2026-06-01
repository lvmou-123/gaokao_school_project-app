import { listFavorites, removeFavorite } from '../../services/favorites'

Page({
  data: {
    list: [],
    total: 0,
    page: 0,
    size: 20,
    loading: false,
  },

  onShow() {
    // 每次显示刷新数据
    this.setData({ page: 0 }, () => this.fetchData())
  },

  async fetchData() {
    const token = wx.getStorageSync('token')
    if (!token) {
      this.setData({ loading: false })
      return
    }

    this.setData({ loading: true })
    try {
      const res = await listFavorites({ page: this.data.page, size: this.data.size })
      const data = res.data || {}
      const newList = this.data.page === 0 ? (data.list || []) : [...this.data.list, ...(data.list || [])]
      this.setData({
        list: newList,
        total: data.total || 0,
        loading: false,
      })
    } catch {
      this.setData({ loading: false })
    }
  },

  async handleRemove(e) {
    const id = e.currentTarget.dataset.id
    try {
      await removeFavorite(id)
      const newList = this.data.list.filter(item => item.schoolId !== id)
      this.setData({
        list: newList,
        total: this.data.total - 1,
      })
      wx.showToast({ title: '已取消收藏', icon: 'success' })
    } catch {
      wx.showToast({ title: '操作失败', icon: 'none' })
    }
  },

  goSchool(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/school-detail/school-detail?id=${id}` })
  },

  goSchools() {
    wx.switchTab({ url: '/pages/schools/schools' })
  },

  loadMore() {
    if (this.data.list.length >= this.data.total) return
    this.setData({ page: this.data.page + 1 }, () => this.fetchData())
  },
})
