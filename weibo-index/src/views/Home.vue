<template>
  <div class="Home">
    <div class="top">
      <div class="header">
        <div class="container">
          <div class="avatar">
            <img src="../assets/avatar.jpg" alt="" />
          </div>
          <div class="username">
            {{ username }}
          </div>
          <div class="refresh">
            <img src="../assets/F5.png" alt="" />
          </div>
        </div>
      </div>
      <div class="navigation">
        <span
          @click="switchPage(0)"
          v-bind:class="choice === 0 ? 'spanActive' : ''"
          >主页</span
        >
        <span
          @click="switchPage(1)"
          v-bind:class="choice === 1 ? 'spanActive' : ''"
          >广场</span
        >
        <span
          @click="switchPage(2)"
          v-bind:class="choice === 2 ? 'spanActive' : ''"
          >消息</span
        >
      </div>
    </div>

    <div class="main" v-if="choice === 0">
      <div class="weiboBox" v-for="(item, index) in 15" :key="index">
        <div class="weibo-header">
          <div class="avatar">
            <img src="../assets/avatar.jpg" alt="" />
          </div>
          <div class="text">
            <div class="name">
              {{ username }}
            </div>
            <div class="app">微博 hiboluo.top</div>
          </div>
          <div class="time">15分钟前</div>
        </div>
        <div class="weibo-container" @click="weibo()">
          <div class="text">
            我是差不多先生，我的差不多是天生，但我不天真。
            我是差不多先生，我的差不多是天生，但我不天真。
            我是差不多先生，我的差不多是天生，但我不天真。
          </div>
        </div>
        <div class="weibo-foot">
          <div class="foot">
            <i class="iconfont icon-zhuanfa-"></i>
            {{ forword }}
          </div>
          <div>
            <i class="iconfont icon-pinglun"></i>
            {{ comment }}
          </div>
          <div>
            <i class="iconfont icon-dianzan"></i>
            {{ love }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="choice === 1"></div>
    <div v-if="choice === 2"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "HiBoluo",
      choice: 0,
      love: 10,
      comment: 100,
      forword: 211,
    };
  },
  methods: {
    switchPage(index) {
      this.choice = index;
    },
  },
};
</script>

<style lang="less" scoped>
.Home {
  z-index: 1;
  position: relative;
  width: 100%;
  height: 100%;
  background: #f4f5f5;
  .top {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }
  .header {
    width: 100%;
    height: 60px;
    background: #fff;
    border-bottom: 1px solid #e0e0e0;
    .container {
      display: flex;
      width: 100%;
      height: 60px;
      box-sizing: border-box;
      padding: 0 15px;
      .avatar {
        margin-top: 8px;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: 1px solid #e0e0e0;
        img {
          width: 44px;
          height: 44px;
          border-radius: 50%;
        }
      }
      .username {
        padding-left: 10px;
        line-height: 60px;
        font-weight: 700;
      }
      .refresh {
        padding-top: 15px;
        margin-left: auto;
        width: 30px;
        height: 30px;
        img {
          width: 30px;
          height: 30px;
        }
      }
    }
  }
  .navigation {
    display: flex;
    height: 40px;
    width: 100%;
    background: #f4f5f5;
    border-bottom: 1px solid #e2e3e3;
    span {
      display: block;
      color: #616161;
      font-size: 14px;
      font-weight: 600;
      line-height: 40px;
      text-align: center;
      flex: 1;
      box-sizing: border-box;
    }
    .spanActive {
      color: #0075ff;
      border-bottom: 3px solid #0075ff;
    }
  }
  .main {
    margin-top: 102px;
    width: 100%;
    .weiboBox {
      margin: 10px 0;
      width: 100%;
      box-shadow: 0 5px 5px rgba(0, 0, 0, 0.05);
      //   box-sizing: border-box;
      background: #fff;
      .weibo-header {
        display: flex;
        height: 60px;
        overflow: hidden;
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-top: 10px;
          margin-left: 10px;
          border: 1px solid #e0e0e0;
          img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
        }
        .text {
          margin-top: 10px;
          margin-left: 10px;
          .name {
            font-weight: 700;
          }
          .app {
            color: #b9bdc0;
            font-size: 13px;
            font-weight: 600;
          }
        }
        .time {
          margin-left: auto;
          margin-right: 10px;
          color: #b9bdc0;
          font-size: 13px;
          font-weight: 500;
          margin-top: 20px;
        }
      }
      .weibo-container {
        .text {
          font-size: 14px;
          padding: 10px;
          color: #434343;
        }
      }
      .weibo-foot {
        display: flex;
        height: 40px;
        text-align: center;
        // background: #789;
        // overflow: hidden;
        // line-height: 40px;
        div {
          flex: 1;
          color: #cdcdcd;
          line-height: 40px;

          i {
            font-size: 18px;
          }
        }
      }
    }
  }
  i {
    font-family: "iconfont" !important;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
</style>