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
          @click="fetchServerAuths(index)"
        >
          <div class="header">
            <div class="motd">
              <img
                class="status"
                src="https://cdn.jsdelivr.net/gh/pluginskers/ImgBed/c3b14ecc6c3882bdeb5ee4768f13ceadonline.gif"
              />
              <span style="margin-right: 5px">{{ i.motd }}</span>
            </div>
            <div class="info">
              <div class="online">在线: {{ i.online }}/{{ i.max }}</div>
              <div>{{ i.ip }}:{{ i.port }}</div>
            </div>
            <div class="score">{{ i.score.toFixed(2) }}</div>
          </div>
          <div class="version">v{{ i.version }}</div>
          <div class="info">
            <!-- <div class="badge primary gamemode">{{ i.gamemode }}</div> -->
            <div v-if="$parent.done" v-html="drawBadges(index)"></div>
          </div>
          <div class="ranking">{{ index + 1 }}</div>
        </li>
      </ul>
    </div>

    <transition name="fade">
      <div
        name="fade"
        class="model__wapper"
        v-if="info"
        v-show="InfoModelVisible"
        @dblclick="InfoModelVisible = false"
      >
        <div class="model__cover" @click="InfoModelVisible = false"></div>
        <div id="model" class="model">
          <div class="header">
            {{ info.motd
            }}<span
              style="
                position: fixed;
                bottom: 2px;
                right: 2px;
                color: #ffffff;
                font-size: 12px;
              "
            >
              {{ info.delay }}ms</span
            >
          </div>
          <div class="container card">
            <div>{{ info.ip }}:{{ info.port }}</div>
            <div>在线: {{ info.online }}/{{ info.max }}</div>
            <div>位置: {{ info.location }}</div>
            <div class="badges">
              <div class="badge success version" style="margin-right: 0px">
                v{{ info.version }}
              </div>
              <div class="badge warning gamemode">{{ info.gamemode }}</div>
              <div v-if="$parent.done" v-html="drawBadges(index)"></div>
            </div>
            <div class="auths" v-show="InfoAuthsDone">
              <span>{{ info.tip }}</span>
              <div
                class="players"
                v-show="info.players"
                v-html="info.players"
              ></div>
              <div
                class="plugins"
                v-show="info.plugins"
                v-html="info.plugins"
              ></div>
              <div class="report" v-if="info.report">
                <div>
                  服务器最多有<strong>{{ info.report.online }}</strong
                  >位玩家同时在线
                </div>
                <div>
                  服务器延迟最高时有<strong
                    >{{ info.report.delay.toFixed(0) }}ms</strong
                  >
                </div>
                <div>
                  服务器平均延迟有<strong
                    >{{ info.report.avg.toFixed(0) }}ms</strong
                  >
                </div>
              </div>
              <div class="performance" v-if="info.performance">
                <div>
                  TPS:
                  <strong>{{ info.performance.tps }}</strong>
                  (该值越接近20服务器越流畅)
                </div>
                <div>{{ info.performance.tip }}</div>
                <div>
                  <div class="progress__label">
                    负载占用: <strong>{{ info.performance.load }}</strong>
                  </div>
                  <div
                    class="kdui-mc-progress kdui-mc-progress-success kdui-mc-progress-exp"
                  >
                    <div
                      class="kdui-mc-progress-determinate"
                      :style="{ width: info.performance.load }"
                    ></div>
                  </div>
                </div>
              </div>
              <div
                :class="{ records: true, done: charts.el }"
                ref="records"
                :style="RecordsStyle"
              ></div>
            </div>
            <transition name="fade">
              <div class="auths__loading" v-show="!InfoAuthsDone">
                <font-awesome-icon class="loading" icon="sync-alt" /><span
                  >加载中...</span
                >
              </div>
            </transition>
            <a
              class="btn block"
              :href="info.link"
              target="_blank"
              style="margin: 10px 0"
              >加入服务器</a
            >
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "Index",

  props: ["isEmpty"],

  data: () => ({
    InfoModelVisible: false,
    InfoAuthsDone: false,
    info: null,
    list: [],
    index: null,
    filter: [],
    TmpBadges: [],
    EmptyHeight: { height: document.documentElement.clientHeight - 318 + "px" },
    AuthLoader: Object,
    charts: {
      el: null,
      chartsX: [],
      record: {
        online: [],
        delay: [],
      },
    },
    RecordsStyle: null,
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

    fetchServerAuths: function (index) {
      this.InfoModelVisible = true;
      this.info = this.list[index];
      this.index = index;
      this.info.link = `minecraft://?addExternalServer=${this.info.motd}|${this.info.ip}:${this.info.port}`;
      this.info.plugins = "";
      this.info.players = "";

      this.$request({
        params: { d: "auths", id: this.info["id"] },
      }).then((response) => {
        if (response.data && response.data.status === 200) {
          let result = response.data.data;

          // 插件列表
          let TmpPlugins = result["plugins"];

          if (TmpPlugins.length > 0) {
            for (let k in TmpPlugins) {
              this.info.plugins += `<div class="badge green">${TmpPlugins[k]}</div>`;
            }
          }

          // 玩家列表
          let TmpPlayers = result["players"];

          if (TmpPlayers.length > 0) {
            for (let k in TmpPlayers) {
              this.info.players += `<div class="badge success">${TmpPlayers[k]["name"]}</div>`;
            }
          }

          // 服务器负载
          let TmpPerformance = {
            load: result["load"] + "%",
            tps: result["tps"],
            tip:
              result["tps"] >= 20
                ? "服务器运行速度优秀！"
                : "服务器正常运行中！",
          };
          if (TmpPerformance) {
            this.info.performance = TmpPerformance;
          }
        }

        // 统计图渲染
        this.fetchServerRecords();
      });
    },

    /**
     * 抓取服务器检索记录
     * @return void
     */
    fetchServerRecords: function () {
      this.RecordsStyle = {
        height: "300px",
        width: document.getElementById("model").offsetWidth - 41 + "px",
      };

      this.$request({
        params: { d: "records", id: this.info["id"] },
      }).then((response) => {
        if (response.data && response.data.status === 200) {
          let result = response.data.data;

          this.charts.record.online = result.r_online;
          this.charts.record.delay = result.r_delay;

          this.info.report = {
            online: Math.max.apply(null, this.charts.record.online),
            delay: Math.max.apply(null, this.charts.record.delay),
            avg: this.$utils.avg(this.charts.record.delay),
          };

          // 统计图X轴项目
          this.charts.chartsX = [];
          for (let i in this.charts.record.online) {
            this.charts.chartsX[i] = `第${i}次检测`;
          }

          if (this.charts.chartsX) {
            // 统计图
            this.charts.el = echarts.init(this.$refs.records);
            this.charts.el.setOption({
              tooltip: {
                trigger: "axis",
              },

              legend: {
                data: ["在线玩家", "延迟"],
              },

              grid: {
                left: 0,
                right: 0,
                bottom: 0,
                containLabel: true,
              },

              xAxis: {
                type: "category",
                boundaryGap: false,
                data: this.charts.chartsX,
              },

              yAxis: {
                type: "value",
              },

              series: [
                {
                  name: "在线玩家",
                  type: "line",
                  data: this.charts.record.online,
                },
                {
                  name: "延迟",
                  type: "line",
                  data: this.charts.record.delay,
                },
              ],
            });
          }
        }

        this.InfoAuthsDone = true;
      });
    },

    /**
     * 生成标签（缓存标签）
     * @return string
     */
    drawBadges: function (id) {
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
    InfoModelVisible(v) {
      this.msg = null;
      clearTimeout(this.AuthLoader);
      if (!v) {
        setTimeout(() => {
          this.charts.el = null;
          this.InfoAuthsDone = false;
        }, 200);
      }
    },

    InfoAuthsDone(v) {},
  },
};
</script>

<style scoped>
p.empty {
  text-align: center;
}

.container.list {
  margin: 20px auto 0;
  border-radius: 5px 5px 0 0;
  width: 93%;
  max-width: 1000px;
}

.container.list ul {
  padding: 0px;
  margin: 0;
  list-style: none;
  /* border-top: 10px solid #9e6620; */
  box-shadow: 0 0 4px 0 rgb(0 0 0 / 50%);
}

.container.list ul li {
  position: relative;
  background: #ffffff;
  padding: 5px 30px 5px 5px;
  user-select: none;
  border-bottom: 1px solid #c3c3c3;
  transition: all 0s;
}

.container.list ul li:hover {
  background: #eaeaea;
  transform: scale(1.03);
  box-shadow: 0 0 3px 0px #5d5d5d;
  border-bottom: unset;
  padding-bottom: 6px;
  z-index: 1;
}

.container.list ul li:nth-child(odd) {
  background: #e0e0e0;
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
  max-width: 100%;
  display: flex;
  color: #5a5a5a;
  font-size: 13px;
}

.container.list .status {
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

.container div.ranking {
  position: absolute;
  right: 0;
  top: 0;
  width: 20px;
  height: 100%;
  color: #fff;
  background: #9e6620;
  text-align: center;
  overflow: hidden;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
}

.container.card div.badges {
  border-left: 3px solid #34aa2f;
  padding-left: 6px;
  margin: 10px 0;
}

.auths > div:before {
  position: absolute;
  left: -3px;
  background: #383838;
  top: -30px;
  padding: 0px 4px;
  border-left: 3px solid #34aa2f;
}

.auths > div {
  position: relative;
  border-left: 3px solid #34aa2f;
  padding-left: 6px;
  top: 25px;
  margin: 10px 0 35px 0;
}

.auths > div.records {
  border-left: unset;
  padding-left: 0;
}

.auths > div.records:before {
  left: 0px;
}

.auths > .players:before {
  content: "玩家列表";
}

.auths > .plugins:before {
  content: "插件列表";
}

.auths > .records:before {
  content: "服务器统计";
}

.auths > .performance:before {
  content: "服务器负载";
}

.auths > .report:before {
  content: "近七日分析";
}

.records:not(.done):after {
  content: "图表加载中";
  text-align: center;
  line-height: 300px;
  height: 300px;
  position: absolute;
  background: #484848;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.auths__loading {
  position: absolute;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  background: #383838;
  z-index: 2;
}

.loading {
  margin-right: 5px;
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
