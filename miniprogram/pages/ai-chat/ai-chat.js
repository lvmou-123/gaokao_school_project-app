import { postAiChat } from '../../services/ai'

Page({
  data: {
    messages: [
      { role: 'assistant', content: '你好！我是高考志愿填报助手，有什么可以帮你的？' },
    ],
    input: '',
    loading: false,
    showScoreForm: false,
    score: '',
    rankNum: '',
    province: '',
    scrollToId: '',
  },

  onInput(e) {
    this.setData({ input: e.detail.value })
  },

  onScoreInput(e) {
    this.setData({ score: e.detail.value })
  },

  onRankInput(e) {
    this.setData({ rankNum: e.detail.value })
  },

  onProvinceInput(e) {
    this.setData({ province: e.detail.value })
  },

  toggleScoreForm() {
    this.setData({ showScoreForm: !this.data.showScoreForm })
  },

  async handleSend() {
    const text = this.data.input.trim()
    if (!text) return

    const messages = [...this.data.messages, { role: 'user', content: text }]
    this.setData({ messages, input: '', loading: true })

    try {
      const params = { message: text }
      if (this.data.score) params.score = Number(this.data.score)
      if (this.data.rankNum) params.rankNum = Number(this.data.rankNum)
      if (this.data.province) params.province = this.data.province

      const res = await postAiChat(params)
      messages.push({ role: 'assistant', content: res.data.reply })
      this.setData({ messages, loading: false })
    } catch {
      messages.push({ role: 'assistant', content: '抱歉，我暂时无法回复，请稍后再试。' })
      this.setData({ messages, loading: false })
    }
  },
})
