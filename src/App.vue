<template>
  <div>
    <div class="background"></div>
    <transition v-if="guide" name="fade">
      <div class="guide" v-show="guide" @click="firstView">
        <p class="guide__title">MOTD Platform</p>
        <p class="guide__subtitle">Thank you for visiting.</p>
      </div>
    </transition>
    <component-loading v-if="!done"></component-loading>
    <div v-if="!$utils.isEmpty(TmpPlatformData)">
      <component-alert v-show="done" ref="alert"></component-alert>
      <router-view ref="app" :isEmpty="isEmpty" />
      <component-fab v-show="done"></component-fab>
      <component-footer v-if="done"></component-footer>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/Loading";
import Alert from "@/components/Alert";
import Fab from "@/components/Fab";
import Footer from "@/components/Footer";

export default {
  name: "App",

  components: {
    ComponentLoading: Loading,
    ComponentAlert: Alert,
    ComponentFab: Fab,
    ComponentFooter: Footer,
  },

  data: () => ({
    done: false,
    guide: true,
    TmpData: {
      tips: JSON.parse(localStorage.getItem("_Tips") || "[]"),
      badges: JSON.parse(localStorage.getItem("_Badges") || "[]"),
      list: [],
    },
    isEmpty: false,
    TmpPlatformData: [],
  }),

  created() {
    if (this.$route.path == "/terms") {
      this.done = true;
    } else {
      window.onload = () => {
        this.$request({
          params: { d: "platform" },
        }).then((response) => {
          if (response.data) {
            this.TmpPlatformData = response.data.data;
            if (this.TmpData["tips"]) this.updateTips();

            if (this.TmpData["badges"]) this.updateBadges();

            if (!this.guide) this.updateList();
          }
        });
      };
    }
  },

  mounted() {
    this.guide = localStorage.getItem("auth") ? false : true;

    document.onkeydown = function () {
      if (
        window.event.keyCode == 116 || //屏蔽 F5
        window.event.keyCode == 122 || //屏蔽 F11
        (window.event.shiftKey && window.event.keyCode == 121) //shift+F10
      ) {
        window.event.keyCode = 0;
        window.event.returnValue = false;
      }
      if (window.event.altKey && window.event.keyCode == 115) {
        //屏蔽Alt+F4
        window.showModelessDialog(
          "about:blank",
          "",
          "dialogWidth:1px;dialogheight:1px"
        );
        return false;
      }
    };
    if (window.Event) document.captureEvents(Event.MOUSEUP);
    function nocontextmenu() {
      event.cancelBubble = true;
      event.returnValue = false;
      return false;
    }
    function norightclick(e) {
      if (window.Event) {
        if (e.which == 2 || e.which == 3) return false;
      } else if (event.button == 2 || event.button == 3) {
        event.cancelBubble = true;
        event.returnValue = false;
        return false;
      }
    }
    document.oncontextmenu = nocontextmenu; // for IE5+
    document.onmousedown = norightclick; // for all others
  },

  methods: {
    firstView: function () {
      this.guide = false;
      localStorage.setItem("auth", new Date().getTime());
    },

    updateList: function () {
      this.done = false;
      this.$request({
        params: { d: "list" },
      }).then((response) => {
        if (response.data && response.data.status === 200) {
          this.isEmpty = false;
          let result = response.data.data;
          for (let i in result) {
            result[i].badges = result[i].badges || "[]";
          }
          this.TmpData["list"] = result;
          this.$refs.app.refresh();
        } else {
          this.isEmpty = true;
          this.done = true;
        }
      });
    },

    updateTips: function () {
      this.$request({
        params: { d: "tips" },
      }).then((response) => {
        if (response.data && response.data.status === 200) {
          this.TmpData["tips"] = response.data.data;

          localStorage.setItem("_Tips", JSON.stringify(response.data.data));
        }
      });
    },

    updateBadges: function () {
      this.$request({
        params: { d: "badges" },
      }).then((response) => {
        if (response.data && response.data.status === 200) {
          this.TmpData["badges"] = response.data.data;

          localStorage.setItem("_Badges", JSON.stringify(response.data.data));
          this.$refs.app.TmpBadges = [];

          if (this.guide) this.updateList();
        }
      });
    },
  },
};
</script>

<style>
@font-face {
  font-family: "Zpix";
  src: url("https://cdn.jsdelivr.net/gh/pluginskers/ImgBed/c3b14ecc6c3882bdeb5ee4768f13ceadzpix.woff")
    format("woff");
}

