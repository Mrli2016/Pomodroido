import {
    setStorage,
} from '@/utils'

export default class Pomodroido {
    constructor(minute) {
        this.timer = null // setInterval id
        this.set_minute = minute // 初始化的分钟数
        this.minute = minute // 当前的倒计时分钟数
        this.second = 0
        this.working = false // 是否工作倒计时中

        // 保存工作时间
        setStorage({
            'working_time': this.set_minute
        })
    }

    /**
     * @description: 
     * @param {type} 
     * @return: 
     */
    pomodroidoInfo() {
        return {
            setMinute: this.set_minute,
            working: this.working,
            minute: this.minute,
            second: this.second
        }
    }

    /**
     * @description: 开始
     * @param {type} 
     * @return: 
     */
    start() {
        if (!this.minute) return
        this.working = true
        this.timer = setInterval(() => {
            if (this.second === 0) {
                if (this.minute === 0) {
                    this.pause()
                } else {
                    this.minute -= 1
                    this.second = 59
                }
            } else {
                this.second -= 1
            }
        }, 1000);
    }

    /**
     * @description: 暂停
     * @param {type} 
     * @return: 
     */
    pause() {
        this.working = false
        clearInterval(this.timer)
    }

    /**
     * @description: 重置
     * @param {type} 
     * @return: 
     */
    reset() {
        this.pause()
        this.minute = this.set_minute
        this.second = 60
    }
}