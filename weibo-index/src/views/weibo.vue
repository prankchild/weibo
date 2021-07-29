<template>
  <div class="weibo">
    <div class="header">
      <div class="exit" @click="toexit()">
        <i class="iconfont icon-houtui"></i>
      </div>
      <div class="text" @click="toindex()">BoLuo-Weibo</div>
    </div>
    <div class="talkBox">
      <div class="talk-top">
        <div class="avatar">
          <img :src="weibo.user_avatar" alt />
        </div>
        <div class="user" @click="jumpuser(weibo.weibo_userid)">
          <div class="username">{{ weibo.user_name }}</div>
          <div class="time" v-if="weibo.weibo_time ">{{ weibo.weibo_time | formatDate }}</div>
        </div>
      </div>
      <router-link :to="{ path: '/weibo', query: { weibo_id: weibo.weibo_id } }">
        <div class="talk-main">
          <div class="talktext">{{ weibo.weibo_container }}</div>
          <!-- 转发情况 -->
          <div v-if="weibo.weibo_ofwid" class="trueForword">
            <div class="text" v-if="weibo.ofw">
              <a href>@{{ weibo.ofw.user_name }}：</a>
              <span>{{ weibo.ofw.weibo_container }}</span>
              <div class="showImage">
                <div class="imageBox">
                  <div
                    class="img"
                    @click="showImage(subindex,weibo.ofw)"
                    v-for="(subitem, subindex) in JSON.parse(weibo.ofw.weibo_image)"
                    :key="subindex"
                  >
                    <img :src="subitem" alt />
                  </div>
                </div>
              </div>
            </div>
            <div class="forwordnull" v-if="!weibo.ofw">该微博已被删除！</div>
          </div>
          <div class="showImage" v-if="weibo.weibo_image">
            <div class="imageBox">
              <div
                class="img"
                @click="showImage(subindex,weibo)"
                v-for="(subitem, subindex) in JSON.parse(weibo.weibo_image)"
                :key="subindex"
              >
                <img :src="subitem" alt />
              </div>
            </div>
          </div>
        </div>
      </router-link>
    </div>
    <div class="nav">
      <div
        class="item"
        :class="navActive === 0 ? 'itemActive' : ''"
        @click="itemBtn(0)"
      >转发 {{ weibo.weibo_forwords }}</div>
      <div
        class="item"
        :class="navActive === 1 ? 'itemActive' : ''"
        @click="itemBtn(1)"
      >评论 {{ weibo.weibo_comments }}</div>
      <div
        class="item"
        :class="navActive === 2 ? 'itemActive' : ''"
        @click="itemBtn(2)"
      >点赞 {{ weibo.weibo_loves }}</div>
    </div>
    <div class="navItem">
      <div class="love forword" v-if="navActive === 0">
        <div class="forworditem" v-for="(item, index) in forword" :key="index">
          <div class="img">
            <img :src="item.user_avatar" alt />
          </div>
          <div class="text">
            <div class="name">{{ item.user_name }}</div>
            <div class="container">{{ item.weibo_container }}</div>
            <div class="time">{{ item.weibo_time | formatDate }}</div>
          </div>
        </div>
      </div>
      <div class="love forword comments" v-if="navActive === 1">
        <div class="forworditem" v-for="(item, index) in comments" :key="index">
          <div class="img">
            <img :src="item.user_avatar" alt />
          </div>
          <div class="text">
            <div class="name">{{ item.user_name }}</div>
            <div class="container">{{ item.comment_container }}</div>
            <div class="time">{{ item.commnet_time | formatDate }}</div>
          </div>
        </div>
      </div>
      <div class="love" v-if="navActive === 2">
        <div class="loveitem" v-for="(item, index) in love" :key="index">
          <div class="img">
            <img :src="item.user_avatar" alt />
          </div>
          <div class="name">{{ item.user_name }}</div>
        </div>
      </div>
    </div>
    <div class="foot">
      <span @click="forwords()">
        <i></i> 转发
      </span>
      <span @click="actionComPopup()">
        <i></i> 评论
      </span>
      <span :class="weibo.islove === '1' ? 'loveactive' : 'lovedef'">
        <i></i>
        <div v-if="weibo.islove === '1'" @click="loveBtn(1, weibo.weibo_id)">已赞</div>
        <div v-if="weibo.islove !== '1'" @click="loveBtn('', weibo.weibo_id)">点赞</div>
      </span>
    </div>
    <!-- 评论弹出层 -->
    <van-popup
      class="commentPopup"
      round
      v-model="commnetPopupShow"
      closeable
      close-icon-position="top-left"
      :style="{ height: '30%' ,width:'90%' }"
    >
      <div class="title">评论</div>
      <van-field
        v-model="commnet_container"
        rows="12"
        type="textarea"
        maxlength="140"
        placeholder="写评论"
        show-word-limit
      />
      <div class="button">
        <van-button color="linear-gradient(#f79002, #f8ba39)" @click="comSubmit">提交</van-button>
      </div>
    </van-popup>
    <!-- 转发弹出层 -->
    <van-popup
      round
      class="forwordpopup"
      v-model="forwordshow"
      closeable
      close-icon-position="top-left"
      :style="{ height: '70%' ,width:'90%' }"
    >
      <div class="title">转发微博</div>
      <van-field
        v-model="forword_container"
        rows="12"
        type="textarea"
        maxlength="140"
        placeholder="转发微博"
        show-word-limit
      />
      <div class="list">
        <div class="img">
          <img :src="forworddata.avatar" alt />
        </div>
        <div class="text">
          <h1>@{{forworddata.name}}</h1>
          <span>{{forworddata.container}}</span>
        </div>
      </div>
      <div class="button">
        <van-button color="linear-gradient(#f79002, #f8ba39)" @click="forwordSumbit()">发送</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { ImagePreview } from 'vant'
