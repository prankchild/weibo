<template>
  <div class="exitBox">
    <!-- 后退 -->
    <div class="exit">
      <img src="../assets/exit.png" alt="" />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.exitBox {
  overflow: hidden;
  height: 40px;
  background: #fff;
  img {
    width: 20px;
    height: 20px;
  }
  .exit {
    padding: 0 10px;
    margin-top: 10px;
    width: 20px;
    height: 20px;
    margin-right: auto;
  }
}
</style>