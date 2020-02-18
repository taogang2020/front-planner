<template>
  <div class="Mine">
    <van-nav-bar v-show="is_weixin"  title="详情" />
    <div class="content" >
      <van-cell-group>
        <van-field v-model="form.operatorName" label="渠道名称:" />
        <van-field v-model="form.operatorLoginName" label-width="2.4rem" label="资金账户状态:" />
        <van-field v-model="form.operatorPhone" label="用户编号:"  />
        <van-field v-model="form.idCard" label="用户名称:" />
        <van-field v-model="form.operatorStatusDesc"  label="用户类型:" />
        <van-field v-model="form.department"  label="证件号:" />
        <van-field v-model="form.duty"  label="开户银行:" />
        <van-field v-model="form.duty"  label="账户名称:" />
        <van-field v-model="form.duty"  label="银行卡卡号:" />
        <van-field v-model="form.duty" label-width="2.4rem"  label="渠道账户名称:" />
        <van-field v-model="form.duty"  label="渠道账号:" />
      </van-cell-group>

    </div>
     <div class="secondBtn">
        <van-button type="default" class="pre" @click="cancel">返 回</van-button>
      </div>
    
  </div>
</template>

<script>
import {validMobileNo, validIdCard, validLoginName } from "@/utils/validate";
export default {
  name: "Mine",
  data() {
    return {
      form:{},
      idTypeList: [],
      showCardType:false,
      is_weixin:false,
    };
  },

  created() {
    var _this = this;
    _this.getOperatorDetail();
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
    //获取操作员信息
    getOperatorDetail(){
      var _this = this;
      var params = {'operatorGuid':sessionStorage.getItem("operatorguid")};
      this.$http.get("/api/members/operator/getOperatorDetail",{params:params}).then(function (res) {
        var data = res.data;
        if (data.code == 0) {
          _this.form = data.data.operatorVo;
          _this.idTypeList = data.data.zjTypeList;
          _this.form.gender = (data.data.operatorVo.gender).toString();
        } else {
          _this.$toast(data.msg);
        }
      })
    },
    

    //返回
    cancel(){
      var _this = this;
      _this.$router.go(-1);
    },

  }
};
</script>

<style>
.Mine .edit {
  top: 0.2rem;
}
.Mine .van-nav-bar__left .van-icon{
  top: 0;
}
.Mine .van-nav-bar .van-icon {
  color: #333;
}
.Mine .van-nav-bar__left {
  left: 0;
}
.Mine .van-nav-bar__text{
  color: #333;
}
.Mine .content .van-cell {
  width: 7.5rem;
  height: 1rem;
  line-height: 0.6rem;
  font-size: 0.3rem;
  margin-bottom: 0.1rem;
}
.Mine .content .van-cell-group {
  background: transparent;
  margin-top: 0.1rem;
}
.Mine .van-cell:not(:last-child)::after{
  border-bottom: none !important;
}
.Mine .van-hairline--top::after {
  border-top-width: 0px !important;
}
.Mine .van-radio-group{
  background: #fff;
  float: right;
}
.Mine .van-radio{
  float: left;
  margin-left: 0.5rem;
  margin-top: 0.1rem;
}
.Mine .van-field__control {
  text-align: right;
}
.Mine .van-action-sheet {
  max-height: 40%;
}
.Mine .van-picker__confirm {
  color: #ed2424;
}
.Mine .van-picker__cancel {
  color: #666;
}
.Mine .van-button--danger {
  color: #fff;
  background-color: #ed2424;
  border: 1px solid #ed2424;
}
.Mine .secondBtn{
  width: 1.5rem;
  margin: 0 auto;
}
.Mine .secondBtn .van-button{
  width: 1.5rem;
  height: 0.7rem;
  line-height: 0.7rem;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.Mine{
  width: 7.5rem;
  font-size: 0.3rem;
}
.content{
  padding-bottom: 1rem;
}
.list {
  height: 1rem;
  background: #fff;
  padding: 0.2rem;
  border-bottom: 0.01rem solid #f3f3f3;
  font-size: 0.32rem;
  color: #252f3f;
  line-height: 1rem;
  letter-spacing: 0.01rem;
}
.sex{
  color: #323233;
  line-height: 1rem;
  margin: 0 0.3rem;
}
</style>
