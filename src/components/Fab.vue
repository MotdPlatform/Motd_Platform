<template>
  <div>
    <div class="fab">
      <button
        class="btn"
        v-if="$route.path == '/terms'"
        @click="$router.push({ path: '/' }), refresh()"
      >
        <font-awesome-icon icon="arrow-left" />
      </button>
      <button class="btn" v-if="$route.path != '/terms'" @click="refresh">
        <font-awesome-icon icon="redo" />
      </button>
      <button class="btn" @click="ModalVisible = true">
        <font-awesome-icon icon="layer-group" />
      </button>
    </div>

    <transition name="fade">
      <div class="model__wapper" v-show="ModalVisible">
        <div class="model__cover" @click="ModalVisible = false"></div>
        <div v-if="query" class="model__float">
          <div class="header">当前检索的服务器信息监控</div>
          <div>{{ query.motd }}</div>
          <div>v{{ query.version }}</div>
          <div>在线: {{ query.online }}/{{ query.max }}</div>
          <div>延迟: {{ query.delay }}ms</div>
          <div>模式: {{ query.gamemode }}</div>
          <div>位置: {{ query.location }}</div>
          <div>PROTOCOL_{{ query.agreement }}</div>
        </div>
        <div class="model">
          <div class="model__msg">{{ msg }}</div>
          <div class="header">工具栏</div>
          <div class="container">
            <label for="ip">服务器地址</label>
            <input id="ip" type="text" v-model="ip" />
            <label for="port">服务器端口</label>
            <input id="port" type="text" v-model="port" />
            <input id="agreement" type="checkbox" v-model="agreement" />
            <label for="agreement"
              >我同意<router-link to="/terms">用户协议</router-link></label
            >
          </div>
          <div class="divider"></div>
          <div class="footer">
            <button class="btn block" @click="getMotd()" :disabled="querying">
              <span v-if="!querying"
                ><font-awesome-icon
                  icon="search"
                  style="margin-right: 5px"
                />查询</span
              >
              <span v-if="querying"
                ><font-awesome-icon
                  class="querying"
                  icon="sync-alt"
                  style="margin-right: 5px"
                />查询中...</span
              >
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "Fab",

  data: () => ({
    ModalVisible: false,
    msg: null,
    ip: null,
    port: null,
    agreement: false,
    query: false,
    listener: Object,
    querying: false,
  }),

  methods: {
    getMotd: function () {
      if (!this.agreement) {
        this.msg = "请同意用户协议后继续！";
        return;
      }

      if (this.$utils.isEmpty(this.ip) || this.$utils.isEmpty(this.port)) {
        this.msg = "请将信息填写完整！";
        return;
      }

      if (
        !this.$utils.isIPv4(this.ip) &&
        !this.$utils.isIPv6(this.ip) &&
        !this.$utils.isDomain(this.ip)
      ) {
        this.msg = "服务器地址填写错误！";
        return;
      }

      if (!this.$utils.isPort(this.port)) {
        this.msg = "服务器端口填写错误！";
        return;
      }

      clearInterval(this.listener);
      this.querying = true;

      this.listener = setInterval(() => {
        this.$request({
          params: {
            d: "add",
            ip: this.ip,
            port: this.port,
          },
        })
          .then((result) => {
            if (
              !this.$utils.isEmpty(result.data) &&
              result.data.status === 200
            ) {
              this.querying = false;
              this.query = result.data.data;
              this.$parent.$refs.alert.alert(
                "当前信息：",
                `服务器[${this.query.motd}]已经在中转排队等待咯！请您稍等~`
              );
            }
          })
          .catch((error) => {
            clearInterval(this.listener);
            this.querying = false;
              this.$parent.$refs.alert.alert(
                "当前信息：",
                `所查询的服务器拒绝了当前平台的数据发送。`
              );
          });
      }, this.$_Config.listenerTimer);
    },

    refresh: function () {
      this.$parent.updateBadges();
      this.$parent.updateList();
    },
  },

  watch: {
    ModalVisible(val) {
      this.msg = null;
    },
  },
};
</script>

<style scoped>
.fab {
  position: fixed;
  right: 25px;
  bottom: 25px;
  box-shadow: -1px 1px 8px rgb(0 0 0 / 50%);
  display: inline-grid;
  z-index: 1;
}

.fab button {
  font-size: 18px;
  padding: 15px;
}

.querying {
  animation: rotate 1s infinite;
}

@keyframes rotate {
  to {
    transform: rotate(0deg);
  }
  from {
    transform: rotate(360deg);
  }
}
</style>