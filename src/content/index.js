import '@/styles/content.scss'
// import {
//     Notification
// } from 'element-ui'
import {
    addClass,
    removeClass
} from '@/utils'

// 通过Chrome插件的API加载element-ui字体文件
(function insertElementIcons() {
    let elementIcons = document.createElement('style')
    elementIcons.type = 'text/css';
    elementIcons.textContent = `
        @font-face {
            font-family: "element-icons";
            src: url('${ window.chrome.extension.getURL("fonts/element-icons.woff")}') format('woff'),
            url('${ window.chrome.extension.getURL("fonts/element-icons.ttf ")}') format('truetype'); /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
        }
    `
    document.head.appendChild(elementIcons);
})();
console.log('content');
// 监听番茄钟状态事件
window.chrome.runtime.onMessage.addListener(function(request) {
    if (request.act == 'pomodroido') {
        let el = document.body
        if (request.data === 'workEnd') {
            // 工作结束
            addClass(el, 'pomodroido-work-end-bg')
            setTimeout(() => {
                removeClass(el, 'pomodroido-work-end-bg')
            }, 6000);

            // Notification({
            //     title: '休息时间到啦！',
            //     message: '先休息一下放松心情',
            //     iconClass: 'el-icon-coffee-cup text-primary'
            // })
        } else if (request.data === 'relaxEnd') {
            // 休息结束
            addClass(el, 'pomodroido-relax-end-bg');
            setTimeout(() => {
                removeClass(el, 'pomodroido-relax-end-bg')
            }, 6000);

            // Notification({
            //     title: '休息结束啦！',
            //     message: '准备进入工作状态',
            //     iconClass: 'el-icon-alarm-clock text-danger'
            // })
        }
    }
});