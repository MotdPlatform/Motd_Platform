<template>
  <div>
    <div class="container list">
      <p class="empty" v-if="isEmpty" :style="EmptyHeight">
        没有服务器哦~快申请添加吧！
      </p>
      <ul v-if="list.length > 0">
        <li
          v-for="(i, index) in list"
          :key="(i, index)"
          @click="getServerInfo(index)"
        >
          <div class="header">
            <div class="motd">
              <img class="status" src="https://cdn.jsdelivr.net/gh/pluginskers/ImgBed/c3b14ecc6c3882bdeb5ee4768f13ceadonline.gif" />{{ i.delay }}ms
              {{ i.motd }}
            </div>
            <div class="info">
              <div class="online">在线: {{ i.online }}/{{ i.max }}</div>
              <div>{{ i.ip }}:{{ i.port }}</div>
            </div>
            <div class="score">{{ i.score.toFixed(2) }}</div>
          </div>
          <div class="version">v{{ i.version }}</div>
          <div class="info">
            <div class="badge warning gamemode">{{ i.gamemode }}</div>
            <div v-if="$parent.done" v-html="getBadges(index)"></div>
          </div>
        </li>
      </ul>
    </div>

    <transition name="fade">
      <div
        name="fade"
        class="model__wapper"
        v-if="info"
        v-show="InfoModelVisible"
      >
        <div class="model__cover" @click="InfoModelVisible = false"></div>
        <div class="model">
          <div class="model__msg">{{ msg }}</div>
          <div class="header">{{ info.motd }} {{ info.delay }}ms</div>
          <div class="container card">
            <div>{{ info.ip }}:{{ info.port }}</div>
            <div>在线: {{ info.online }}/{{ info.max }}</div>
            <div>位置: {{ info.location }}</div>
            <div class="badges">
              <div class="badge success version" style="margin-right: 0px">
                v{{ info.version }}
              </div>
              <div class="badge warning gamemode">{{ info.gamemode }}</div>
              <div v-if="$parent.done" v-html="getBadges(index)"></div>
            </div>
            <div>{{ info.tip }}</div>
            <div class="auth"></div>
            <div class="plugins"></div>
            <div class="players"></div>
            <a
              class="btn block"
              :href="info.link"
              target="_blank"
              style="margin-top: 40px"
              >加入服务器</a
            >
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "Index",

  props: ["isEmpty"],

  data: () => ({
    InfoModelVisible: false,
    info: null,
    msg: null,
    list: [],
    index: null,
    filter: [],
    TmpBadges: [],
    TmpAuthsCache: [],
    EmptyHeight: { height: document.documentElement.clientHeight - 318 + "px" },
  }),

  mounted() {},

  methods: {
    refresh: function () {
      this.list = this.$parent.TmpData["list"];
      this.filter = this.$parent.TmpData["badges"];
      setTimeout(() => {
        this.$parent.done = true;
      }, this.$_Config.loadingStay);
    },

    getServerInfo: function (index) {
      this.InfoModelVisible = true;
      this.info = this.list[index];
      this.index = index;
      this.info.link = `minecraft://?addExternalServer=${this.info.motd}-来自MOTD平台|${this.info.ip}:${this.info.port}`;

      if (!this.TmpAuthsCache[this.index]) {
        this.$request({
          params: { d: "getAuth", id: this.info["id"] },
        }).then((response) => {
          if (
            !this.$utils.isEmpty(response.data) &&
            response.data.status === 200
          ) {
            let result = JSON.parse(response.data.data);
            this.TmpAuthsCache[this.index] = result;
            console.log(this.TmpAuthsCache[this.index]);
          }
        });
      }
    },

    getBadges: function (id) {
      let tmp_info = JSON.parse(JSON.stringify(this.list[id])),
        badges = JSON.parse(tmp_info.badges || "[]"),
        h = "";

      if (!this.$utils.isEmpty(this.TmpBadges[id])) {
        return this.TmpBadges[id];
      } else {
        let r = [];

        for (let e in this.filter) {
          let tmp_ = this.filter[e],
            tmp_filter = JSON.parse(tmp_.filter);
          for (let a in tmp_filter) {
            let b = tmp_filter[a];
            for (let c in b) {
              if (c == "symbol") continue;
              if (b[c].constructor != Number) {
                b[c] = eval(b[c].replace(/{(.*?)}/g, "tmp_info['$1']"));
              }
              r.push(this.$utils.symbolCompare(tmp_info[c], b[c], b.symbol));
            }
          }
          if (r.indexOf(false) == -1) {
            badges.push({ type: tmp_.type, tag: tmp_.tag });
          }
          r = [];
        }

        if (badges.length > 0) {
          badges.sort(function () {
            return 0.5 - Math.random();
          });

          for (let index in Array.from(new Array(badges.length).keys())) {
            h += `<div class="badge ${badges[index].type}">${badges[index].tag}</div>`;
          }
          this.TmpBadges[id] = h;
          return h;
        }
      }
    },
  },

  watch: {
    InfoModelVisible() {
      this.msg = null;
    },
  },
};
</script>

