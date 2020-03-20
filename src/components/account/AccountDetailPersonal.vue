<template>
  <div class="accountDetail">
    <van-nav-bar v-show="is_weixin" title="银行卡管理" left-text="返回" left-arrow @click-left="cancel"/>
    <div>
      <van-cell-group>
        <p class="changeTitle" v-if="form.accountStatus==3" @click="changes">变更</p>
        <van-field v-model="form.agencyName" disabled label="银行渠道:" />
        <van-field v-model="form.memberCode" disabled label="用户编号:" />
        <van-field v-model="form.memberFullName" disabled label="用户名称:"  />
        <van-field v-model="form.memberTypeDesc" disabled label="用户类型:" />
        <van-field v-model="form.idCard" disabled label="用户身份证:" label-width="2.4rem"/>
        <van-field v-model="form.bankName" disabled label="开户银行:" />
        <van-field v-model="form.accountName" disabled label="账户名称:" />
        <van-field v-model="form.cardAccount" disabled label="银行卡卡号:" label-width="2.4rem"/>
        <van-field v-model="form.channelAccountName" disabled label="渠道账户名称:" label-width="2.4rem"/>
        <van-field v-model="form.channelCardAccount" disabled label="渠道账号:" />
      </van-cell-group>
      <div class="Btn">
          <van-button type="danger" class="back" @click="cancel">返 回</van-button>
      </div>
    </div>
    <van-overlay :show="show" @click="show = false">
      <div class="wrapper" @click.stop>
        <div class="block" >
          <div v-show="!bankPhoneShow">
            <p class="change" @click="initChangeCard(1)">变更银行卡</p>
            <p class="change" @click="initChangeCard(2)">变更银行预留手机号</p>
          </div>
          <div v-show="bankPhoneShow">
            <van-field v-model="changeCardForm.bankPhone" required label-width="2.4rem" label="银行预留手机号:" placeholder="请输入银行预留手机号" style="width:6.5rem"/>
            <div class="Btn">
                <van-button type="danger" class="back" @click="selectChange">变 更</van-button>
                <van-button type="danger" class="back" @click="cancelChange">取 消</van-button>
            </div>
            <div id="thirdPayHtml" style="display:none;"></div>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>
