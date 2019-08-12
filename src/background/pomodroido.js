/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-03 15:55:03
 * @LastEditTime: 2019-08-12 10:42:19
 * @LastEditors: Please set LastEditors
 */
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
        this.minute = working_time // 分钟数
        this.second = 0 // 秒数

        this.working = false // 是否工作中
        this.relaxing = false // 是否休息中
        this.pausing = false // 是否暂停
        this.pauseStatue = 'working' // 暂停时的状态

        this.workEndFn = workEndFn // 工作结束回调方法
        this.relaxEndFn = relaxEndFn // 放松时间结束回调方法

        this.working_times = 0 // 工作次数
        this.working_times_history = 0 // 总工作次数历史
        this.working_time_history = 0 // 总工作时间

        // 保存工作时间
        setStorage({
            working_time: this.working_time,
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
     * @description: 获取番茄钟信息
     * @param {type} 
     * @return: 
     */
    pomodroidoInfo() {
        return {
            running: this.running,
            working_time: this.working_time,
            relax_time: this.relax_time,

            minute: this.minute,
            second: this.second,

            working: this.working,
            relaxing: this.relaxing,
            pausing: this.pausing,
            pauseStatue: this.pauseStatue,

            working_times: this.working_times,

            working_time_history: this.working_time_history,
            working_times_history: this.working_times_history
        }
    }

    /**
     * @description: 开始
     * @param {
     * } 
     * @return: 
     */
    work() {
        if (!this.working_time) return

        this.running = true
        this.pausing = false
        this.working = true
        this.relaxing = false

        this.minute = this.working_time
        this.second = 0

        this.workRun()
    }

    /**
     * @description: 设置工作定时器
     * @param {type} 
     * @return: 
     */
    workRun() {
        if (this.timer) clearInterval(this.timer)
        this.working = true
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
        this.pausing = false
        this.working = false
        this.relaxing = true

        this.minute = this.relax_time
        this.second = 0

        this.relaxRun()
    }

    /**
     * @description: 设置休息定时器
     * @param {type} 
     * @return: 
     */
    relaxRun() {
        this.relaxing = true
        if (this.timer) clearInterval(this.timer)
        this.timer = setInterval(() => {
            if (this.second === 0) {
                if (this.minute === 0) {
                    this.work()

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
     * @description: 继续计时
     * @param {type} 
     * @return: 
     */
    continue () {
        this.pausing = false
        if (this.pauseStatue === 'working') {
            this.working = true
            this.workRun()
        } else {
            this.releaxing = true
            this.relaxRun()
        }
    }

    /**
     * @description: 暂停
     * @param {
     * } 
     * @return: 
     */
    pause() {
        if (this.timer) clearInterval(this.timer)

        this.working ? this.pauseStatue = 'working' : this.pauseStatue = 'relaxing'
        this.pausing = true
        this.working = false
        this.relaxing = false
    }

    /**
     * @description: 停止并重置
     * @param {type} 
     * @return: 
     */
    stop() {
        if (this.timer) clearInterval(this.timer)

        this.running = false
        this.pausing = false
        this.working = false
        this.relaxing = false

        this.minute = this.working_time
        this.second = 0
    }
}