* {
  font-family: "Zpix";
  transition: background 0.2s;
}

html,
body {
  margin: unset;
  padding: unset;
  overflow-x: hidden;
  height: 100%;
}

::-webkit-scrollbar {
  width: 2px;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
}

::-webkit-scrollbar-thumb:window-inactive {
  background: rgba(255, 0, 0, 0.7);
}

a {
  text-decoration: none;
  color: #d0b1b1;
}

a:hover {
  color: #34aa2f;
}

strong {
  color: rgb(52, 170, 47);
  margin: auto 5px;
}

.background {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: url("https://cdn.jsdelivr.net/gh/pluginskers/ImgBed/ImgBedtp_out.gif");
  background-color: #848484;
  background-blend-mode: overlay;
  z-index: -1;
}

.guide {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  color: #fff;
  text-shadow: -3px 3px 3px #383838;
  overflow: hidden;
  background: url("https://cdn.jsdelivr.net/gh/pluginskers/ImgBed/ImgBedtp_out.gif");
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  cursor: default;
  z-index: 2;
}

.guide > p.guide__title {
  position: relative;
  font-size: 10vw;
  top: -50px;
}

.guide > p.guide__subtitle {
  font-size: 2vw;
  text-align: right;
  position: absolute;
  bottom: 20%;
}

/* Motd UI */
/* btn */
.btn {
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  position: relative;
  border: 0;
  user-select: none;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  white-space: unset;
  padding: 1rem 3.05rem;
  text-decoration: none;
  font-weight: 700;
  border-radius: 0;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out,
    -webkit-box-shadow 0.15s ease-in-out;
  background-color: #34aa2f;
  border-color: #34aa2f;
  color: #fff !important;
  font-size: 13px;
  text-shadow: 0 2px 0 rgb(0 0 0 / 25%);
  cursor: default;
  z-index: 1;
}

.btn[disabled] {
  background: #313131;
  user-select: none;
  pointer-events: none;
}

.btn.block {
  width: 100%;
}

a.btn {
  padding: 0.7rem 0;
}

.btn::before {
  position: absolute;
  pointer-events: none;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
  content: "";
  transition: 0.7s cubic-bezier(0, 0.8, 0.26, 0.99);
  box-shadow: 0 -4px rgb(0 0 0 / 30%) inset, 0 4px rgb(255 255 255 / 50%) inset,
    -4px 0 rgb(255 255 255 / 50%) inset, 4px 0 rgb(0 0 0 / 30%) inset;
}

.btn:hover::before {
  box-shadow: 0 -4px rgb(0 0 0 / 50%) inset, 0 4px rgb(255 255 255 / 20%) inset,
    -4px 0 rgb(255 255 255 / 20%) inset, 4px 0 rgb(0 0 0 / 50%) inset;
}

.btn::after {
  position: absolute;
  pointer-events: none;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
  content: "";
  transition: 0.7s cubic-bezier(0, 0.8, 0.26, 0.99);
}

.btn:hover {
  text-decoration: none;
  background-color: #313131;
}

.btn:focus {
  outline: unset;
}

/* input */

input:not([type="checkbox"]) {
  width: -webkit-fill-available;
}

input {
  font-size: 14px;
  padding: 8px;
  border: 0;
  transition: none;
  font-weight: 400;
  line-height: 1.5;
  color: #d9ff34 !important;
  margin-bottom: 12px;
  background: #6b6b6b;
  vertical-align: -webkit-baseline-middle;
  border-left: 6px solid #34aa2f;
}

input:focus {
  position: relative;
  background-color: #000;
  outline: 0;
  box-shadow: 0 0 3px 1px #397ad1, inset 0 0 2px 1px #397ad1;
  z-index: 3;
}

label {
  line-height: 2em;
  user-select: none;
}

/* model */

.model {
  position: absolute;
  width: 85%;
  max-width: 600px;
  max-height: 85%;
  background: url("https://cdn.jsdelivr.net/gh/pluginskers/ImgBed/ImgBedbg-wool-dark.png");
  padding: 15px 10px;
  border-radius: 5px;
  border: 10px solid rgb(85, 85, 85);
  border-image-width: 10px;
  border-image-repeat: repeat;
  border-image-slice: 40;
  border-image-source: url("https://cdn.jsdelivr.net/gh/pluginskers/ImgBed/ImgBedpanel.png");
  overflow-x: hidden;
  overflow-y: overlay;
  top: 10px;
  z-index: 3;
}

