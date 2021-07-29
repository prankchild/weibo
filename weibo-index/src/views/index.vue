<template>
  <div class="index">
    <div class="index-name">
      <h1 @click="login()">BoLuo-Weibo</h1>
    </div>
    <div class="project-desc">
      <p>那些你起早努力的日子</p>
      <p>那些你熬夜努力的时光</p>
      <p>那些你太累觉得再也站不起来</p>
      <p>却依然支撑自己起身的夜晚</p>
      <p>那才是梦想的力量</p>
    </div>
    <div class="login" @click="loginShow">登录</div>
    <div class="about">
      <div class="avatar">
        <img src="../assets/avatar.jpg" alt />
      </div>
      <div class="text">
        <span>Hi菠萝</span>
        <span>路漫漫其修远兮</span>
      </div>
      <div class="icon">
        <div class="git">
          <a href="https://github.com/prankchild">
            <img src="../assets/index/github.png" alt />
          </a>
        </div>
        <div class="weibo">
          <a href="javascript;">
            <img src="../assets/index/weibo.png" alt />
          </a>
        </div>
      </div>
    </div>
    <!-- 登录展示框 -->
    <van-popup
      v-model="loginshowdig"
      round
      closeable
      duration="0.3s"
      :style="{ height: '40%',width:'90%' }"
    >
      <span class="title">用户登录</span>
      <van-form @submit="onSubmit">
        <van-field
          v-model="email"
          name="邮箱"
          label="邮箱"
          placeholder="邮箱"
          :rules="[{ required: true, message: '请填写邮箱' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <div style="margin: 16px;" class="sumbitBtn">
          <van-button round block type="info" native-type="submit">提交</van-button>
        </div>
        <div class="register">
          <a href="register">没有账号？立即注册</a>
        </div>
      </van-form>
    </van-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginshowdig: false,
      email: '',
      password: '',
    }
  },
  methods: {
    loginShow() {
      console.log(123)
      this.loginshowdig = true
    },
    // 登录组件
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
.index {
  z-index: 1;
  position: relative;
  width: 100%;
  height: 100%;
  .index-name {
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding-top: 50px;
  }
  .project-desc {
    text-align: center;
    p {
      display: block;
      font-size: 16px;
      padding-top: 5px;
    }
  }
  .login {
    width: 40%;
    height: 40px;
    background: #000;
    color: #fff;
    line-height: 40px;
    text-align: center;
    border-radius: 20px;
    margin: 30px auto 0 auto;
  }
  .about {
    border-top: 1px solid #e0e0e0;
    width: 100%;
    height: 80px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    box-sizing: border-box;
    .avatar {
      float: left;
      padding-top: 9px;
      padding-left: 15px;
      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: 1px solid #e0e0e0;
      }
    }
    .text {
      float: left;
      padding-top: 15px;
      padding-left: 15px;
      span {
        display: block;
        font-size: 1.2rem;
        font-weight: 500;
      }
      span:nth-child(2) {
        font-size: 0.9rem;
      }
    }
    .icon {
      overflow: hidden;
      position: absolute;
      top: 20px;
      right: 20px;
      div {
        padding-left: 10px;
        float: left;
      }
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    }
  }
  // vant对话框样式
  .title {
    margin-top: 10px;
    display: block;
    width: 100%;
    text-align: center;
    font-size: 18px;
  }
  @media screen and(max-width: 320px) {
    .van-popup {
      height: 50% !important;
    }
  }
  .van-form {
    margin-top: 20px;
    .sumbitBtn {
      //   margin-top: 10% !important;
    }
  }
  .register {
    text-align: center;
    margin: 0 auto;
    a {
      color: #696969;
    }
  }
}
</style>