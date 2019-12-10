<template>
  <div>
    <van-nav-bar title="账户中心" />
    <div class="my_account">
      <p>
        <router-link :to="{name:'mine'}">
          基本信息
          <van-icon name="arrow" size="0.4rem" style="top:0.25rem" class="fr" color="#ccc" />
        </router-link>
      </p>
      <p>
        <router-link :to="{name:'editPassword'}">
          密码修改
          <van-icon name="arrow" size="0.4rem" style="top:0.25rem" class="fr" color="#ccc" />
        </router-link>
      </p>
    </div>
    <div class="logOut" @click="logOut">退出当前账号</div>
  </div>
</template>
<script>
export default {
  name: "MyAccount",
  data() {
    return {};
  },

  created() {},

  methods: {
    //退出登录
    logOut() {
      var _this = this;
      _this.$http .get("/api/members/operator/logOut", {params: { token: sessionStorage.getItem("token") }})
        .then(function(res) {
          var data = res.data;
          if (data.code == 0) {
            sessionStorage.removeItem("token");
            _this.$router.push({
              path: "/login"
            });
          } else {
            _this.$toast(data.msg);
          }
        });
    }
  }
};
</script>
<style>
.my_account .van-icon {
  top: 0.13rem;
}
.my_account .van-nav-bar__text {
  color: #333;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.my_account {
  width: 7.5rem;
  height: auto;
  font-size: 0.3rem;
}
.my_account p {
  margin-top: 0.2rem;
  width: 100%;
  height: 1rem;
  background: #fff;
  line-height: 1rem;
  color: #252f3f;
  padding: 0 0.2rem;
  box-sizing: border-box;
}
.my_account a {
  display: inline-block;
  width: 100%;
  height: 1rem;
  color: #252f3f;
}
.logOut {
  width: 100%;
  height: 1rem;
  bottom: 0;
  position: fixed;
  background: #252f3f;
  color: #fff;
  font-size: 0.32rem;
  text-align: center;
  line-height: 1rem;
}
</style>
