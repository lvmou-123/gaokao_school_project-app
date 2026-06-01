import { getMajors } from '../../services/majors'

const app = getApp()

Page({
  data: {
    keyword: '',
    category: '',
    list: [],
    total: 0,
    page: 0,
    size: 20,
    loading: false,
    categoryList: ['工学', '理学', '医学', '文学', '法学', '经济学', '管理学', '教育学', '农学', '哲学', '历史学', '艺术学'],
  },

  onLoad() {
    this.fetchData()
  },

  onKeywordInput(e) {
    this.setData({ keyword: e.detail.value })
  },

  onCategoryChange(e) {
    const idx = e.detail.value
    this.setData({
      category: this.data.categoryList[idx] || '',
      page: 0,
    }, () => this.fetchData())
  },

  handleSearch() {
    this.setData({ page: 0 }, () => this.fetchData())
  },

  async fetchData() {
    this.setData({ loading: true })
    try {
      const params = { page: this.data.page, size: this.data.size }
      if (this.data.keyword) params.keyword = this.data.keyword
      if (this.data.category) params.category = this.data.category

      const res = await getMajors(params)
      const data = res.data || {}
      const newList = this.data.page === 0 ? (data.list || data.content || []) : [...this.data.list, ...(data.list || data.content || [])]
      this.setData({
        list: newList,
        total: data.total || 0,
        loading: false,
      })
    } catch {
      this.setData({ loading: false })
    }
  },

  viewSchools(e) {
    const { majorid, majorname } = e.currentTarget.dataset
    app.globalData.pendingMajorFilter = { majorId: Number(majorid), majorName: majorname }
    wx.switchTab({ url: '/pages/schools/schools' })
  },

  loadMore() {
    if (this.data.list.length >= this.data.total) return
    this.setData({ page: this.data.page + 1 }, () => this.fetchData())
  },
})
