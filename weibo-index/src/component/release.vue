<template>
  <div class="release">
    <div class="header">
      <div class="exit" @click="toexit()">
        <i class="iconfont icon-houtui"></i>
      </div>
      <div class="text">发微博</div>
      <div class="go" @click="submit">
        <div class="box">发送</div>
      </div>
    </div>
    <div class="text">
      <!-- <textarea
        name=""
        id=""
        cols="30"
        rows="10"
        placeholder="分享新鲜事~"
      ></textarea>-->
      <van-field
        v-model="message"
        rows="12"
        type="textarea"
        maxlength="140"
        placeholder="分享新鲜事"
        show-word-limit
      />
    </div>
    <div class="upImage">
      <van-divider dashed>图片上传</van-divider>
      <van-uploader :after-read="onRead" v-model="fileList" multiple :max-count="9" />
    </div>
  </div>
</template>

<script>
// import { Picker } from "emoji-mart-vue";
export default {
  components: {
    // Picker,
  },
  data() {
    return {
      fileList: [],
      message: '',
      resubmit: 0,
      picValue: null,
      files: [],
      imgArr: [],
    }
  },
  mounted() {},
  methods: {
    toexit() {
      this.$router.go(-1)
    },
    toindex() {
      this.$router.push('/')
    },
    onRead(file) {
      this.picValue = file // 文件流
    },
    async submit() {
      if (this.message === '') {
        this.$dialog.alert({
          message: '请输入微博内容',
        })
      } else {
        if (this.fileList) {
          await this.uploadAvatar()
        }
        const imgJSON = JSON.stringify(this.imgArr)
        const imgArrLength = this.imgArr.length
        const { data: res } = await this.$http.post('/weibo/storageSql', null, {
          params: {
            user_id: this.$store.getters.getUser.user_id,
            container: this.message,
            imgArr: imgJSON,
            isimage: imgArrLength,
          },
        })
        if (res.status === 200) {
          this.$notify({ type: 'success', message: '发布成功' })
          this.$router.push('/principal')
        }
      }
    },
    async uploadAvatar() {
      let data = new FormData()
      for (let i = 0; i < this.fileList.length; i++) {
        data.append('images', this.fileList[i].file, this.fileList[i].file.name) // 很重要 data.append("file", file);不成功
        data.append('data', 112)
        console.log(data.get('file'))
      }
      const { data: res } = await this.$http.post('/file_upload', data, {
        headers: { 'content-type': 'multipart/form-data' },
      })
      console.log(res)
      this.imgArr = res.imgArr
    },
  },
}
</script>

<style lang="less" scoped>
.release {
  position: relative;
  z-index: 2;
  background: #fff;
  width: 100%;
  height: 100%;
  .header {
    width: 100%;
    height: 50px;
    display: flex;
    text-align: center;
    background: #fff;
    // line-height: 50px;
    .exit {
      width: 80px;
      i {
        font-size: 30px;
        float: left;
        margin-left: 10px;
        line-height: 50px;
      }
    }
    .text {
      flex: 1;
      line-height: 50px;
    }
    .go {
      width: 80px;
      margin-left: auto;
      .box {
        margin-left: auto;
        margin-left: 10px;
        width: 60px;
        height: 30px;
        margin-top: 10px;
        font-size: 14px;
        border-radius: 20px;
        background-image: linear-gradient(#f79002, #f8ba39);
        line-height: 30px;
        color: #fff;
      }
    }
  }
  .text {
    textarea {
      border: 0;
      border-radius: 5px;
      background-color: rgba(241, 241, 241, 0.98);
      width: 100% !important;
      height: 400px !important;
      resize: none;
    }
  }
  .upImage {
    overflow: hidden;
    margin: 8px;
  }
}
i {
  font-family: 'iconfont' !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>