<script>
import {validMobileNo } from "@/utils/validate";
export default {
  name: "AccountDetailPersonal",
  data() {
    return {
      form: {},
      changeCardForm: {
        bankPhone:'',
        memberGuid:'',
        bankChannel:'',
        changeAccountType:'',
      },
      is_weixin:false,
      show:false,
      bankPhoneShow:false,
    };
  },
  created() {
    var _this = this;
    _this.getAccountDetail();
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
    //资金账户详情查询
    getAccountDetail(){
      var _this = this;
      var bankChannel = 1;//目前只有贵州场外
      var memberGuid = _this.$route.query.memberGuid;
      _this.$http.get("/api/planner/member/cust/search/detail",{params:{bankChannel:bankChannel,memberGuid:memberGuid}}).then(function (res) {
        var data = res.data;
        if (data.code == 0) {
          _this.changeCardForm.memberGuid = memberGuid;
          _this.form = data.data.membersAccountVo;
        } else {
          _this.$toast(data.msg);
        }
      })
      
    },
    //变更按钮
    changes(){
      var _this = this;
      _this.show = true;
      _this.bankPhoneShow = false;
    },
    //初始化变更银行卡或手机号
    initChangeCard(type){
        var _this = this;
        _this.changeCardForm.changeAccountType = type;
        _this.changeCardForm.bankPhone = '';
        _this.bankPhoneShow = true;
    },
    //换卡取消
    cancelChange(){
      var _this= this;
      _this.changeCardForm.bankPhone = '';
      _this.changeCardForm.bankChannel = '';
      _this.changeCardForm.changeAccountType = '';
      _this.bankPhoneShow = false;
    },
    //变更
    selectChange(){
      var _this= this;
      if(_this.changeCardForm.changeAccountType == 1){
        //换卡
        _this.changeCard();
      }else{
        //换手机号
        _this.changeMobileNo();
      }
    },
    //变更银行卡
    changeCard() {
      var _this = this;
      if(_this.checkRequired()){
        _this.changeCardForm.bankChannel = 1;//目前只有贵州场外
        _this.$http.post("/api/planner/member/cust/change/card",_this.changeCardForm).then(function(res){
          var data =res.data;
          if(data.code == 0) {
            var resultHtml = data.data;
            var thirdPayHtml = document.getElementById("thirdPayHtml");
            thirdPayHtml.innerHTML = resultHtml;
            var thirdHtmlForm = document.getElementById("thirdHtmlForm");
            thirdHtmlForm.submit();
            thirdPayHtml.innerHTML = '';
          } else {
            _this.$toast(data.msg);
          }
        });
      }
    },
    //变更手机号
    changeMobileNo() {
      var _this = this;
      if(_this.checkRequired()){
        _this.changeCardForm.bankChannel = 1;//目前只有贵州场外
        _this.$http.post("/api/planner/member/cust/change/bankphone",_this.changeCardForm).then(function(res){
          var data =res.data;
          if(data.code == 0) {
            var resultHtml = data.data;
            var thirdPayHtml = document.getElementById("thirdPayHtml");
            thirdPayHtml.innerHTML = resultHtml;
            var thirdHtmlForm = document.getElementById("thirdHtmlForm");
            thirdHtmlForm.submit();
            thirdPayHtml.innerHTML = '';
          } else {
            _this.$toast(data.msg);
          }
        });
      }
    },
    //检验必填项
    checkRequired(){
      var _this = this;
      if (_this.changeCardForm.bankPhone == "") {
        _this.$toast("请填写银行预留手机号");
        return false;
      }
      if (!validMobileNo(_this.changeCardForm.bankPhone)) {
        _this.$toast("请填写正确的手机号");
        return false;
      }
      return true;
    },

    cancel(){
      var _this = this;
      _this.$router.go(-1);
    },
  }
};
</script>
<style>
.accountDetail .van-button {
  height: 0.7rem;
  line-height: 0.7rem;
  cursor: pointer;
}
.accountDetail .van-nav-bar__left{
  left: 0;
}
.accountDetail .van-nav-bar .van-icon {
  color: #333;
}
.accountDetail .van-nav-bar__text {
  color: #333;
}
.accountDetail .van-cell {
  width: 7.5rem;
  height: 1rem;
  line-height: 0.6rem;
  font-size: 0.3rem;
  margin-bottom: 0.1rem;
}
.accountDetail .van-cell-group {
  background: transparent;
  margin-top: 0.1rem;
}
.accountDetail .van-button--danger {
  color: #fff;
  background-color: #ed2424;
  border: 1px solid #ed2424;
}
.accountDetail .van-field__control {
  text-align: right;
}
.accountDetail .wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  top: 50%;
  height:3rem;
  margin-top:-1.5rem;
}
.accountDetail .block {
  width: 6.5rem;
  height: 3rem;
  background-color: #fff;
}
.accountDetail .van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after{
  border-width: 0;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.accountDetail {
  width: 7.5rem;
  padding-bottom: 0.5rem;
}
.accountDetail p {
  color: #333;
  font-size: 0.3rem;
  line-height: 0.6rem;
  margin-bottom: 0.2rem;
  text-align: center;
}
.Btn {
  text-align: center;
}
.back{
  width: 1.5rem;
}
.change{
  width: 6rem;
  height: 0.8rem;
  color: #fff;
  text-align: center;
  margin: 0.2rem auto;
  line-height: 0.8rem;
}
.accountDetail .changeTitle{
    width: 1.2rem;
    height: 0.6rem;
    background: red;
    font-size: 0.3rem;
    line-height: 0.6rem;
    float: right;
    margin-right: 0.3rem;
    color: #fff;
    border-radius: 0.04rem;
}
.accountDetail .change{
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
