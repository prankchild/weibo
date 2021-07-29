<template>
  <div class="my">
    <div class="top">
      <!-- 后退 -->
      <div class="exit">
        <img src="../assets/exit.png" alt="" />
      </div>
    </div>
    <div class="header">
      <div class="container">
        <div class="avatar">
          <img src="../assets/avatar.jpg" alt="" />
        </div>
        <div class="user">
          <div class="username">
            {{ username }}
          </div>
          <div class="userdec">简介:路漫漫其修远兮</div>
        </div>
        <div class="refresh">
          <img src="../assets/F5.png" alt="" />
        </div>
      </div>
      <div class="other">
        <div class="data">
          <a href="javasciprt;" v-for="(item, index) in 3" :key="index">
            <div>
              <h4>111</h4>
              <h5>微博</h5>
            </div>
          </a>
        </div>
        <div class="edit">编辑个人资料</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "HiBoluo",
      choice: 0,
      love: 10,
      comment: 100,
      forword: 211,
    };
  },
};
</script>

<style lang="less" scoped>
.my {
  position: relative;
  z-index: 2;
  .top {
    display: flex;
    padding: 0 10px;
    height: 35px;
    margin-top: 10px;
    background: #fff;
    img {
      width: 20px;
      height: 20px;
    }
    .exit {
      width: 20px;
      height: 20px;
      margin-right: auto;
    }
    .setting {
      width: 20px;
      height: 20px;
      margin-left: auto;
    }
  }
  .header {
    width: 100%;
    height: 150px;
    background: #fff;
    border-bottom: 1px solid #e0e0e0;
    .container {
      display: flex;
      width: 100%;
      height: 60px;
      box-sizing: border-box;
      padding: 0 15px;
      .avatar {
        margin-top: 8px;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: 1px solid #e0e0e0;
        img {
          width: 44px;
          height: 44px;
          border-radius: 50%;
        }
      }
      .username {
        padding-left: 10px;
        padding-top: 8px;
        font-weight: 700;
      }
      .userdec {
        padding-left: 10px;
        font-size: 14px;
      }
      .refresh {
        padding-top: 15px;
        margin-left: auto;
        width: 30px;
        height: 30px;
        img {
          width: 30px;
          height: 30px;
        }
      }
    }
    .other {
      display: flex;
      .data {
        overflow: hidden;
        margin-top: 10px;
        margin-left: 10px;
        div {
          float: left;
          font-size: 16px;
          font-weight: 500 !important;
          h4,
          h5 {
            margin: 8px;
          }
        }
      }
      .edit {
        margin: 25px 20px 0 auto;
        width: 150px;
        height: 30px;
        line-height: 30px;
        border: 1px solid #6f6f6f;
        text-align: center;
      }
    }
  }
}
</style>