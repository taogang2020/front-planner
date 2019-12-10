<template>
<div>
<van-nav-bar
        title="登录"
      />

  <div class="loginWarp">
    <van-tabs v-model="active" :line-width='10'>
        <!-- <p class="line">|</p> -->
      <van-tab title="密码登录">
        <van-field v-model="username" placeholder="请输入手机号" />
        <van-field v-model="password" type="password" placeholder="请输入密码" />
      </van-tab>
      
      <van-tab title="验证码登录">
        <div class="sendTop">
          <van-field v-model="username" placeholder="请输入手机号" />
          <p class="send" @click="getcode()" v-html="text_code" v-bind:class="{active:isactive}"></p>
        </div>
        <van-field v-model="password" type="password" placeholder="请输入验证码" />
      </van-tab>
    </van-tabs>
    <div class="login" @click='login'>登录</div>
    <p class="register">没有账号？去&nbsp;<router-link to="organRegister">企业注册</router-link>&nbsp;&nbsp;<router-link to="personalRegister">个人注册</router-link></p>
  </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      active: 0,
      username: "",
      password: "",
      isactive: false,
      text_code: "发送验证码"
    };
  },
   mounted () {
     document.querySelector('body').setAttribute('style', 'background-color:#fff')
  },
  beforeDestroy() {
    document.querySelector('body').removeAttribute('style')
  },
  methods: {
    // 发送验证码
    getcode(formName) {
      var _this = this;
      var time = 60;
      _this.text_code = time + "s后重发";
      _this.isactive = true;
      var Timer = setInterval(function() {
        time--;
        _this.text_code = time + "s后重发";
        if (time == 0) {
          time = 60;
          clearInterval(Timer);
          _this.text_code = "发送验证码";
          _this.isactive = false;
        }
      }, 1000);
    },
    // 登录
    login(){

    }
  }
};
</script>
<style>
.loginWarp .van-tabs__line {
  background: transparent;
  /* transform: translateX(62px) translateX(-50%)!important; */
} 
.loginWarp .van-tabs__nav {
  width: 4.5rem;
  margin: auto;
}
.loginWarp .van-nav-bar__text{
  color: #333;
}
.loginWarp .van-tab--active {
  font-size: 0.34rem;
  font-weight: 700;
}
.loginWarp .van-tab {
  font-size: 0.34rem;
}
.loginWarp .van-tabs__content {
  padding: 0.9rem 0.6rem;
}
.loginWarp .van-hairline--top-bottom {
  border: none;
}
.loginWarp .van-cell {
  border-bottom: 0.01rem solid #ccc;
  margin-bottom: 0.2rem;
}
.loginWarp .van-cell__value--alone {
  font-size: 0.3rem;
}
.loginWarp .van-hairline--top-bottom::after,.van-hairline-unset--top-bottom::after {
  border-width: 0px 0;
}
.loginWarp .sendTop {
  position: relative;
}
.loginWarp .sendTop .van-field__control {
  width: 4rem;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loginWarp {
  width: 7.5rem;
  height: auto;
  padding-top: 1.5rem;
  box-sizing: border-box;
}
.send {
  background: #ed2424;
  position: absolute;
  height: 0.6rem;
  width: 1.5rem;
  top: 0.1rem;
  right: 0;
  color: #fff;
  font-size: 0.25rem;
  text-align: center;
  line-height: 0.6rem;
  border-radius: 0.04rem;
  pointer-events: auto;
}
.active {
  pointer-events: none;
  background: #ccc;
}
.login{
    width: 6.3rem;
    height: 0.85rem;
    font-size: 0.3rem;
    color: #fff;
    background: #ed2424;
    border-radius: 0.05rem;
    text-align: center;
    line-height: 0.85rem;
    margin: 0 auto;
}
/* .line{
    position: absolute;
    font-size: 0.35rem;
    top: 1.5%;
    left: 3.6rem;
    color: #777;
} */
.register{
    position: relative;
    text-align: right;
    right: 0.6rem;
    top: 0.4rem;
    color: #666;
    font-size: 0.24rem;
}
.register a{
    color: #0299E6;
    font-size: 0.24rem;
}
</style>
