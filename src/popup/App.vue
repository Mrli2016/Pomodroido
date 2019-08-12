<template>
  <div class="main_app">
    <h3 class="text-primary">工作次数: {{ working_times}} </h3>
    <div :class="{sandglass: true, working: working}">
      <span class="minute m-b-15">{{ minute }}</span>
      <div
        v-if="relaxing"
        class="text-primary"
        style="font-size: 14px;"
      >休息中</div>
      <digit-roll
        v-else
        class="second"
        ref='digitroll'
        :rollDigits="second"
        :flipStra="false"
        :dur="500"
      >
      </digit-roll>
    </div>
    <el-button-group class="m-t-15">
      <el-button
        v-if="pausing"
        type="success"
        size="mini"
        plain
        @click="makeContinue"
      >继续</el-button>
      <el-button
        v-if="!running"
        type="primary"
        size="mini"
        plain
        @click="start"
      >开始</el-button>
      <el-button
        v-if="working || relaxing"
        type="warning"
        size="mini"
        plain
        @click="pause"
      >暂停</el-button>
      <el-button
        type="danger"
        size="mini"
        plain
        @click="stop"
      >停止</el-button>
    </el-button-group>
    <div class="m-t-15">
      <span style="line-height: 2;">工作时长：</span>
      <el-input-number
        size="mini"
        :min="0"
        :max="60"
        :disabled="this.running"
        v-model="working_time"
      ></el-input-number>
    </div>
    <div class="m-t-15">
      <span style="line-height: 2;">休息时长：</span>
      <el-input-number
        size="mini"
        :min="0"
        :max="60"
        :disabled="this.running"
        v-model="relax_time"
      ></el-input-number>
    </div>
  </div>
</template>

<script>
import DigitRoll from '@/components/DigitRoll'
export default {
  name: 'app',
  components: {
    DigitRoll,
  },
  data() {
    return {
      background: window.chrome.extension.getBackgroundPage(),

      running: false,
      pausing: false,
      working: false,
      relaxing: false,
      pauseStatue: 'working',

      working_time: 25,
      relax_time: 5,
      minute: 0,
      second: 0,

      timer: null,
      working_times: 0
    }
  },
  watch: {
    running: function(val) {

      if (val) this.run()
    }
  },
  methods: {
    run() {
      if (this.timer) clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.refreshPomodroidoInfo()
      }, 1000);
    },
    start() {
      if (!this.working_time) return
      this.running = true
      this.working = true
      this.pausing = false
      this.relaxing = false

      this.background.start(this.working_time, this.relax_time)
      this.minute = this.working_time
      this.second = 0
      this.run()
    },
    pause() {
      if (this.timer) clearInterval(this.timer)
      this.working ? this.pauseStatue = 'working' : this.pauseStatue = "relaxing"

      this.pausing = true
      this.working = false
      this.relaxing = false

      this.background.pause()
    },
    makeContinue() {
      if (this.pauseStatue === 'working') {
        this.working = true
      } else {
        this.relaxing = true
      }
      this.pausing = false
      this.run()
      this.background.continue()
    },
    stop() {
      if (this.timer) clearInterval(this.timer)

      this.pausing = false
      this.working = false
      this.relaxing = false
      this.minute = this.working_time
      this.second = 0

      this.running = false

      this.background.stop()

      // 因组件渲染有延迟，需进行hack处理
      this.$nextTick(() => {
        this.$refs.digitroll.setDigit(this.second)
      })
    },
    refreshPomodroidoInfo() {
      this.background.pomodroidoInfo().then((info) => {
        for (let i in info) {
          this[i] = info[i]
        }
      })
    }
  },
  created() {
    this.refreshPomodroidoInfo()
  }
}
</script>

<style lang="scss">
@import "src/styles/variables.scss";
@keyframes workingShadow {
  0% {
    box-shadow: 0px 3px 5px $primary;
  }
  25% {
    box-shadow: -3px 0px 5px $primary;
  }
  50% {
    box-shadow: 0px -3px 5px $primary;
  }
  75% {
    box-shadow: 3px 0px 5px $primary;
  }
  100% {
    box-shadow: 0px 3px 5px $primary;
  }
}

@keyframes relaxShadow {
  0% {
    box-shadow: 0px 0px 5px 3px $primary;
  }
  50% {
    box-shadow: 0px 0px 10px 5px $primary-dark;
  }
  100% {
    box-shadow: 0px 0px 5px 3px $primary;
  }
}

.main_app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 200px;

  .sandglass {
    display: inline-block;
    padding: 20px 0;
    width: 150px;
    height: 150px;
    border: 1px solid #409eff;
    border-radius: 100%;
    text-align: center;
    font-size: 14px;
    box-shadow: 3px 3px 3px #409eff;
    animation: relaxShadow 3s infinite;
    animation-timing-function: linear;

    &.working {
      animation: workingShadow 3s infinite;
    }

    .minute {
      display: inline-block;
      font-size: 60px;
      line-height: 1;
      color: #409eff;
    }

    .second {
      width: 40px;
      margin: 0 auto;

      .d-roll-list {
        background: #409eff;
        border-radius: 5px;
        color: #fff;
      }
    }
  }
}
</style>
