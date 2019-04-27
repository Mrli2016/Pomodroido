import {
    setStorage,
    getStorage
} from '@/utils'

export default class Pomodroido {
    constructor(working_time, relax_time) {

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
            console.log('this.working_times_history: ', this.working_times_history);
            this.working_time_history = item.working_time_history
            console.log('this.working_time_history: ', this.working_time_history);
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
     *  finishFn: 完成回调函数（可选）
     * } 
     * @return: 
     */
    start(finishFn, relaxEndFn) {
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
                    this.relax(relaxEndFn)

                    if (typeof finishFn === 'function') finishFn()
                } else {
                    this.minute -= 1
                    this.second = 59
                }
            } else {
                this.second -= 1
            }
        }, 1000);
    }

    relax(relaxEndFn) {
        this.minute = this.relax_time
        this.second = 0

        this.timer = setInterval(() => {
            if (this.second === 0) {
                if (this.minute === 0) {
                    this.pause()
                    this.start()

                    if (typeof relaxEndFn === 'function') relaxEndFn()
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
     * pauseFn: 暂停回调方法（可选）
     * } 
     * @return: 
     */
    pause(pauseFn) {
        clearInterval(this.timer)
        if (typeof pauseFn === 'function') pauseFn()
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