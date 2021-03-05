<template>
  <div id="footer">
    <div class="footer__cover"></div>
    <div class="footer__container">
      <p>友情链接：</p>
      <ul
        class="friendLinks"
        v-for="(r, index) in this.friends"
        :key="(r, index)"
      >
        <li>
          <a :href="r.link" target="_blank">{{ r.name }}</a>
        </li>
      </ul>
      <p class="copyright">© 2021 Motd Platform All rights reservd.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Footer",

  data: () => ({
    friends: [],
  }),

  mounted() {
    this.friends = this.$parent.TmpPlatformData["friends"];
  },
};
</script>

<style scoped>
#footer {
  position: relative;
  margin-top: -1px;
  height: 120px;
  background: url(."https://cdn.jsdelivr.net/gh/pluginskers/ImgBed/ImgBedbg-wool-dark.png");
  color: #fff;
  box-shadow: 0 0 5px 0 #000;
  padding: 10px 0;
  z-index: 0;
}

.footer__cover {
  position: absolute;
  background: url("https://cdn.jsdelivr.net/gh/pluginskers/ImgBed/bookshelf.gif");
  bottom: 0;
  height: 28px;
  width: 100%;
  pointer-events: none;
  opacity: 0.2;
}

.footer__container {
  margin: 0 auto;
  width: 90%;
  max-width: 1000px;
}

ul.friendLinks {
  list-style: none;
  padding: unset;
  display: inline-flex;
  font-size: 14px;
}

p.copyright {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  text-align: center;
  font-size: 13px;
}

ul.friendLinks li {
  margin-right: 15px;
}
</style>