export default {
  data() {
    return {
      weibo_id: '',
      weibo: [],
      navActive: 0,
      love: [],
      image: [],
      forword: [],
      commnetPopupShow: false,
      commnet_container: '',
      comments: {},
      forwordshow: false,
      forworddata: {},
      forword_container: '',
    }
  },
  created() {
    var weibo_id = this.$route.query.weibo_id
    this.weibo_id = weibo_id
    this.weibodata()
    this.wiebolove()
    this.commnetsdata()
  },
  methods: {
    async loveBtn(index, weibo_id) {
      // 当index不存在的时候进行添加数据
      if (!index) {
        const { data: res } = await this.$http.post('/weibo/addlove', null, {
          params: {
            weibo_id: weibo_id,
            user_id: this.$store.getters.getUser.user_id,
          },
        })
        console.log(res)
        if (res.status === '200') {
          this.$notify({ type: 'success', message: '点赞成功！' })
          this.weibodata()
          this.wiebolove()
          this.commnetsdata()
        } else if (res.status === '208') {
        }
      } else if (index) {
        const { data: res } = await this.$http.post('/weibo/dellove', null, {
          params: {
            weibo_id: weibo_id,
            user_id: this.$store.getters.getUser.user_id,
          },
        })
        console.log(res)
        if (res.status === '200') {
          this.$notify({ type: 'success', message: '取消点赞成功！' })
          this.weibodata()
          this.wiebolove()
          this.commnetsdata()
        }
      }
    },
    forwords() {
      this.forwordshow = true
      this.forworddata.container = this.weibo.weibo_container
      this.forworddata.name = this.weibo.user_name
      this.forworddata.avatar = this.weibo.user_avatar
      this.forworddata.ofw = this.weibo.ofw
      this.forworddata.ofwid = this.weibo.weibo_ofwid
      this.forworddata.weiboid = this.weibo.weibo_id
      if (this.forworddata.ofwid) {
        this.forword_container =
          '//@' + this.forworddata.name + ':' + this.forworddata.container
        this.forworddata.weiboid = this.weibo.ofw.weibo_id
      } else {
        this.forword_container = ''
      }
    },
    async forwordSumbit() {
      const { data: res } = await this.$http.post('/weibo/forword', null, {
        params: {
          weibo_id: this.forworddata.weiboid,
          user_id: this.$store.getters.getUser.user_id,
          weibo_container: this.forword_container,
        },
      })
      if (res.status === 200) {
        this.forwordshow = false
        this.$notify({ type: 'success', message: '转发成功！' })
      }
    },
    toexit() {
      this.$router.go(-1)
    },
    toindex() {
      this.$router.push('/')
    },
    async weibodata() {
      const { data: res } = await this.$http.post('/weibo/weibolist', null, {
        params: {
          user_id: this.$store.getters.getUser.user_id,
          weibo_id: this.weibo_id,
        },
      })
      this.weibo = res.list
      console.log(this.weibo)
      if (this.weibo.weibo_image) {
        this.image = JSON.parse(this.weibo.weibo_image)
      }
    },
    async wiebolove() {
      const { data: res } = await this.$http.post('/weibo/weibolove', null, {
        params: {
          weibo_id: this.weibo_id,
        },
      })
      this.love = res.list
      const forword = await this.$http.post('/weibo/weiboforword', null, {
        params: {
          weibo_id: this.weibo_id,
        },
      })
      this.forword = forword.data.list
    },
    itemBtn(index) {
      this.navActive = index
    },
    showImage(subindex, item) {
      ImagePreview({
        images: JSON.parse(item.weibo_image),
        startPosition: subindex,
      })
    },
    // 点击弹出评论框
    actionComPopup() {
      this.commnetPopupShow = true
    },
    // 提交评论功能
    async comSubmit() {
      const { data: res } = await this.$http.post('/weibo/addcomment', null, {
        params: {
          weibo_comcontainer: this.commnet_container,
          weibo_id: this.weibo_id,
          user_id: this.$store.getters.getUser.user_id,
        },
      })
      if (res.status === 200) {
        this.$notify({ type: 'success', message: '评论成功' })
        this.commnetPopupShow = false
        this.weibodata()
        this.commnetsdata()
      } else {
        this.$notify({ type: 'danger', message: '评论失败' })
        this.commnetPopupShow = false
      }
    },
    // 显示微博评论
    async commnetsdata() {
      const { data: res } = await this.$http.post('/weibo/weibocomment', null, {
        params: {
          weibo_id: this.weibo_id,
        },
      })
      this.comments = res.list
      console.log(this.comments)
    },
    //
    jumpuser(id) {
      this.$router.push({
        path: '/userBlog',
        query: {
          user_id: id,
        },
      })
    },
  },
  filters: {
    formatDate: function (time) {
      const value =
        new Date(time.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')).getTime() +
        8 * 3600 * 1000
      let date = new Date(value)
      let y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? '0' + MM : MM
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let h = date.getHours()
      h = h < 10 ? '0' + h : h
      let m = date.getMinutes()
      m = m < 10 ? '0' + m : m
      let s = date.getSeconds()
      s = s < 10 ? '0' + s : s
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
    },
  },
}
</script>

<style lang="less" scoped>
.weibo {
  position: relative;
  z-index: 10;
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
  .talkBox {
    border-top: 5px solid #e0e0e0;
    border-bottom: 5px solid #e0e0e0;
    position: relative;
    background: #fff;
    // box-shadow: 0 4px 8px 6px rgba(7, 17, 27, 0.06);
    width: 100%;
    // margin-bottom: 10px;
    overflow: hidden;
    .talk-top {
      display: flex;
      // background: #789;
      height: 60px;
      width: 100%;
      .avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-left: 10px;
        margin-top: 15px;
        img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
      }
      .user {
        margin-left: 10px;
        margin-top: 12px;
        .username {
          font-size: 14px;
          color: #333;
        }
        .time {
          margin-top: -2px;
          font-size: 12px;
          color: #8e8d92;
        }
      }
    }
    .talk-main {
      margin-bottom: 10px;
      .talktext {
        margin: 0 10px 10px 10px;
        overflow: hidden;
        display: -webkit-box;
        text-overflow: ellipsis;
        -webkit-line-clamp: 5; /*要显示的行数*/
        -webkit-box-orient: vertical;
        font-size: 16px;
        line-height: 160%;
      }
      .trueForword {
        background: #f6f6f6;
        width: 100%;
        overflow: hidden;
        .text {
          margin: 10px;
          font-size: 16px;
          overflow: hidden;
          display: -webkit-box;
          text-overflow: ellipsis;
          -webkit-line-clamp: 5; /*要显示的行数*/
          -webkit-box-orient: vertical;
          line-height: 160%;
        }
        a {
          color: #0071e3;
        }
      }
      .showImage {
        width: 100%;
        margin: 10px 0;
        .imageBox {
          width: 100%;
          // display: flex;
          margin: 10px 0;
          .img:nth-child(3n + 1) {
            margin-left: 2.5%;
          }
          .img {
            width: 30%;
            float: left;
            margin-right: 2.5%;
            // flex: 0 0 30%;
            img {
              width: 100%;
            }
          }
        }
      }
    }
    .talk-foot {
      border-top: 1px dashed #e0e0e0;
      width: 100%;
      bottom: 0;
      height: 40px;
      overflow: hidden;
      .foot {
        display: flex;
        width: 100%;
        height: 40px;
        .icont {
          text-align: center;
          flex: 1;
          .iconBox {
            margin-left: 50%;
            position: relative;
            left: -25%;
            overflow: hidden;
            text-align: center;
            line-height: 40px;
            .img {
              svg {
                margin-top: 10px;
              }
            }
            .num {
              padding-left: 5px;
              font-size: 16px;
            }
            div {
              float: left;
            }
          }
        }
      }
    }
  }
  .nav {
    display: flex;
    text-align: center;
    border-bottom: 1px solid #e0e0e0;
    height: 38px;

    .item {
      color: #696969;
      font-size: 14px;
      line-height: 38px;
      flex: 1;
    }
  }
  .navItem {
    .love {
      .loveitem {
        display: flex;
        height: 50px;
        line-height: 50px;
        border-bottom: 1px dashed #e0e0e0;
        .img {
          margin-top: 10px;
          margin-left: 10px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
          }
        }
        .name {
          font-size: 16px;
          margin-left: 20px;
        }
      }
    }
    .forword {
      .forworditem {
        display: flex;
        align-items: center;
        border-bottom: 1px dashed #696969;
        margin-bottom: 5px;
        .img {
          margin-left: 10px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
          }
        }
        .text {
          font-size: 14px;
          margin-left: 15px;
          margin-top: 5px;
          .name {
            margin-top: 3px;
            margin-bottom: 3px;
            font-size: 12px;
          }
          .time {
            margin-top: 3px;
            color: #696969;
            font-size: 12px;
          }
        }
      }
    }
  }

  .itemActive {
    color: #000 !important;
    border-bottom: 2px solid orange !important;
  }
  .foot {
    width: 100%;
    height: 50px;
    border-top: 1px solid #eeeeee;
    background: #fafafa;
    position: fixed;
    bottom: 0;
    display: flex;
    text-align: center;
    span {
      margin-top: 10px;
      height: 30px;
      line-height: 30px;
      flex: 1;
    }
    span:nth-child(1),
    span:nth-child(2) {
      border-right: 1px solid #e0e0e0;
    }
  }
  /deep/.commentPopup {
    width: 100%;
    .title {
      margin-top: 15px;
      font-size: 16px;
      text-align: center;
    }
    .van-field--min-height {
      margin-top: 20px;
      width: 90%;
      margin-left: 5%;
      height: 50%;
      background: #f3f3f3;
      border-radius: 10px;
      .van-field__word-limit {
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }
    .button {
      width: 100%;
      position: relative;
      .van-button {
        position: absolute;
        right: 7%;
        top: 15px;
        border-radius: 10px;
        height: 30px;
      }
    }
  }
}
.forwordnull {
  padding: 10px 0;
  background: #f6f6f6;
  margin: 10px auto;
  text-align: center;
}
.forwordpopup {
  width: 100%;
  .title {
    margin-top: 15px;
    font-size: 16px;
    text-align: center;
  }
  .van-field {
    // height: 30%;
  }
  .list {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 20%;
    background: #dfdfdf;
    display: flex;
    .img {
      width: 30%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .text {
      flex: 1;
      margin-left: 10px;
      h1 {
        margin-top: 10px;
        font-size: 16px;
      }
      span {
        margin-top: 10px;
        font-size: 14px;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2; // 控制多行的行数
        -webkit-box-orient: vertical;
      }
    }
  }
  .button {
    position: absolute;
    top: 10px;
    right: 10px;
    .van-button {
      border-radius: 10px;
      width: 60px;
      height: 30px;
      border-radius: 20px;
    }
  }
}
.loveactive {
  color: red;
}
.lovedef {
  color: #000;
}
</style>