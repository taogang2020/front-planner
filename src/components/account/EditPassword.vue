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
import crypto from "crypto";
import { validLoginPassword } from "@/utils/validate";
export default {
  name: "EditPassword",
  data() {
    return {
      form: {
        oldSecrectCode:'',
        newSecrectCode:'',
        confirmSecrectCode:'',
      },
      is_weixin:false,
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
    submit(){
      var  _this = this;
      //校验
      if (_this.form.oldSecrectCode == "") {
        _this.$toast("请填写原始密码");
        return;
      }
      if(!validLoginPassword(_this.form.oldSecrectCode)){
        _this.$toast("原始密码：密码只能包含字母、数字、下划线");
        return;
      }
      if (_this.form.newSecrectCode == "") {
        _this.$toast("请填写新密码");
        return;
      }
      if(!validLoginPassword(_this.form.newSecrectCode)){
        _this.$toast("新密码：密码只能包含字母、数字、下划线");
        return;
      }
      if (_this.form.confirmSecrectCode == "") {
        _this.$toast("请填写确认密码");
        return;
      }
      if(!validLoginPassword(_this.form.confirmSecrectCode)){
        _this.$toast("确认密码：密码只能包含字母、数字、下划线");
        return;
      } 
      //判断新密码和确认密码是否相同
      if(_this.form.newSecrectCode != _this.form.confirmSecrectCode){
        _this.$toast("新密码和确认密码不一致");
        return;
      }
      var saveoldSecrectCode = _this.form.oldSecrectCode;
      var savenewSecrectCode = _this.form.newSecrectCode;
      var saveconfirmSecrectCode = _this.form.confirmSecrectCode;
      
      //均加密传到后台
      var  md5 = crypto.createHash("md5");
      md5.update(_this.form.oldSecrectCode) //需要加密的密码
      _this.form.oldSecrectCode = md5.digest('hex');  //password 加密完的密码
      var  newMd5 = crypto.createHash("md5");
      newMd5.update(_this.form.newSecrectCode) //需要加密的密码
      _this.form.newSecrectCode = newMd5.digest('hex');  //password 加密完的密码
      var  conMd5 = crypto.createHash("md5");
      conMd5.update(_this.form.confirmSecrectCode) //需要加密的密码
      _this.form.confirmSecrectCode = conMd5.digest('hex');  //password 加密完的密码
        
      _this.$http.post("/api/members/operator/updatePassword", _this.form).then(function(res) {
        var data = res.data;
        if (data.code == 0) {
          _this.$toast("修改成功");
          //跳转到账户中心
          _this.$router.push({ 
            path:'/myAccount',  
          })
        } else {
          _this.$toast(data.msg);
          _this.form.oldSecrectCode = saveoldSecrectCode;
          _this.form.newSecrectCode = savenewSecrectCode;
          _this.form.confirmSecrectCode = saveconfirmSecrectCode;
        }
      });
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
