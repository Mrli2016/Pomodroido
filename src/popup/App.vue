<template>
  <div class="main_app">
    <!-- <vue-clock
      class="m-b-15"
      :border="clockOption.border"
      :number="clockOption.number"
    ></vue-clock> -->
    <div class="sandglass">
      <span class="minute">{{ minute }}</span>
      <digit-roll
        class="second"
        ref='digitroll'
        :rollDigits="second"
        :flipStra="false"
        :dur="500"
      >
      </digit-roll>
    </div>
    <div class="m-t-15">
      <span style="line-height: 2;">工作时长(分钟)：</span>
      <el-input-number
        size="mini"
        :min="0"
        :max="60"
        :disabled="this.working"
        @change="changeMinute = true"
        v-model="setMinute"
      ></el-input-number>
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
      setMinute: 0,
      minute: 0,
      second: 0,
      end: false,
      working: false,
      timer: null
    }
  },
  watch: {
    working: function(val) {
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
      this.background.start(this.setMinute)
      this.working = true
      this.minute = this.setMinute
    },
    reset() {
      this.background.reset()
      this.minute = this.setMinute
      this.second = 0
      this.working = false
      // 因组件渲染有延迟，需进行hack处理
      setTimeout(() => {
        this.$refs.digitroll.setDigit(this.second)
      }, 0);
    },
    refreshPomodroidoInfo() {
      this.background.pomodroidoInfo().then((info) => {
        this.setMinute = info.setMinute
        this.working = info.working
        this.minute = info.minute
        this.second = info.second
      })
    }
  },
  mounted() {
    this.refreshPomodroidoInfo()
  }
}
</script>

<style lang="scss">
@keyframes clockShadow {
  0% {
    box-shadow: 0px 3px 3px #409eff;
  }
  25% {
    box-shadow: -3px 0px 3px #409eff;
  }
  50% {
    box-shadow: 0px -3px 3px #409eff;
  }
  75% {
    box-shadow: 3px 0px 3px #409eff;
  }
  100% {
    box-shadow: 0px 3px 3px #409eff;
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
    animation: clockShadow 3s infinite;
    animation-timing-function: linear;

    .minute {
      display: inline-block;
      font-size: 60px;
      line-height: 1;
      color: #409eff;
    }

    .second {
      width: 40px;
      margin: 10px auto;

      .d-roll-list {
        background: #409eff;
        border-radius: 5px;
        color: #fff;
      }
    }
  }
}
</style>
