<template>
  <div class="myblog">
    <div class="exitBox">
      <div class="exit" @click="toexit()">
        <i class="iconfont icon-houtui"></i>
      </div>
      <div class="text" @click="toindex()">BoLuo-Weibo</div>
    </div>
    <div class="header">
      <div class="avatar">
        <img :src="userdata.user_avatar" alt />
      </div>
      <div class="text">
        <div class="name">{{ userdata.user_name }}</div>
        <div class="dec">{{ userdata.user_desc }}</div>
      </div>
      <!-- <div class="edit" v-if="$store.getters.getUser.user_id === find_id" @click="edit()">修改资料</div> -->
      <div class="edit" @click="followBtn(1)" v-if="isfllow === 1">已关注</div>
      <div class="edit" @click="followBtn(0)" v-if="isfllow === 0">关注</div>
    </div>
    <div class="data">
      <div>
        <h4>{{ userdata.user_blogs }}</h4>
        <h3>微博</h3>
      </div>
      <div @click="follow">
        <h4>{{ userdata.user_follows }}</h4>
        <h3>关注</h3>
      </div>
      <div @click="follow">
        <h4>{{ userdata.user_fans }}</h4>
        <h3>粉丝</h3>
      </div>
    </div>
    <div class="container">
      <div class="talkBox" v-for="(item, index) in weibodata" :key="index">
        <div class="talk-top">
          <div class="avatar">
            <img :src="item.user_avatar" alt />
          </div>
          <div class="user">
            <div class="username">{{ item.user_name }}</div>
            <div class="time">{{ item.weibo_time | formatDate }}</div>
          </div>
          <!-- <div class="ellipsis" @click="ellipsis(item.weibo_id)">
            <img src="http://localhost:3000/uploads/material/%E5%90%91%E4%B8%8B.png" alt />
          </div>-->
        </div>
        <router-link :to="{ path: '/weibo', query: { weibo_id: item.weibo_id } }">
          <div class="talk-main">
            <div class="talktext">{{ item.weibo_container }}</div>
            <!-- 转发情况 -->
            <div v-if="item.weibo_ofwid" class="trueForword">
              <div class="text" v-if="item.ofw">
                <a href>@{{ item.ofw.user_name }}：</a>
                <span>{{ item.ofw.weibo_container }}</span>
                <div class="showImage">
                  <div class="imageBox">
                    <div
                      class="img"
                      @click="showImage(subindex,item.ofw)"
                      v-for="(subitem, subindex) in JSON.parse(item.ofw.weibo_image)"
                      :key="subindex"
                    >
                      <img :src="subitem" alt />
                    </div>
                  </div>
                </div>
              </div>
              <div class="forwordnull" v-if="!item.ofw">该微博已被删除！</div>
            </div>
            <div class="showImage">
              <div class="imageBox">
                <div
                  class="img"
                  @click="showImage(subindex,item)"
                  v-for="(subitem, subindex) in JSON.parse(item.weibo_image)"
                  :key="subindex"
                >
                  <img :src="subitem" alt />
                </div>
              </div>
            </div>
          </div>
        </router-link>
        <div class="talk-foot">
          <div class="foot">
            <div class="icont icon-forwords" @click="forword(item)">
              <div class="iconBox">
                <div class="img">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-zhuanfa" />
                  </svg>
                </div>
                <div class="num">{{ item.weibo_forwords }}</div>
              </div>
            </div>
            <div class="icont icon-comments">
              <div class="iconBox">
                <div class="img">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-pinglun1" />
                  </svg>
                </div>
                <div class="num">{{ item.weibo_comments }}</div>
              </div>
            </div>
            <div class="icont icon-loves">
              <div class="iconBox" @click="loveBtn(item.weibo_islove, item.weibo_id)">
                <div class="img">
                  <svg v-if="item.weibo_islove === '1'" class="icon loveActive" aria-hidden="true">
                    <use xlink:href="#icon-xihuan_xuanzhong" />
                  </svg>
                  <svg v-else class="icon" aria-hidden="true">
                    <use xlink:href="#icon-xihuan_moren" />
                  </svg>
                </div>
                <div
                  class="num"
                  :style="{ color: item.weibo_islove === '1' ? 'red' : '#333' }"
                >{{ item.weibo_loves }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-popup
      class="forword-poopup"
      round
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
export default {
  data() {
    return {
      find_id: 300001,
      userdata: {},
      weibodata: {},
      show: false,
      delid: 0,
      forwordshow: false,
      forworddata: {},
      forword_container: '',
      user_id: '',
      isfllow: 0,
    }
  },
  created() {
    var user_id = this.$route.query.user_id
    this.user_id = user_id
    this.getdata()
    if (Number(this.user_id) === Number(this.$store.getters.getUser.user_id)) {
      console.log('跳转成功')
      this.$router.push('/myblog')
    }
    this.judgefollow()
  },
  methods: {
    // 取消and关注用户
    async followBtn(index) {
      // 关注对方
      if (index === 0) {
        const { data: res } = await this.$http.post(
          '/weibo/followpeople',
          null,
          {
            params: {
              myid: this.$store.getters.getUser.user_id,
              youid: this.user_id,
              state: 0,
            },
          }
        )
        if (res.status === 200) {
          this.$notify({ type: 'success', message: '关注成功' })
          this.isfllow = 1
        } else {
          console.log(res)
          this.$notify({ type: 'success', message: '关注失败' })
        }
      }
      // 取消关注对方
      if (index === 1) {
        this.$dialog
          .alert({
            message: '确定取消关注吗',
            showCancelButton: true,
          })
          .then(() => {
            this.delfollow()
            // on confirm
          })
          .catch(() => {
            // on cancel
          })
      }
    },
    async delfollow() {
      let { data: res } = await this.$http.post('/weibo/followpeople', null, {
        params: {
          // myid: this.$route.query.user_id,
          // youid: this.user_id,
          state: 1,
          myid: this.$store.getters.getUser.user_id,
          youid: this.user_id,
        },
      })
      if (res.status === 200) {
        this.$notify({ type: 'success', message: '已取消关注' })
        this.isfllow = 0
        this.judgefollow()
      } else {
        this.$notify({ type: 'success', message: '取消关注失败' })
      }
    },
    // 判断该用户是否已被关注
    async judgefollow() {
      const { data: res } = await this.$http.post('/weibo/judgefollow', null, {
        params: {
          myid: this.$store.getters.getUser.user_id,
          youid: this.user_id,
        },
      })
      console.log(res)
      if (res.status === 200) {
        this.isfllow = 1
      } else {
        this.isfllow = 0
      }
    },
    toexit() {
      this.$router.push('/principal')
    },
    toindex() {
      this.$router.push('/')
    },
    async getdata() {
      const { data: res } = await this.$http.post('/weibo/othersweibo', null, {
        params: {
          user_id: this.user_id,
          look_id: this.$store.getters.getUser.user_id,
        },
      })
      this.userdata = res.list.user
      this.weibodata = res.list.weibo
      console.log(res)
    },
    edit() {
      this.$router.push('/editProfile')
    },
    ellipsis(id) {
      this.show = true
      this.delid = id
    },
    async loveBtn(index, weibo_id) {
      // 当index不存在的时候进行添加数据
      if (!index) {
        const { data: res } = await this.$http.post('/weibo/addlove', null, {
          params: {
            weibo_id: weibo_id,
            user_id: this.$store.getters.getUser.user_id,
          },
        })
        if (res.status === '200') {
          this.getdata()
        } else if (res.status === '208') {
        }
      } else {
        const { data: res } = await this.$http.post('/weibo/dellove', null, {
          params: {
            weibo_id: weibo_id,
            user_id: this.$store.getters.getUser.user_id,
          },
        })
        if (res.status === '200') {
          this.getdata()
        }
      }
    },
    forword(item) {
      this.forwordshow = true
      this.forworddata.container = item.weibo_container
      this.forworddata.name = item.user_name
      this.forworddata.avatar = item.user_avatar
      this.forworddata.ofw = item.ofw
      this.forworddata.ofwid = item.weibo_ofwid
      this.forworddata.weiboid = item.weibo_id
      if (this.forworddata.ofwid) {
        this.forword_container =
          '//@' + this.forworddata.name + ':' + this.forworddata.container
        this.forworddata.weiboid = item.ofw.weibo_id
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
        this.getdata()
      }
    },
    follow() {
      this.$router.push('/follow')
    },
  },
}
</script>

<style lang="less" scoped>
.myblog {
  width: 100%;
  height: 100%;
  background: #fff;
  position: relative;
  z-index: 2;
  .exitBox {
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
      margin-left: 20px;
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
      border: 1px solid #333;
      width: 100px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      border-radius: 5px;
      color: #333;
    }
  }
  .data {
    display: flex;
    margin-top: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #e6e6e6;
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
  .talkBox {
    position: relative;
    background: #fff;
    box-shadow: 0 4px 8px 6px rgba(7, 17, 27, 0.06);
    width: 100%;
    margin-bottom: 10px;
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
      .ellipsis {
        position: absolute;
        top: 20px;
        right: 10px;
        img {
          width: 15px;
          height: 15px;
        }
      }
    }
    .talk-main {
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
        justify-self: center;
        .icont {
          text-align: center;
          flex: 1;
          .iconBox {
            justify-content: center;
            display: flex;
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
  .del {
    margin: 40px 20px 0 20px;
    display: flex;
    border-bottom: 1px solid #e0e0e0;
    .iconBox {
      color: red;
      width: 40px;
      height: 40px;
      i {
        font-size: 20px;
      }
    }
    .delname {
      color: red;
      flex: 1;
      // text-align: center;
      font-size: 20px;
    }
  }
  .forword-poopup {
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
  .img {
    .loveActive {
      fill: red !important;
    }
  }
  .forwordnull {
    padding: 10px 0;
    background: #f6f6f6;
    margin: 10px auto;
    text-align: center;
  }
}
</style>