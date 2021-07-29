<template>
  <div class="register">
    <div class="header">
      <div class="exit" @click="toexit()">
        <i class="iconfont icon-houtui"></i>
      </div>
      <div class="text" @click="toindex()">BoLuo-Weibo</div>
    </div>
    <div class="title">
      <h1>注册账号</h1>
    </div>
    <div class="register-form">
      <van-form @submit="onSubmit">
        <van-field
          v-model="user_name"
          name="昵称"
          label="昵称"
          placeholder="昵称"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />

        <van-field
          v-model="user_email"
          name="邮箱"
          label="邮箱"
          placeholder="邮箱"
          :rules="[{ required: true, message: '请填写邮箱' }]"
        />
        <van-field
          class="code"
          v-model="verCode"
          name="验证码"
          label="验证码"
          placeholder="验证码"
          :rules="[{ required: true, message: '请填写验证码' }]"
        />
        <van-button class="codeBtn" plain hairline type="primary" @click="codeBtn()">发送验证码</van-button>
        <van-field
          v-model="user_password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <div style="margin: 16px">
          <van-button class="submit" round block type="info" native-type="submit">注册</van-button>
        </div>
      </van-form>
    </div>
    <div class="forget">
      <a href="/login">已有账号？立即登录</a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user_name: '',
      user_email: '',
      user_password: '',
      verCode: '',
    }
  },
  methods: {
    toexit() {
      this.$router.go(-1)
    },
    toindex() {
      this.$router.push('/')
    },
    async codeBtn() {
      const { data: res } = await this.$http.post('/user/isemail', null, {
        params: {
          user_email: this.user_email,
        },
      })
      if (res.status === 200) {
        const { data: res } = await this.$http.post('/user/EmailCode', null, {
          params: {
            user_email: this.user_email,
          },
        })
        console.log(res)
        if (res.status === 200) {
          this.$notify({ type: 'success', message: '验证码已发送到您邮箱' })
        } else if (res.status === 408) {
          this.$notify({ type: 'danger', message: '60秒内只能发送一次' })
        }
      } else {
        this.$notify({ type: 'danger', message: '邮箱已经被注册使用' })
      }
    },
    async onSubmit() {
      const { data: res } = await this.$http.post('/user/register', null, {
        params: {
          user_name: this.user_name,
          user_email: this.user_email,
          user_password: this.user_password,
          verCode: this.verCode,
        },
      })
      if (res.status === 200) {
        this.$notify({ type: 'success', message: '用户注册成功' })
        this.$router.push('/Login')
      } else {
        this.$notify({ type: 'danger', message: '注册失败' })
      }
    },
  },
}
</script>

<style lang="less" scoped>
.register {
  width: 100%;
  height: 100%;
  z-index: 2;
  position: relative;
  background: #fff;
}
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
.title {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 30px 0;
}
.code {
  float: left;
  width: 70% !important;
}
.codeBtn {
  float: right;
  margin-right: 10px;
  height: 38px;
  margin-top: 5px;
}
.submit {
  margin-top: 40px;
}
.forget {
  margin: 20px auto;
  width: 100%;
  text-align: center;
  font-size: 12px;
}
@media screen and (max-width: 320px) {
  .code {
    width: 60% !important;
  }
}
</style>