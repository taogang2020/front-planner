<template>
  <div class="my_account">
    <van-nav-bar v-show="is_weixin" title="账户中心" left-text="返回" left-arrow @click-left="cancel" />
    <div >
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
    return {
      is_weixin:false,
      show:false,
      bankPhoneShow:false,
    };
  },

  created() {
    var _this = this;
    _this.isWeixin();
  },

  methods: {
    // 判断是否是微信打开
    isWeixin(){
      var _this = this;
      var ua = navigator.userAgent.toLowerCase();
      var isWeixin = ua.indexOf('micromessenger') != -1;
      if (isWeixin) {
        _this.is_weixin=false;
        return true;
      }else{
        _this.is_weixin=true;
        return false;
      }
    }, 
    // // 设置交易密码 
    // setPassword(){
    //   var _this = this;
    //   _this.$dialog.confirm({
    //     title: "提示", 
    //     message: "确定前往交易所页面设置交易密码吗?",
    //     showCancelButton: true,
    //   })
    //   .then(() => { //点击确认按钮后的调用
          
    //   })
    //   .catch(() => { //点击取消按钮后的调用
        
    //   })

    // },
    // // 点击修改交易密码
    // editPassword(){
    //  var _this = this;
    //  _this.show = true;

    // },
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
    },
      //返回
    cancel() {
      var _this = this;
      _this.$router.go(-1);
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
.my_account .van-overlay{
  z-index: 1200 !important;
}
.van-dialog__confirm .van-button__text{
  color: #ed2424;
}
.my_account .van-nav-bar .van-icon {
  color: #333;
  top: 0;
}
.my_account .van-nav-bar__text {
  color: #333;
}
.my_account .wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  top: 50%;
  height:3rem;
  margin-top:-1.5rem;
}
.my_account .block {
  width: 6.5rem;
  height: 3rem;
  background-color: #fff;
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
  height: 0.8rem;
  bottom: 0;
  position: fixed;
  z-index: 999;
  background: #252f3f;
  color: #fff;
  font-size: 0.32rem;
  text-align: center;
  line-height: 0.8rem;
}
.my_account .change{
  width: 3rem;
  height: 0.8rem;
  text-align: center;
  margin: 0.4rem auto;
  color: #fff;
  background: #ed2424;
  line-height: 0.8rem;
  border-radius: 0.08rem;
}
</style>
