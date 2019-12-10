<template>
  <div class="editPassword">
    <van-nav-bar title="密码管理" />
    <div>
      <van-cell-group>
        <van-field v-model="form.oldSecrectCode" label="原始密码:" type="password" required placeholder="请输入原始密码" />
        <van-field v-model="form.newSecrectCode" label="新密码:" type="password" required placeholder="请输入新密码" />
        <van-field v-model="form.confirmSecrectCode" label="确认密码:" type="password" required placeholder="请确认新密码" />
      </van-cell-group>
      <div class="secondBtn">
        <van-button type="danger" @click='submit'>修 改</van-button>
        <van-button type="default" @click="cancel">取 消</van-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "EditPassword",
  data() {
    return {
      form: {
        oldSecrectCode:'',
        newSecrectCode:'',
        confirmSecrectCode:'',
      }
    };
  },

  created() {},

  methods: {
      submit(){

      },
      cancel(){
          var  _this = this;
          _this.$router.go(-1);
      }
  }
};
</script>
<style>
.editPassword .van-nav-bar__text {
  color: #333;
}
.editPassword .van-cell {
  width: 7.5rem;
  height: 1rem;
  line-height: 0.6rem;
  font-size: 0.3rem;
  margin-bottom: 0.1rem;
}
.editPassword .van-cell-group {
  background: transparent;
}
.editPassword .van-field__control {
  text-align: right;
}
.editPassword .secondBtn{
  width: 2.8rem;
  margin: 0.2rem auto;
}
.editPassword .secondBtn .van-button{
  width: 1.3rem;
  height: 0.7rem;
  line-height: 0.7rem;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.editPassword {
  width: 7.5rem;
  height: auto;
  font-size: 0.3rem;
}
</style>