.model__wapper,
.model__cover {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.model__wapper {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  z-index: 2;
}

.model__cover {
  /* filter: blur(4px);
  background: url("https://cdn.jsdelivr.net/gh/pluginskers/ImgBed/ImgBeddesign2.png") no-repeat;
  background-position-y: bottom;
  background-position-x: right;
  background-blend-mode: hard-light; */
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.model__float {
  position: fixed;
  bottom: 25px;
  left: 25px;
  right: 25px;
  color: #d9ff34;
  font-weight: 800;
  line-height: 20px;
  letter-spacing: 3px;
  text-align: left;
  z-index: 3;
}

.model__float > .header {
  position: relative;
  width: 100%;
  margin-bottom: 10px;
}

.model__float > .header:after {
  content: "";
  position: absolute;
  left: 0;
  height: 1px;
  bottom: -3px;
  width: 100%;
  background: #d9ff34;
}

.model__msg {
  position: absolute;
  top: 5px;
  right: 0px;
  color: #d9ff34;
  font-size: 13px;
  animation: flash 0.4s infinite;
}

@keyframes flash {
  0%,
  100% {
    font-size: 13px;
  }
  50% {
    font-size: 14px;
  }
}

.model > div:not(:last-child, .badge) {
  margin-bottom: 24px;
}

.model div.badge {
  margin-bottom: 3px;
}

.model div.header {
  text-align: center;
  font-size: 28px;
}

.model .container {
  line-height: 25px;
}

/* hr */
div.divider {
  background: #9e9e9e;
  height: 1px;
  padding: unset;
  width: 100%;
}

/* badge */
.badge {
  display: inline-block;
  height: 18px;
  padding: 0 6px;
  margin-right: 6px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  line-height: 18px;
  white-space: nowrap;
  border: 1px solid #fff;
  border-radius: 4px;
  background-color: #ff4949;
  cursor: default;
}

.badge.border {
  position: relative;
  border-radius: 2px;
  background: #484848;
}

.badge.border::before,
.badge.border:after {
  content: "";
  position: absolute;
  top: 1px;
  height: 14px;
  width: 3px;
  border-top: 1px solid #fff;
  border-bottom: 1px solid #fff;
  background: #484848;
}

.badge.border:before {
  left: -3px;
  border-radius: 2px 0 0 2px;
  border-left: 1px solid #fff;
}

.badge.border:after {
  right: -3px;
  border-radius: 0 2px 2px 0;
  border-right: 1px solid #fff;
}

.badge.primary {
  background-color: #34aa2f;
}

.badge.success {
  background-color: #ffc82c;
}

.badge.warning {
  background-color: #ff4949;
}

.badge.danger {
  background-color: #8e8e8e;
}

.badge.info {
  background-color: #78a4fa;
}

.badge.deep-purple {
  background-color: #673ab7;
}

.badge.red {
  background-color: #f44336;
}

.badge.pink {
  background-color: #e91e63;
}

.badge.purple {
  background-color: #9c27b0;
}

.badge.indigo {
  background-color: #3f51b5;
}

.badge.blue {
  background-color: #2196f3;
}

.badge.light-blue {
  background-color: #03a9f4;
}

.badge.cyan {
  background-color: #00bcd4;
}

.badge.teal {
  background-color: #009688;
}

.badge.green {
  background-color: #4caf50;
}

.badge.light-green {
  background-color: #8bc34a;
}

.badge.lime {
  background-color: #cddc39;
}

.badge.yellow {
  background-color: #ffeb3b;
}

.badge.amber {
  background-color: #ffc107;
}

.badge.orange {
  background-color: #ff9800;
}

.badge.deep-orange {
  background-color: #ff5722;
}

.badge.brown {
  background-color: #795548;
}

.badge.grey {
  background-color: #9e9e9e;
}

.badge.blue-grey {
  background-color: #607d8b;
}

/* progress */
.progress__label {
  position: relative;
  height: 10px;
  z-index: 1;
  top: 6px;
  width: 100%;
  text-align: center;
  opacity: 0.4;
}

.kdui-mc-progress {
  width: 100%;
  height: 14px;
  padding: 0 4px;
  max-width: 100% !important;
  background-size: contain;
  background-position: left, center, right;
  background-repeat: no-repeat, repeat-x, no-repeat;
  background-clip: border-box, content-box, border-box;
  background-image: url("https://cdn.jsdelivr.net/gh/pluginskers/ImgBed/c3b14ecc6c3882bdeb5ee4768f13cead20210315170916.png"),
    url("https://cdn.jsdelivr.net/gh/pluginskers/ImgBed/c3b14ecc6c3882bdeb5ee4768f13cead20210315170933.png"),
    url("https://cdn.jsdelivr.net/gh/pluginskers/ImgBed/c3b14ecc6c3882bdeb5ee4768f13cead20210315170943.png");
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
}

.kdui-mc-progress-determinate {
  padding: 0 4px;
  top: 0;
  left: 0;
  bottom: 0;
  position: absolute;
  box-sizing: border-box;
  max-width: 100% !important;
  background-size: contain;
  background-position: left, center, right;
  background-repeat: no-repeat, repeat-x, no-repeat;
  background-clip: border-box, content-box, border-box;
  background-image: url("https://cdn.jsdelivr.net/gh/pluginskers/ImgBed/c3b14ecc6c3882bdeb5ee4768f13cead20210315171004.png"),
    url("https://cdn.jsdelivr.net/gh/pluginskers/ImgBed/c3b14ecc6c3882bdeb5ee4768f13cead20210315171014.png"),
    url("https://cdn.jsdelivr.net/gh/pluginskers/ImgBed/c3b14ecc6c3882bdeb5ee4768f13cead20210315171029.png");
}

.kdui-mc-progress {
  margin: 8px 0;
}

.kdui-mc-progress-success {
  background-image: url("https://cdn.jsdelivr.net/gh/pluginskers/ImgBed/c3b14ecc6c3882bdeb5ee4768f13cead20210313204628.png"),
    url("https://cdn.jsdelivr.net/gh/pluginskers/ImgBed/c3b14ecc6c3882bdeb5ee4768f13cead20210313204424.png"),
    url("https://cdn.jsdelivr.net/gh/pluginskers/ImgBed/c3b14ecc6c3882bdeb5ee4768f13cead20210313204601.png");
}

.kdui-mc-progress {
  width: 100%;
  height: 14px;
  padding: 0 4px;
  max-width: 100% !important;
  background-size: contain;
  background-position: left, center, right;
  background-repeat: no-repeat, repeat-x, no-repeat;
  background-clip: border-box, content-box, border-box;
  background-image: url("https://cdn.jsdelivr.net/gh/pluginskers/ImgBed/c3b14ecc6c3882bdeb5ee4768f13cead20210313204714.png"),
    url("https://cdn.jsdelivr.net/gh/pluginskers/ImgBed/c3b14ecc6c3882bdeb5ee4768f13cead20210313204840.png"),
    url("https://cdn.jsdelivr.net/gh/pluginskers/ImgBed/c3b14ecc6c3882bdeb5ee4768f13cead20210313204751.png");
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
}

.kdui-mc-progress-success .kdui-mc-progress-determinate {
  background-image: url("https://cdn.jsdelivr.net/gh/pluginskers/ImgBed/c3b14ecc6c3882bdeb5ee4768f13cead20210313205000.png"),
    url("https://cdn.jsdelivr.net/gh/pluginskers/ImgBed/c3b14ecc6c3882bdeb5ee4768f13cead20210313205117.png"),
    url("https://cdn.jsdelivr.net/gh/pluginskers/ImgBed/c3b14ecc6c3882bdeb5ee4768f13cead20210313205130.png");
}

.kdui-mc-progress-determinate {
  padding: 0 4px;
  top: 0;
  left: 0;
  bottom: 0;
  position: absolute;
  box-sizing: border-box;
  max-width: 100% !important;
  background-size: contain;
  background-position: left, center, right;
  background-repeat: no-repeat, repeat-x, no-repeat;
  background-clip: border-box, content-box, border-box;
  background-image: url("https://cdn.jsdelivr.net/gh/pluginskers/ImgBed/c3b14ecc6c3882bdeb5ee4768f13cead20210313205142.png"),
    url("https://cdn.jsdelivr.net/gh/pluginskers/ImgBed/c3b14ecc6c3882bdeb5ee4768f13cead20210313205158.png"),
    url("https://cdn.jsdelivr.net/gh/pluginskers/ImgBed/c3b14ecc6c3882bdeb5ee4768f13cead20210313205206.png");
}

.kdui-mc-progress-exp::after {
  content: "";
  display: block;
  top: 0;
  bottom: 0;
  left: 2px;
  right: 2px;
  z-index: 99999;
  position: absolute;
  box-sizing: border-box;
  background-size: percentage;
  background-clip: content-box;
  background-image: url("https://cdn.jsdelivr.net/gh/pluginskers/ImgBed/c3b14ecc6c3882bdeb5ee4768f13cead20210313205218.png");
}

/* transition */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