<style scoped>
p.empty {
  text-align: center;
}

.container.list {
  margin: 35px auto 0 auto;
  border-radius: 5px 5px 0 0;
  width: 90%;
  max-width: 1000px;
}

.container.list ul {
  padding: 0px;
  margin: 0;
  list-style: none;
  border-top: 10px solid #9e6620;
  box-shadow: 0 0 4px 0 rgb(0 0 0 / 50%);
}

.container.list ul li {
  position: relative;
  background: #ffffff;
  padding: 5px 10px 5px 5px;
  user-select: none;
  border-bottom: 1px solid #c3c3c3;
}

.container.list ul li:hover {
  background: #d4d4d4;
  font-weight: 800;
}

.container.list ul li:first-child {
  padding-top: 10px;
}

.container.list li:before {
  position: absolute;
  right: -30px;
  top: -10px;
  transform: rotate(45deg);
  background: rgb(0 0 0 / 40%);
  padding: 0 10px;
  font-weight: 900;
  z-index: 1;
}

.container.list li:nth-child(1):before {
  content: "1st";
  color: #d2ff00;
  animation: flash 0.6s infinite;
}

.container.list li:nth-child(2):before {
  content: "2nd";
  color: #e7ff7c;
  animation: flash2 0.6s infinite;
}

.container.list li:nth-child(3):before {
  content: "3rd";
  color: #efffaa;
  animation: flash2 0.6s infinite;
}

@keyframes flash {
  0%,
  100% {
    font-size: 30px;
    right: -30px;
  }
  50% {
    font-size: 36px;
    right: -36px;
  }
}

@keyframes flash2 {
  0%,
  100% {
    font-size: 16px;
    right: -28px;
  }
  50% {
    font-size: 22px;
    right: -34px;
  }
}

.container.list .header {
  position: relative;
}

.container.list .info {
  margin-top: 2px;
}

.container.list .version {
  text-align: right;
  position: relative;
}

.container.list .motd {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 80%;
}

.container.list .info {
  overflow: hidden;
  white-space: nowrap;
  max-width: 80%;
  display: flex;
  color: #5a5a5a;
  font-size: 13px;
}

.container.list .status {
  margin-right: 5px;
  position: relative;
  bottom: -2px;
}

.container.list .online {
  margin-right: 5px;
}

.container.list .online:after {
  content: "|";
  margin-left: 5px;
}

.container.list .score {
  position: absolute;
  padding: 2px;
  right: 0px;
  top: 0;
  color: #ffffff;
  font-size: 13px;
  background: rgb(24 24 24 / 70%);
}

.container.card div.badges {
  border-left: 3px solid #34aa2f;
  padding-left: 6px;
  margin: 10px 0;
}

.container.card .plugins:before,
.container.card .players:before {
  position: absolute;
  right: 0;
  background: #383838;
  top: 0;
  padding: 0px 4px;
  border-right: 3px solid #34aa2f;
}

.container.card .players:before {
  content: "玩家列表";
}

.container.card .plugins:before {
  content: "插件列表";
}

.container.card .players {
  position: relative;
  border-left: 3px double #c6c6c6;
  padding-left: 6px;
  margin: 10px 0;
}

.container.card .plugins {
  position: relative;
  border-left: 3px double #c6c6c6;
  padding-left: 6px;
  margin: 10px 0;
}
</style>
