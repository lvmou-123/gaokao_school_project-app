import { getSchools, getSchoolsByMajor } from '../../services/schools'
import { addFavorite, removeFavorite, checkFavorite } from '../../services/favorites'

const app = getApp()

Page({
  data: {
    keyword: '',
    province: '',
    tag: '',
    list: [],
    total: 0,
    page: 0,
    size: 20,
    loading: false,
    favoriteMap: {},
    provinceList: ['北京', '天津', '上海', '重庆', '河北', '山西', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '海南', '四川', '贵州', '云南', '陕西', '甘肃', '青海', '台湾', '内蒙古', '广西', '西藏', '宁夏', '新疆'],
    tagList: ['985', '211', '双一流', '普通本科', '普通专科'],
  },

  onLoad() {
    this.fetchData()
  },

  onShow() {
    // 从专业页跳转过来时应用过滤
    const pending = app.globalData.pendingMajorFilter
    if (pending) {
      this.majorId = pending.majorId
      app.globalData.pendingMajorFilter = null
      this.setData({ page: 0 }, () => this.fetchData())
    } else if (this.data.list.length > 0) {
      this.checkFavorites()
    }
  },

  onKeywordInput(e) {
    this.setData({ keyword: e.detail.value })
  },

  onProvinceChange(e) {
    const idx = e.detail.value
    this.setData({
      province: this.data.provinceList[idx] || '',
      page: 0,
    }, () => this.fetchData())
  },

  onTagChange(e) {
    const idx = e.detail.value
    this.setData({
      tag: this.data.tagList[idx] || '',
      page: 0,
    }, () => this.fetchData())
  },

  handleSearch() {
    this.setData({ page: 0 }, () => this.fetchData())
  },

  async fetchData() {
    this.setData({ loading: true })
    try {
      let res
      if (this.majorId) {
        res = await getSchoolsByMajor(this.majorId, { page: this.data.page, size: this.data.size })
      } else {
        const params = { page: this.data.page, size: this.data.size }
        if (this.data.keyword) params.keyword = this.data.keyword
        if (this.data.province) params.province = this.data.province
        if (this.data.tag) params.tag = this.data.tag
        res = await getSchools(params)
      }
      const data = res.data || {}
      const newList = this.data.page === 0 ? (data.list || []) : [...this.data.list, ...(data.list || [])]
      this.setData({
        list: newList,
        total: data.total || 0,
        loading: false,
      })
      this.checkFavorites()
    } catch {
      this.setData({ loading: false })
    }
  },

  async checkFavorites() {
    try {
      const results = await Promise.all(
        this.data.list.map(s =>
          checkFavorite(s.id).then(r => ({ id: s.id, favorited: r.data?.favorited }))
        )
      )
      const map = {}
      results.filter(r => r.favorited).forEach(r => { map[r.id] = true })
      this.setData({ favoriteMap: map })
    } catch {}
  },

  async toggleFavorite(e) {
    const id = e.currentTarget.dataset.id
    const map = { ...this.data.favoriteMap }
    try {
      if (map[id]) {
        await removeFavorite(id)
        delete map[id]
        wx.showToast({ title: '已取消收藏', icon: 'success' })
      } else {
        await addFavorite(id)
        map[id] = true
        wx.showToast({ title: '已收藏', icon: 'success' })
      }
      this.setData({ favoriteMap: map })
    } catch {
      wx.showToast({ title: '操作失败', icon: 'none' })
    }
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/school-detail/school-detail?id=${id}` })
  },

  loadMore() {
    if (this.data.list.length >= this.data.total) return
    this.setData({ page: this.data.page + 1 }, () => this.fetchData())
  },
})
