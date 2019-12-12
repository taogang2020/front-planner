<template>
<div>
  <van-nav-bar
        title="登录"
      />
  <div class="loginWarp">
    <van-tabs  @click="onClick" :line-width='10'>
      <van-tab title="密码登录">
        <van-field v-model="form.memberCode" placeholder="请输入管理人编号" />
        <van-field v-model="form.operatorLoginName" placeholder="请输入登录名" />
        <van-field v-model="form.editPassword" type="password" placeholder="请输入登录密码" />
      </van-tab>
      
      <van-tab title="快捷登录">
        <van-field v-model="form.memberCode" placeholder="请输入管理人编号" />
        <div class="sendTop">
          <van-field v-model="form.operatorPhone" placeholder="请输入手机号" />
          <p class="send" @click="getcode()" v-html="text_code" v-bind:class="{active:isactive}"></p>
        </div>
        <van-field v-model="form.validCode" placeholder="请输入验证码" />
      </van-tab>
    </van-tabs>
     
    <div class="login" @click='login'>登录</div>
    <p class="register">没有账号？去&nbsp;<router-link to="register">注册</router-link></p>
  </div>
</div>
</template>

<script>
import crypto from "crypto";
import { validMobileNo } from "@/utils/validate";
export default {
  name: "Login",
  data() {
    return {
      form:{
        memberCode:'',
        operatorPhone:'',
        validCode:'',
        operatorLoginName: "",
        editPassword:"",
        password:"",
        loginType: 1,//登录方式1是密码登录，2是快捷登录
      },
     
      isactive: false,
      text_code: "发送验证码",
      
    };
  },
  mounted () {
    document.querySelector('body').setAttribute('style', 'background-color:#fff')
    // document.querySelector('.van-tabs__line').style.transform = 'translateX(62px) translateX(-50%)'
    
  },
  beforeDestroy() {
    document.querySelector('body').removeAttribute('style')
  },
  created(){
   
  },

  methods: {
     onClick(name, title) {
      var _this = this;
      if(title == "密码登录"){
        _this.form.loginType = 1;
        
      }else{
        _this.form.loginType = 2;
      }
    },
    // 发送验证码
    getcode() {
      var _this = this;
      if (_this.form.memberCode == "") {
        _this.$toast("请填写管理人编号");
        return;
      }
      if (_this.form.operatorPhone == "") {
        _this.$toast("请填写手机号");
        return;
      }
      if (!validMobileNo(_this.form.operatorPhone)) {
        _this.$toast("请填写格式正确的手机号");
        return;
      }
      _this.$http.post("/api/planner/members/operator/login/sendValidCode",{operatorPhone:_this.form.operatorPhone,memberCode:_this.form.memberCode}).then(function(res){
        var data = res.data
        if(data.code==0){
          var time = 60
          _this.text_code=time + "s后重发"
          _this.isactive=true
          var Timer = setInterval(function () {
            time--;
            _this.text_code=time + "s后重发"
            if (time == 0) {
                time = 60
                clearInterval(Timer)
                _this.text_code="发送验证码"
                _this.isactive=false
            }
          }, 1000);
        }else{
          _this.$toast(data.msg);
        }
      })
    },
    // 登录
    login(){
      var _this = this;
      if (_this.form.memberCode == "") {
        _this.$toast("请填写管理人编号");
        return;
      }
      if(_this.form.loginType == 1){
        //密码登录
        if (_this.form.operatorLoginName == "") {
          _this.$toast("请填写登录名");
          return;
        }
        if (_this.form.editPassword == "") {
          _this.$toast("请填写登录密码");
          return;
        }
      }else{
        //快捷登录
        if (_this.form.operatorPhone == "") {
          _this.$toast("请填写手机号");
          return;
        }
        if (_this.form.validCode == "") {
          _this.$toast("请填写验证码");
          return;
        }
      }

      var savepassword = _this.form.editPassword;
      if(_this.form.editPassword){
        var  md5 = crypto.createHash("md5");
        md5.update(_this.form.editPassword) //需要加密的密码
        _this.form.password = md5.digest('hex');  //password 加密完的密码
        _this.form.editPassword = "";
      }
      this.$http.post("/api/planner/members/operator/login",_this.form).then(function(res){
        var data = res.data
        if(data.code==0){
            sessionStorage.setItem('token', data.data.token)
            sessionStorage.setItem('guid', data.data.membersOperator.memberGuid)
            sessionStorage.setItem('operatorguid', data.data.membersOperator.operatorGuid)
            if(data.data.membersOperator.memberStatus==1){
              //待审核
              _this.$router.push({ 
                path:'/organCheckWait',  
              })

            }else if(data.data.membersOperator.memberStatus==2){
              //正常
              _this.$router.push({ 
                path:'/tradeList',  
              })
              
            }else if(data.data.membersOperator.memberStatus==3){
              //审核退回
              _this.$router.push({ 
                path:'/organCheckBack',  
              })
            } 
        }else{
          _this.$toast(data.msg);
          _this.form.editPassword = savepassword;
        }
    })

    },
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
