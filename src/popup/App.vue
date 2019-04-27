<template>
  <div class="main_app">
    <h3 class="text-primary">工作次数: {{ working_times}} </h3>
    <div :class="{sandglass: true, working: working}">
      <span class="minute m-b-15">{{ minute }}</span>
      <digit-roll
        v-if="working"
        class="second"
        ref='digitroll'
        :rollDigits="second"
        :flipStra="false"
        :dur="500"
      >
      </digit-roll>
      <div
        v-else
        class="text-primary"
        style="font-size: 14px;"
      >休息中</div>
    </div>
    <el-button-group class="m-t-15">
      <el-button
        :type="this.working ? 'primary' : ''"
        size="mini"
        plain
        @click="start"
      >开始</el-button>
      <el-button
        type="danger"
        size="mini"
        plain
        @click="reset"
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
      working_time: 25,
      relax_time: 5,
      minute: 0,
      second: 0,
      end: false,
      working: false,
      timer: null,
      working_times: 0
    }
  },
  watch: {
    running: function(val) {
      if (val) {
        this.timer = setInterval(() => {
          this.refreshPomodroidoInfo()
        }, 1000);
      } else {
        if (this.timer) clearInterval(this.timer)
      }
    }
  },
  methods: {
    start() {
      this.background.start(this.working_time, this.relax_time)
      this.running = true
      this.working = true
      this.minute = this.minute || this.working_time
    },
    reset() {
      this.running = false
      this.working = false
      this.minute = this.working_time
      this.second = 0

      this.background.reset()
      // 因组件渲染有延迟，需进行hack处理
      setTimeout(() => {
        this.$refs.digitroll.setDigit(this.second)
      }, 0);
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
