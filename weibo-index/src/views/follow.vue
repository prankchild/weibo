<template>
  <div class="follow">
    <div class="header">
      <div class="exit" @click="toexit()">
        <i class="iconfont icon-houtui"></i>
      </div>
      <div class="text" @click="toindex()">BoLuo-Weibo</div>
    </div>
    <div class="nav">
      <div class="div fllowNav" :class="navnumber === 0 ? 'navActive' : ''" @click="navitem(0)">我关注的</div>
      <div class="div fansNav" :class="navnumber === 1 ? 'navActive' : ''" @click="navitem(1)">关注我的</div>
    </div>
    <!-- 我关注的 -->
    <div class="followBox" v-if="navnumber === 0">
      <div class="item" v-for="(item, index) in fllowlist" :key="index">
        <div class="avatar">
          <img :src="item.user_avatar" alt />
        </div>
        <div class="text">
          <div class="name">{{ item.user_name }}</div>
          <div class="desc">{{ item.user_desc }}</div>
        </div>
        <div class="button" @click="delfollowBtn(item.user_id)">取消关注</div>
      </div>
    </div>
    <!-- 关注我的 -->
    <div class="followBox" v-if="navnumber === 1">
      <div class="item" v-for="(item, index) in fanslist" :key="index + 1000">
        <div class="avatar">
          <img :src="item.user_avatar" alt />
        </div>
        <div class="text">
          <div class="name">{{ item.user_name }}</div>
          <div class="desc">{{ item.user_desc }}</div>
        </div>
        <div class="button" @click="delfansBtn(item.user_id)">移除粉丝</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navnumber: 0,
      user_id: 300001,
      fllowlist: [],
      fanslist: [],
    }
  },
  created() {
    this.followlist()
  },
  methods: {
    toexit() {
      this.$router.go(-1)
    },
    toindex() {
      this.$router.push('/')
    },
    async followlist() {
      const { data: res } = await this.$http.post('/weibo/followuser', null, {
        params: {
          user_id: this.user_id,
        },
      })
      this.fllowlist = res.followlist
      this.fanslist = res.fanslist
      console.log(this.fllowlist)
    },
    navitem(index) {
      if (index === 0) {
        this.navnumber = 0
      } else {
        this.navnumber = 1
      }
    },
    delfollowBtn(id) {
      this.$dialog
        .alert({
          message: '确定取消关注吗',
          showCancelButton: true,
        })
        .then(() => {
          this.delfollow(id)
          // on confirm
        })
        .catch(() => {
          // on cancel
        })
    },
    async delfollow(id) {
      let { data: res } = await this.$http.post('/weibo/followpeople', null, {
        params: {
          // myid: this.$route.query.user_id,
          // youid: this.user_id,
          state: 1,
          myid: this.$store.getters.getUser.user_id,
          youid: id,
        },
      })
      if (res.status === 200) {
        this.$notify({ type: 'success', message: '已取消关注' })
        this.followlist()
      } else {
        this.$notify({ type: 'success', message: '取消关注失败' })
      }
    },
    delfansBtn(id) {
      this.$dialog
        .alert({
          message: '确定取消关注吗',
          showCancelButton: true,
        })
        .then(() => {
          this.delfans(id)
          // on confirm
        })
        .catch(() => {
          // on cancel
        })
    },
    async delfans(id) {
      let { data: res } = await this.$http.post('/weibo/delfans', null, {
        params: {
          fans_id: id,
          user_id: this.$store.getters.getUser.user_id,
        },
      })
      if (res.status === 200) {
        this.$notify({ type: 'success', message: '已取消关注' })
        this.followlist()
      } else {
        this.$notify({ type: 'success', message: '取消关注失败' })
      }
    },
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
.follow {
  z-index: 2;
  position: relative;
  background: #fff;
  width: 100%;
  height: 100%;
  .header {
    width: 100%;
    height: 50px;
    display: flex;
    text-align: center;
    background: #fff;
    position: relative;
    // line-height: 50px;
    .exit {
      position: absolute;
      top: 5px;
      left: 10px;
      // width: 80px;
      i {
        font-size: 30px;
        float: left;
        // margin-left: 10px;
      }
    }
    .text {
      text-align: center;
      width: 100%;
      line-height: 50px;
      font-size: 18px;
    }
    .iconfont {
      font-family: 'iconfont' !important;
      font-style: normal;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .icon {
      width: 20px;
      height: 20px;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
  }
  .nav {
    margin-top: 5px;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    .div {
      text-align: center;
      flex: 1;
      height: 30px;
    }
  }
  .followBox {
    // width: 100%;
    padding: 10px 0;

    .item {
      padding: 10px 0;
      border-bottom: 1px dashed #696969;
      position: relative;
      display: flex;
      .avatar {
        margin-left: 10px;
        width: 70px;
        height: 70px;
        img {
          width: 70px;
          height: 70px;
          border-radius: 50%;
        }
      }
      .text {
        margin-left: 15px;
        width: 50%;
        .name {
          font-size: 16px;
          margin-top: 10px;
        }
        .desc {
          margin-top: 5px;
          font-size: 12px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
        }
      }
      .button {
        position: absolute;
        right: 10px;
        top: 25px;
        border-radius: 5px;
        width: 100px;
        height: 35px;
        border: 1px dashed #333;
        text-align: center;
        line-height: 35px;
      }
    }
  }
}
.navActive {
  color: orange;
  border-bottom: 2px solid orange;
}
</style>