// pages/addFunction/addFunction.js

const imageUrl = `../../images/helloWorld/default-icon.jpg`

Page({

  data: {
    result: '',
    canIUseClipboard: wx.canIUse('setClipboardData'),
  },

  onLoad: function (options) {

  },

  copyCode: function () {
    wx.setClipboardData({
      data: imageUrl,
      success: function () {
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  },

  sayHello() {
    wx.showModal({
      title: '提示',
      content: 'Hellow World!',
    })
    // wx.showLoading({
    //   title: 'loading...',
    // })
    // wx.cloud.callFunction({
    //   name: 'sum',
    //   data: {
    //     a: 999,
    //     b: 2
    //   },
    //   success: res => {
    //     wx.showToast({
    //       title: '调用成功',
    //     })
    //     this.setData({
    //       result: JSON.stringify(res.result)
    //     })
    //   },
    //   fail: err => {
    //     wx.showToast({
    //       icon: 'none',
    //       title: '调用失败',
    //     })
    //     console.error('[云函数] [sum] 调用失败：', err)
    //   }
    // })
  },

})

