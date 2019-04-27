import {
  notification,
  getStorage,
  sendMessageToContentScript
} from '@/utils'

import Pomodroido from './pomodroido'
// 插件安装事件监控
window.chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason == "install") {
    // 插件安装成功
    notification(new Date().getTime().toString(), {
      type: 'basic',
      iconUrl: 'assets/icons/48.png',
      title: '番茄钟安装成功！',
      priority: 2,
      message: '快去设置自己的番茄钟吧'
    }) // 插件安装成功后添加欢迎页面
  } else if (details.reason == "update") {
    // 插件升级成功
  }
});

var pomodroido // 番茄钟实例变量

window.start = function(working_time, relax_time) {
  // 开始计时
  pomodroido = new Pomodroido(working_time, relax_time)
  pomodroido.start(() => {
    // 发送信息给content
    sendMessageToContentScript({
      act: 'pomodroido',
      data: 'workEnd'
    })

    notification(new Date().getTime().toString(), {
      type: 'basic',
      iconUrl: 'assets/icons/48.png',
      title: '休息时间到啦！',
      priority: 2,
      message: '先休息一下放松心情'
    })
  }, () => {
    // 发送信息给content
    sendMessageToContentScript({
      act: 'pomodroido',
      data: 'relaxEnd'
    })

    notification(new Date().getTime().toString(), {
      type: 'basic',
      iconUrl: 'assets/icons/48.png',
      title: '休息结束啦！',
      priority: 2,
      message: '准备进入工作状态'
    })
  })
}

window.reset = function() {
  if (pomodroido) pomodroido.reset()
}

window.pomodroidoInfo = function() {
  return new Promise((resolve) => {
    if (pomodroido) {
      resolve(pomodroido.pomodroidoInfo())
    } else {
      getStorage({
        working_time: 25,
        relax_time: 5
      }, (item) => {
        pomodroido = new Pomodroido(item.working_time, item.relax_time)
        resolve(pomodroido.pomodroidoInfo())
      })
    }
  })
}