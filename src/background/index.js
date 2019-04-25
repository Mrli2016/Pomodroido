import {
  notification,
  getStorage
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


window.start = function(minute) {
  // 开始计时
  pomodroido = new Pomodroido(minute)
  pomodroido.start()
}

window.reset = function() {
  if (pomodroido) pomodroido.reset()
}

window.pomodroidoInfo = function() {
  return new Promise((resolve, reject) => {
    if (pomodroido) {
      resolve(pomodroido.pomodroidoInfo())
    } else {
      getStorage({
        'working_time': 0
      }, (item) => {
        if (item.working_time > 0) {
          console.log('new', new Date().getTime());
          pomodroido = new Pomodroido(item.working_time)
          resolve({
            setMinute: item.working_time,
            working: false,
            minute: item.working_time,
            second: 0
          })
        } else {
          resolve({
            setMinute: 0,
            working: false,
            minute: 0,
            second: 0
          })
        }
      })
    }
  })
}