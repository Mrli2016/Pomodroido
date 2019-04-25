/* eslint-disable */
export function notification(id, options) {
    chrome.notifications.create(id, options)
    console.log('id: ', id);
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