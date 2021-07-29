<template>
  <div class="login">
    <div class="header">
      <div class="exit" @click="toexit()">
        <i class="iconfont icon-houtui"></i>
      </div>
      <div class="text" @click="toindex()">BoLuo-Weibo</div>
    </div>
    <div class="title">
      <h1>登录账号</h1>
    </div>
    <div class="register-form">
      <van-form @submit="onSubmit">
        <van-field
          v-model="email"
          name="邮箱"
          label="邮箱"
          placeholder="邮箱"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <div style="margin: 16px">
          <van-button class="submit" round block type="info" native-type="submit">登录</van-button>
        </div>
      </van-form>
    </div>
    <div class="forget">
      <a href>忘记密码？</a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    toexit() {
      this.$router.go(-1)
    },
    toindex() {
      this.$router.push('/')
    },
    async onSubmit() {
      const { data: res } = await this.$http.post('/Login', null, {
        params: {
          email: this.email,
          password: this.password,
        },
      })
      if (res.status === 200) {
        // window.sessionStorage.setItem(
        //   'user',
        //   JSON.stringify({
        //     user_id: res.user_id,
        //     token: res.token,
        //   })
        // )
        this.$store.dispatch('asyncUpdateUser', {
          user_id: res.user_id,
          token: res.token,
        })
        window.sessionStorage.setItem(
          'store',
          JSON.stringify(this.$store.state)
        )
        this.$notify({ type: 'success', message: '登录成功' })
        console.log()
        this.$router.push('/principal')
      } else {
        this.$notify({ type: 'danger', message: '邮箱或密码错误' })
      }
    },
  },
}
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  z-index: 2;
  position: relative;
  background: #fff;
}
.header {
  text-align: center;
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