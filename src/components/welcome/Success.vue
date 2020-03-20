<template>
  <div class="success">
    <van-icon class="checkedicon" name="checked" color="#67c23a" />
    <p class="tips">操作成功</p>
    <p class="tips tipsSure">点击确定，返回主页面进行更多操作</p>
    <p class="successBtn" @click="handelClick" >确 定</p>
  </div>
</template>

<script>
export default {
  name: "Success",
  data() {
    return {};
  },
  created() {},
  methods: {
    handelClick() {
      var _this = this;
      _this.$router.push({
        path: "/openAccountList"
      });
    }
  }
};
</script>
<style>
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.success {
  width: 7.5rem;
  height: 1rem;
  padding-top: 1rem;
  box-sizing: border-box;
}
.checkedicon {
  text-align: center;
  font-size: 2rem;
  display: block;
}
.tips {
  color: #67c23a;
  font-size: 0.5rem;
  text-align: center;
  margin: 0.4rem 0;
}
.tipsSure {
  color: #777;
  font-weight: 300;
  font-size: 0.4rem;
}
.successBtn {
  width: 1.5rem;
  height: 0.8rem;
  text-align: center;
  line-height: 0.8rem;
  margin: 0 auto;
  display: block;
  background: #67c23a;
  color: #fff;
  font-size: 0.3rem;
  border-radius: 0.04rem;
}
</style>
