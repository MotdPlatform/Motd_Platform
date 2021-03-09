<template>
  <div>
    <transition name="fade">
      <div id="alert" v-show="alertVisible" @click="alertVisible = false">
        <div class="container alert">
          <div class="alert__title">{{ title }}</div>
          <div class="alert__container">
            {{ msg }}
          </div>
          <div class="alert__sub">点击以关闭该窗口。</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "Alert",

  data: () => ({
    alertVisible: true,
    title: "",
    msg: "",
  }),

  mounted() {
    this.title = this.$parent.TmpPlatformData.notice.title;
    this.msg = this.$parent.TmpPlatformData.notice.msg;
  },

  methods: {
    alert: function (title, msg) {
      this.title = title;
      this.msg = msg;
      this.alertVisible = true;
    },
  },
};
</script>

<style scoped>
#alert {
  margin: 10px auto 0 auto;
  border-radius: 5px 5px 0 0;
  width: 90%;
  max-width: 1010px;
  cursor: default;
}

.container.alert {
  padding: 15px 10px;
  color: #fff;
  background: rgba(20, 20, 20, 0.85);
  border: 4px solid #fff;
  border-radius: 16px;
  border-image-width: 6px;
  border-image-repeat: repeat;
  border-image-slice: 4;
  border-image-source: url("https://cdn.jsdelivr.net/gh/pluginskers/ImgBed/ImgBedalert.png");
  box-shadow: 0 0 4px 0 rgb(0 0 0 / 50%);
}

.alert__title {
  font-size: 24px;
  margin-bottom: 10px;
}

.alert__container {
  font-size: 14px;
  text-indent: 20px;
}

.alert__sub {
  text-align: right;
  margin-top: 5px;
  font-size: 10px;
  color: #717171;
}
</style>
