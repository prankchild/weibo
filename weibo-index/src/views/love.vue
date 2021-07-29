<template>
  <!-- 我的点赞首页 -->
  <div class="love">
    <div class="header">
      <div class="exit" @click="toexit()">
        <i class="iconfont icon-houtui"></i>
      </div>
      <div class="text" @click="toindex()">BoLuo-Weibo</div>
    </div>
    <div class="null"></div>
    <div class="talkBox" v-for="(item, index) in weiboData" :key="index">
      <div class="talk-top">
        <div class="avatar">
          <img :src="item.user_avatar" alt />
        </div>
        <div class="user">
          <div class="username">{{ item.user_name }}</div>
          <div class="time">{{ item.weibo_time | formatDate}}</div>
        </div>
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
                @click="showImage(subindex, index)"
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
            <div class="iconBox" @click="delsumbit(item.weibo_islove, item.weibo_id)">
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
import { ImagePreview } from 'vant'
export default {
  data() {
    return {
      weiboData: {},
      forwordshow: false,
      forworddata: {},
      forword_container: '',
    }
  },
  created() {
    this.lovedata()
  },
  methods: {
    async lovedata() {
      const { data: res } = await this.$http.post('/weibo/loveHome/', null, {
        params: { user_id: this.$store.getters.getUser.user_id },
      })
      this.weiboData = res.list
      console.log(res.list)
    },
    toexit() {
      this.$router.go(-1)
    },
    toindex() {
      this.$router.push('/')
    },
    async showImage(subindex, index) {
      ImagePreview({
        images: JSON.parse(this.weiboData[index].weibo_image),
        startPosition: subindex,
      })
    },
    delsumbit(is, id) {
      this.$dialog
        .alert({
          message: '确定取消点赞吗',
          showCancelButton: true,
        })
        .then(() => {
          this.loveBtn(id)
          // on confirm
        })
        .catch(() => {
          // on cancel
        })
    },
    async loveBtn(weibo_id) {
      // 当index不存在的时候进行添加数据
      const { data: res } = await this.$http.post('/weibo/dellove', null, {
        params: {
          weibo_id: weibo_id,
          user_id: this.$store.getters.getUser.user_id,
        },
      })
      if (res.status === '200') {
        this.lovedata()
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
        this.$router.push('/principal')
      }
    },
    jumpuser(id) {
      this.$router.push({
        path: '/userBlog',
        query: {
          user_id: id,
        },
      })
    },
  },
}
</script>



<style lang="less" scoped>
.love {
  width: 100%;
  height: 100%;
  z-index: 2;
  position: relative;
  background: #fff;
  .header {
    z-index: 2;
    width: 100%;
    height: 50px;
    display: flex;
    text-align: center;
    background: #fff;
    position: fixed;
    // line-height: 50px;
    border-bottom: 1px dashed #e0e0e0;
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
  .null {
    width: 100%;
    height: 50px;
  }
}
.talkBox {
  position: relative;
  background: #fff;
  // box-shadow: 0 4px 8px 6px rgba(7, 17, 27, 0.06);
  border-bottom: 10px solid #e0e0e0;
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
      div {
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
.img {
  .loveActive {
    fill: red !important;
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
.forwordnull {
  padding: 10px 0;
  background: #f6f6f6;
  margin: 10px auto;
  text-align: center;
}
</style>