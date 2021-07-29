<template>
  <div id="app">
    <vue-particles
      color="#565e61"
      :particleOpacity="0.7"
      :particlesNumber="80"
      shapeType="circle"
      :particleSize="4"
      linesColor="#565e61"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    ></vue-particles>
    <router-view />
  </div>
</template>

<style>
#particles-js {
  width: 100%;
  height: calc(100% - 100px);
  position: absolute;
  z-index: 0;
  /* background: #f4f5f5; */
}
html {
  width: 100%;
  height: 100%;
}
body {
  min-width: 320px;
  color: #000;
  overflow-x: hidden;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-text-size-adjust: none;
  -moz-user-select: none;
  max-width: 540px;
  margin: 0 auto;
  height: 100%;
  /* background: #f4f4f4; */
  font: normal 16px/1.5 PingFangSC-regular, Tahoma, Lucida Grande, Verdana,
    Microsoft Yahei, STXihei, hei;
  /* 移动端流浪器默认的外观在IOS上加上属性才给按钮和输入框自定义样式 */
}
input {
  -webkit-appearance: none;
}
img,
a {
  -webkit-touch-callout: none;
  color: #000;
}
#app {
  width: 100%;
  height: 100%;
  background-color: #fefefe;
}

@font-face {
  font-family: 'iconfont';
  src: url('/src/assets/icon/iconfont.eot'); /* IE9*/
  src: url('/src/assets/icon/iconfont.eot#iefix') format('embedded-opentype'),
    /* IE6-IE8 */ url('/src/assets/icon/iconfont.woff') format('woff'),
    /* chrome, firefox */ url('/src/assets/icon/iconfont.woff2') format('woff2'),
    /* chrome, firefox */ url('/src/assets/icon/iconfont.ttf')
      format('truetype'),
    /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
      url('/src/assets/icon/iconfont.svg#iconfont') format('svg'); /* iOS 4.1- */
}
.iconfont {
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
h1,
h3,
h4,
h5 {
  margin: 0;
  padding: 0;
  font-weight: 500;
}
</style>


<script>
export default {
  created() {
    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem('store')) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem('store'))
        )
      )
    }

    //在页面刷新时将vuex里的信息保存到sessionStorage里
    // window.addEventListener('beforeunload', () => {
    //   sessionStorage.setItem('store', JSON.stringify(this.$store.state))
    // })
  },
}
</script>