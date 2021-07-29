<template>
  <div class="principal">
    <div class="top">
      <div class="hearder">
        <div class="menu" @click="menu(0)">
          <img src="../assets/home/Menu.png" alt />
        </div>
        <div class="personal" @click="menu(1)">
          <img src="../assets/home/ME.png" alt />
        </div>
        <h1>BoLuo-Weibo</h1>
      </div>
      <div class="nav">
        <h4 v-bind:class="navActive === 0 ? 'navActive' : ''" @click="navActiveFun(0)">主页</h4>
        <h4 v-bind:class="navActive === 1 ? 'navActive' : ''" @click="navActiveFun(1)">广场</h4>
        <h4 v-bind:class="navActive === 2 ? 'navActive' : ''" @click="navActiveFun(2)">消息</h4>
      </div>
    </div>
    <div class="container">
      <div class="null"></div>
      <homePage v-if="navActive === 0"></homePage>
      <message v-if="navActive === 2"></message>
      <square v-if="navActive === 1"></square>
    </div>

    <!-- 顶部菜单弹出对话框 -->
    <van-popup
      v-model="show"
      closeable
      round
      close-icon-position="top-left"
      position="top"
      :style="{ height: toppopup === 1 ? '350px' : '500px' }"
    >
      <div class="h1">
        <h1>BoLuo-Weibo</h1>
      </div>
      <div class="popup-container">
        <div v-if="toppopup === 0" class="popup-left"></div>
        <div v-if="toppopup === 1" class="popup-right">
          <div class="header">
            <div class="avatar" @click="jump(0)">
              <img :src="list.user_avatar" alt />
            </div>
            <div class="text" @click="jump(0)">
              <div class="name">{{ list.user_name }}</div>
              <div class="dec">简介: {{ list.user_desc }}</div>
            </div>
            <div class="edit" @click="jump(5)">修改资料</div>
          </div>
          <div class="data">
            <div @click="jump(0)">
              <h4>{{ list.user_blogs }}</h4>
              <h3>微博</h3>
            </div>
            <div @click="jump(1)">
              <h4>{{ list.user_follows }}</h4>
              <h3>关注</h3>
            </div>
            <div @click="jump(2)">
              <h4>{{ list.user_fans }}</h4>
              <h3>粉丝</h3>
            </div>
          </div>
          <div class="table">
            <div class="item" @click="jump(3)">
              <div class="img">
                <img src="../assets/home/收藏.png" alt />
              </div>
              <h4>我的点赞</h4>
            </div>
            <div class="item" @click="jump(4)">
              <div class="img">
                <img src="../assets/home/对话.png" alt />
              </div>
              <h4>消息中心</h4>
            </div>
            <div class="item">
              <div class="img">
                <img src="../assets/home/历史.png" alt />
              </div>
              <h4>浏览记录</h4>
            </div>
            <div class="item">
              <div class="img">
                <img src="../assets/home/服务.png" alt />
              </div>
              <h4>客服中心</h4>
            </div>
          </div>
          <div class="foot">
            <h4>@hiboluo -- 2021.07.09</h4>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import message from '../component/index/message.vue'
import homePage from '../component/index/homePage.vue'
import square from '../component/index/square.vue'
export default {
  components: {
    message: message,
    homePage: homePage,
    square: square,
  },
  data() {
    return {
      show: false,
      navActive: 0,
      toppopup: 1,
      list: {},
    }
  },
  created() {
    this.userData()
  },
  methods: {
    menu(num) {
      this.show = true
      this.toppopup = num
    },
    navActiveFun(index) {
      this.navActive = index
    },
    async userData() {
      const { data: res } = await this.$http.post('/user/userData', null, {
        params: {
          user_id: this.$store.getters.getUser.user_id,
        },
      })
      this.list = res.data[0]
    },
    jump(index) {
      if (index === 0) {
        this.$router.push('/myblog')
      } else if (index === 1) {
        this.$router.push('/follow')
      } else if (index === 2) {
        this.$router.push('/follow')
      } else if (index === 3) {
        this.$router.push('/love')
      } else if (index === 5) {
        this.$router.push('/editProfile')
      }
    },
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
.principal {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  .top {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: 91px;
    width: 100%;
    z-index: 3;
    .hearder {
      position: relative;
      height: 50px;
      background: #fff;
      text-align: center;
      border-bottom: 1px dashed #e0e0e0;
      h1 {
        color: #303030;
        font-size: 18px;
        line-height: 50px;
      }
      .menu {
        position: absolute;
        top: 15px;
        left: 20px;
        width: 20px;
        height: 20px;
        img {
          width: 20px;
          height: 20px;
        }
      }
      .personal {
        position: absolute;
        top: 15px;
        right: 20px;
        width: 20px;
        height: 20px;
        img {
          width: 20px;
          height: 20px;
        }
      }
    }
    .nav {
      display: flex;
      background: #fff;
      height: 40px;
      h4 {
        font-size: 16px;
        flex: 1;
        text-align: center;
        line-height: 40px;
        color: #303030;
        box-sizing: border-box;
      }
    }
  }

  .container {
    width: 100%;
    height: 100%;
    .null {
      width: 100%;
      height: 96px;
    }
  }

  .van-popup {
    background: #f9f5f6;
    .h1 {
      border-bottom: 1px dashed #e0e0e0;
      h1 {
        text-align: center;
        color: #303030;
        font-size: 18px;
        margin-top: 15px;
        height: 35px;
      }
    }
    .popup-container {
      .popup-right {
        .header {
          display: flex;
          margin-top: 10px;
          .avatar {
            margin-left: 10px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            img {
              width: 60px;
              height: 60px;
              border-radius: 50%;
            }
          }
          .text {
            margin-top: 5px;
            margin-left: 10px;
            .name {
              font-weight: 600;
              font-size: 18px;
              color: #333;
            }
            .dec {
              color: #828282;
              font-size: 14px;
            }
          }
          .edit {
            margin-top: 10px;
            margin-left: auto;
            margin-right: 20px;
            border: 1px dashed #333;
            width: 100px;
            height: 30px;
            text-align: center;
            line-height: 30px;
          }
        }
        .data {
          display: flex;
          margin-top: 20px;
          div {
            flex: 1;
            text-align: center;
            h4 {
              color: #333;
              font-size: 16px;
            }
            h3 {
              color: #828282;
              font-size: 12px;
            }
          }
        }
        .table {
          display: flex;
          border-radius: 10px;
          background: #fff;
          width: 95%;
          margin: 30px auto 0 auto;
          .item {
            margin: 10px 0;
            flex: 1;
            .img {
              text-align: center;
              img {
                width: 30px;
                height: 30px;
              }
            }
            h4 {
              text-align: center;
              font-size: 12px;
            }
          }
        }
        .foot {
          width: 100%;
          position: absolute;
          bottom: 5px;
          h4 {
            width: 100%;
            text-align: center;
            color: #828282;
            font-size: 12px;
          }
        }
      }
    }
  }
}
.navActive {
  color: #0071e3 !important;
  border-bottom: 2px solid #0071e3;
}
@media screen and (max-width: 320px) {
  .van-popup {
    .header {
      .dec {
        font-size: 12px !important;
      }
      .edit {
        margin-right: 5px !important;
      }
    }
  }
}
.sendOutActive {
}
</style>