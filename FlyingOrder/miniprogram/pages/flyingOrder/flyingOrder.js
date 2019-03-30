// miniprogram/pages/flyingOrder/flyingOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    words: ['人', '飞', '花', '令', '月', '月', '月', '月', '月', '月', '月', '月', '月', '月', '月', '月', '月', '月', '月', '月', '月', '月', '月', '月', '月', '月', '月', '月', '月', '月', '月', '月'],
    toView: 'red',
    scrollTop: 100
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 点击关于
   */
  onAbout: function() {
    console.info('点击关于');
  },

  tap(e) {
    for (let i = 0; i < this.data.words.length; ++i) {
      if (this.data.words[i] === this.data.toView) {
        this.setData({
          toView: this.data.words[i + 1]
        })
        break
      }
    }
  },
  tapMove(e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  }
})