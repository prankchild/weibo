<template>
  <div class="message">
    <div class="container">
      <!-- @我的 -->
      <div class="table">
        <div class="icon">
          <i class="iconfont icon-aite"></i>
        </div>
        <div class="text">
          <h3>@我的</h3>
        </div>
        <div class="icon-right">
          <i class="icon-xiangyou iconfont"></i>
        </div>
      </div>
      <!-- 评论 -->
      <div class="table table-comment">
        <div class="icon">
          <i class="iconfont icon-wenda"></i>
        </div>
        <div class="text">
          <h3>评论</h3>
        </div>
        <div class="icon-right">
          <i class="icon-xiangyou iconfont"></i>
        </div>
      </div>
      <!-- 点赞 -->
      <div class="table table-love">
        <div class="icon">
          <i class="iconfont icon-dianzan1"></i>
        </div>
        <div class="text">
          <h3>赞</h3>
        </div>
        <div class="icon-right">
          <i class="icon-xiangyou iconfont"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.message {
  width: 100%;
  height: -webkit-calc(100% - 96px);
  height: -moz-calc(100% - 96px);
  height: calc(100% - 96px);
  background: #fff;
  .container {
    .table {
      position: relative;
      display: flex;
      width: 100%;
      height: 70px;
      //   background: #789;
      overflow: hidden;
      .icon {
        float: left;
        margin: 10px 10px 0 10px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #59b3dd;
        color: #fff;
        i {
          margin: 10px 0 0 10px;
          line-height: 50px;
          font-size: 30px;
        }
      }
      .text {
        flex: 1;
        margin-left: 5px;
        border-bottom: 1px solid #e6e6e6;
        h3 {
          color: #333;
          line-height: 70px;
          font-size: 18px;
        }
      }
      .icon-right {
        position: absolute;
        right: 5px;
        top: 20px;
        i {
          font-weight: 500;
          font-size: 20px;
        }
      }
    }
    .table-comment {
      .icon {
        background: #5fb583;
      }
    }
    .table-love {
      .icon {
        background: #f2a63b;
      }
    }
  }
}
i {
  font-family: "iconfont" !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>