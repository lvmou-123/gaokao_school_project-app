import { getSchoolById } from '../../services/schools'
import { getMajors } from '../../services/majors'
import { postRecommend } from '../../services/recommendation'

Page({
  data: {
    school: null,
    majors: [],
    recommendations: [],
    loading: true,
    recommending: false,
  },

  onLoad(options) {
    this.schoolId = Number(options.id)
    this.fetchData()
  },

  async fetchData() {
    this.setData({ loading: true })
    try {
      const [schoolRes, majorsRes] = await Promise.all([
        getSchoolById(this.schoolId),
        getMajors({ schoolId: this.schoolId, page: 0, size: 50 }),
      ])
      const majorsData = majorsRes.data || {}
      const majors = majorsData.list || majorsData.content || (Array.isArray(majorsData) ? majorsData : [])
      this.setData({
        school: schoolRes.data,
        majors,
        loading: false,
      })
    } catch {
      this.setData({ loading: false })
    }
  },

  async handleRecommend() {
    this.setData({ recommending: true })
    try {
      const school = this.data.school
      const userInfo = wx.getStorageSync('userInfo') || {}
      const res = await postRecommend({
        userId: userInfo.userId || 0,
        score: userInfo.score || 600,
        rankNum: userInfo.rankNum || 15000,
        province: school?.province || '',
        preferences: school ? [school.category].filter(Boolean) : [],
      })
      this.setData({ recommendations: res.data || [] })
    } catch {
      wx.showToast({ title: '获取推荐失败', icon: 'none' })
    } finally {
      this.setData({ recommending: false })
    }
  },
})
