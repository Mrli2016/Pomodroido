/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-03 15:55:03
 * @LastEditTime: 2019-06-03 15:55:03
 * @LastEditors: your name
 */
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
    notification(new Date().getTime().toString(), {
      type: 'basic',
      iconUrl: 'assets/icons/48.png',
      title: '番茄钟升级成功！',
      priority: 2,
      message: '修复部分网页样式错乱问题'
    }) // 插件安装成功后添加欢迎页面
  }
});

var pomodroido // 番茄钟实例变量

window.start = function(working_time, relax_time) {
  // 开始计时
  pomodroido = new Pomodroido({
    working_time,
    relax_time,
    workEndFn: () => {
      // 发送信息给content
      sendMessageToContentScript({
        act: 'pomodroido',
        data: 'workEnd'
      })

      notification(new Date().getTime().toString(), {
        type: 'basic',
        iconUrl: 'assets/icons/coffee.png',
        title: '休息时间到啦！',
        priority: 2,
        message: '先休息一下放松心情'
      })
    },
    relaxEndFn: () => {
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
    }
  })

  pomodroido.work()
}

window.stop = function() {
  if (pomodroido) {
    pomodroido.stop()
  }
}

window.pause = function() {
  if (pomodroido) pomodroido.pause()
}

window.continue = function() {
  if (pomodroido) pomodroido.continue()
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