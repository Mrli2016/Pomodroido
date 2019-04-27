import {
    setStorage,
    getStorage
} from '@/utils'

export default class Pomodroido {
    constructor({
        working_time = 25,
        relax_time = 5,
        workEndFn = null,
        relaxEndFn = null
    } = {}) {

        this.running = false // 是否运行中
        this.timer = null // setInterval id
        this.working_time = working_time // 初始化工作时间
        this.relax_time = relax_time // 初始化休息时间
        this.minute = working_time // 当前的倒计时分钟数
        this.second = 0
        this.working = false // 是否工作倒计时中
        this.working_times = 0 // 工作次数
        this.working_times_history = 0 // 总工作次数历史
        this.working_time_history = 0 // 总工作时间

        this.workEndFn = workEndFn // 工作结束回调方法
        this.relaxEndFn = relaxEndFn // 放松时间结束回调方法

        // 保存工作时间
        setStorage({
            'working_time': this.working_time,
            relax_time: this.relax_time,
        })

        // 取出总历史工作次数
        getStorage({
            working_times_history: 0,
            working_time_history: 0
        }, (item) => {
            this.working_times_history = item.working_times_history
            this.working_time_history = item.working_time_history
        })
    }

    /**
     * @description: 
     * @param {type} 
     * @return: 
     */
    pomodroidoInfo() {
        return {
            running: this.running,
            working_time: this.working_time,
            relax_time: this.relax_time,
            working: this.working,
            minute: this.minute,
            second: this.second,
            working_times: this.working_times
        }
    }

    /**
     * @description: 开始
     * @param {
     * } 
     * @return: 
     */
    start() {
        if (!this.working_time) return
        this.running = true
        this.working = true
        this.minute = this.working_time
        this.second = 0

        this.timer = setInterval(() => {
            if (this.second === 0) {
                if (this.minute === 0) {
                    this.working = false
                    this.working_times += 1
                    this.working_times_history += 1 // 保存历史总工作次数
                    this.working_time_history += this.working_time

                    // 保存历史总工作次数
                    setStorage({
                        working_times_history: this.working_times_history,
                        working_time_history: this.working_time_history
                    })
                    this.pause()
                    this.relax()

                    if (typeof this.workEndFn === 'function') this.workEndFn()
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
     * @description: 休息
     * @param {type} 
     * @return: 
     */
    relax() {
        this.minute = this.relax_time
        this.second = 0

        this.timer = setInterval(() => {
            if (this.second === 0) {
                if (this.minute === 0) {
                    this.pause()
                    this.start()

                    if (typeof this.relaxEndFn === 'function') this.relaxEndFn()
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
     * @param {
     * } 
     * @return: 
     */
    pause() {
        clearInterval(this.timer)
    }

    /**
     * @description: 停止并重置
     * @param {type} 
     * @return: 
     */
    reset() {
        this.running = false
        this.working = false
        this.working_times = false
        this.pause()
        this.minute = this.working_time
        this.second = 60
    }
}