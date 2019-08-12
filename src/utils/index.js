/* eslint-disable */
export function notification(id, options) {
    chrome.notifications.create(id, options)
}

/**
 * @description: 存储storage
 * @param {type} 
 * @return: 
 */
export function setStorage(obj, fn) {
    chrome.storage.sync.set(obj, fn)
}

/**
 * @description: 获取storage(obj可设置默认值)
 * @param {
 *  obj: {color: 'red', age: 18}
 * } 
 * @return: 
 */
export function getStorage(obj, fn) {
    chrome.storage.sync.get(obj, fn)
}

/**
 * @description: 发送信息给当前页面的conten.js
 * @param {type} 
 * @return: 
 */
export function sendMessageToContentScript(message, callback) {
    window.chrome.tabs.query({
        active: true
    }, function(tabs) {
        tabs.forEach((tab) => {
            window.chrome.tabs.sendMessage(tab.id, message, function(response) {
                if (callback) callback(response);
            });
        })
    });
}

export function hasClass(el, className) {
    return !!el.className.match(new RegExp("(\\s|^)" + className + "(\\s|$)")); // ( \\s|^ ) 判断前面是否有空格 （\\s | $ ）判断后面是否有空格 两个感叹号为转换为布尔值 以方便做判断
}

export function addClass(el, className) {
    if (!hasClass(el, className)) {
        el.className += " " + className;
    };
}

export function removeClass(el, className) {
    if (hasClass(el, className)) {
        el.className = el.className.replace(new RegExp("(\\s|^)" + className + "(\\s|$)"), " "); // replace方法是替换
    };
}