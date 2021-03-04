<template>
  <div id="loading">
    <div class="loading"></div>
    <a class="refresh" v-show="timeout" @click="this.reload"
      >出错了？刷新重试</a
    >
    <div class="tips">Tips: {{ tip }}</div>
  </div>
</template>

<script>
export default {
  name: "Loading",

  data: () => ({
    tip: "首次加载中。。。",
    tips: null,
    timeout: false,
    refreshText: Object,
  }),

  mounted() {
    let tmp_t = this.$parent.TmpData["tips"];
    if (tmp_t.length > 0) {
      this.tips = tmp_t;
      this.changeTip();

      setInterval(() => {
        this.changeTip();
      }, this.$_Config.tipTimeInterval);
    }

    this.refreshText = setTimeout(() => {
      if (!this.$parent.done) {
        this.timeout = true;
      }
    }, this.$_Config.timeout);
  },

  methods: {
    changeTip: function () {
      let r = Math.floor(Math.random() * this.tips.length);
      this.tip = this.tips[r].content;
    },

    reload: function () {
      location.reload();
      this.$router.go(0);
    },
  },
};
</script>

<style scoped>
#loading {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: url("../assets/tp_out.gif");
  background-blend-mode: color;
  background-color: rgb(0 0 0 / 40%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4;
}

.loading {
  position: relative;
  top: -140px;
  left: -80px;
  opacity: 0.9;
}

.loading:before {
  content: "";
  position: absolute;
  top: 60px;
  left: 55px;
  width: 50px;
  height: 50px;
  background: url(../assets/logo.png);
  border-radius: 2px;
  transform: rotate(45deg);
  animation: loading 0.8s infinite;
  z-index: 2;
}

@keyframes loading {
  0% {
    top: 50px;
  }
  20% {
    border-radius: 2px;
  }
  50% {
    top: 80px;
    border-bottom-right-radius: 25px;
  }
  80% {
    border-radius: 2px;
  }
  100% {
    top: 50px;
  }
}

.loading:after {
  content: "";
  position: absolute;
  top: 128px;
  left: 57px;
  width: 44px;
  height: 3px;
  background: #42523c;
  border-radius: 100%;
  animation: shadow 0.8s infinite;
  z-index: 1;
}

@keyframes shadow {
  0%,
  100% {
    left: 59px;
    width: 40px;
    background: #6c8745;
  }
  50% {
    top: 126px;
    left: 55px;
    width: 50px;
    height: 7px;
    background: #42523c;
  }
}

.tips {
  position: fixed;
  bottom: 40px;
  color: #d2d2d2;
  width: 60%;
  margin: 0 auto;
  word-break: break-all;
  text-align: center;
  z-index: 3;
}

.refresh {
  position: absolute;
  color: #aaa;
  top: 5px;
  cursor: pointer;
}
</style>
