<template>
  <div class="square">
    <!-- 图片 -->
    <div class="talkBox" v-for="(item, index) in weiboData" :key="index">
      <div class="talk-top">
        <div class="avatar">
          <img :src="item.user_avatar" alt />
        </div>
        <div class="user" @click="jumpuser(item.weibo_userid)">
          <div class="username">{{ item.user_name }}</div>
          <div class="time">{{ item.weibo_time | formatDate }}</div>
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
    <div class="desc" v-if="weiboData === 0">您暂未关注任何人，可以去广场看看吧~</div>
    <!-- 发微博icon -->
    <div class="sendOut">
      <div class="itembox" ref="sendOutRefs">
        <div class="item" :class="[F51 ? 'F5default' : 'F5active']" @click="F5()">
          <div class="iconBox">
            <i class="icon icon-shuaxin3"></i>
          </div>
        </div>
        <div class="item" @click="release()">
          <div class="iconBox">
            <i class="icon icon-yumaobi"></i>
          </div>
        </div>
      </div>
    </div>
    <van-popup
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
import Vue from 'vue'
import { Toast } from 'vant'
Vue.use(Toast)
export default {
  data() {
    return {
      imgae: [],
      showimg: false,
      weiboData: [],
      weiboimage: [],
      i: 0,
      F51: false,
      forwordshow: false,
      forworddata: {},
      forword_container: '',
    }
  },
  created() {
    this.Homedata()
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    jumpuser(id) {
      this.$router.push({
        path: '/userBlog',
        query: {
          user_id: id,
        },
      })
    },
    showImage(subindex, item) {
      ImagePreview({
        images: JSON.parse(item.weibo_image),
        startPosition: subindex,
      })
    },
    async Homedata() {
      const { data: res } = await this.$http.post('/weibo/square', null, {
        params: {
          user_id: this.$store.getters.getUser.user_id,
        },
      })
      this.weiboData = res.list
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
          this.Homedata()
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
          this.Homedata()
        }
      }
    },
    // 滑动屏幕组件
    handleScroll() {
      // 页面滚动距顶部距离
      if (this.$refs.sendOutRefs) {
        let scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop
        let scroll = Number(scrollTop - this.i)
        this.i = scrollTop
        if (scroll < 0) {
          this.$refs.sendOutRefs.style = 'display:none'
        } else if (scroll > 0) {
          this.$refs.sendOutRefs.style = 'display:block'
        }
      }
    },
    F5() {
      this.F51 = !this.F51
      this.Homedata()
      // 显示加载中
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '加载中',
      })
      let second = 1
      const timer = setInterval(() => {
        second--
        if (second) {
          toast.message = `加载中`
        } else {
          document.body.scrollTop = 0
          document.documentElement.scrollTop = 0
          clearInterval(timer)
          // 手动清除 Toast
          Toast.clear()
        }
      }, 1000)
    },
    release() {
      this.$router.push('/release')
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
        this.Homedata()
      }
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
.sendOut {
  // overflow: hidden;
  display: block;
  position: fixed;
  // left: 0;
  right: 20px;
  bottom: 30px;
  z-index: 100;
  .itembox {
    width: 50px;
    height: 110px;
    .item {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 0.125rem 0.8125rem 0 rgba(143, 152, 169, 0.24);
      color: #30a3f4;
      margin-bottom: 10px;
      .iconBox {
        text-align: center;
        line-height: 50px;
        .icon {
          font-family: 'iconfont' !important;
          font-size: 30px;
          font-style: normal;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      }
    }
  }
}
.sendOutBlock {
  display: block;
}
.sendOutNone {
  display: none;
}
@media screen and(max-width: 320px) {
  .iconBox {
    margin-left: 50%;
    position: relative;
    left: -25%;
    .img {
      margin-top: 10px !important;
      width: 20px !important;
      height: 20px !important;
      img {
        width: 20px !important;
        height: 20px !important;
      }
    }
  }
}

.img {
  .loveActive {
    fill: red !important;
  }
}

.F5default {
  transition: all 1s;
  transform: rotate(0deg);
}
.F5active {
  transform: rotate(720deg);
  transition: all 1s;
}
.van-popup {
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

