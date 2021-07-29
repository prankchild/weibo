<template>
  <div class="editProfile">
    <div class="header">
      <div class="exit" @click="toexit()">
        <i class="iconfont icon-houtui"></i>
      </div>
      <div class="text" @click="toindex()">BoLuo-Weibo</div>
    </div>
    <div class="edit">
      <h3>修改资料</h3>
      <div class="avatar">
        <van-uploader v-model="avatar" multiple :max-count="1" :upload-icon="user.user_avatar" />
      </div>
      <van-form @submit="onSubmit">
        <van-field
          v-model="user.user_name"
          name="昵称"
          label="昵称"
          placeholder="昵称"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="user.user_desc"
          name="简介"
          label="简介"
          placeholder="简介"
          :rules="[{ required: true, message: '请填写简介' }]"
        />
        <div style="margin: 16px">
          <van-button round block type="info" native-type="submit">提交</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {},
      avatar: [],
      avatarUrl: '',
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    toexit() {
      this.$router.go(-1)
    },
    toindex() {
      this.$router.push('/')
    },
    onSubmit() {
      this.$dialog
        .alert({
          message: '确定要修改信息吗',
          showCancelButton: true,
        })
        .then(() => {
          this.edit()
        })
        .catch(() => {
          // on cancel
        })
    },
    async edit() {
      await this.uploadAvatar()
      if (this.avatarUrl) {
        const { data: res } = await this.$http.post('/user/edituser', null, {
          params: {
            user_id: this.$store.getters.getUser.user_id,
            user_name: this.user.user_name,
            user_desc: this.user.user_desc,
            user_avatar: this.avatarUrl,
          },
        })
        if (res.status === 200) {
          this.$notify({ type: 'success', message: '修改成功' })
          this.$router.push('/principal')
        } else {
          this.$notify({ type: 'danger', message: '修改失败' })
        }
      }
    },
    async getUser() {
      const { data: res } = await this.$http.post('/user/getuser', null, {
        params: {
          user_id: this.$store.getters.getUser.user_id,
        },
      })
      this.user = res.data
    },
    // 上传头像
    async uploadAvatar() {
      let data = new FormData()
      data.append('file', this.avatar[0].file, this.avatar[0].file.name) // 很重要 data.append("file", file);不成功
      data.append('data', 112)
      const { data: res } = await this.$http.post('/weibo/upAvatar', data, {
        headers: { 'content-type': 'multipart/form-data' },
      })
      if (res.status === 200) {
        this.avatarUrl = res.imgUrl
      }
    },
  },
}
</script>

<style lang="less" scoped>
.editProfile {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  background: #fff;
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
  h3 {
    font-size: 16px;
    height: 30px;
    line-height: 30px;
    width: 100%;
    text-align: center;
    margin-bottom: 20px;
  }
  .avatar {
    width: 100%;
    text-align: center;
    display: flex;
    justify-self: center;

    .van-uploader {
      margin: 10px auto;
    }
  }
}
.avatar {
  font-size: 80px !important;
  /deep/.van-uploader__upload-icon {
    font-size: 80px !important;
  }
}
</style>