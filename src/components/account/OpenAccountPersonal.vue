<template>
  <div class="openAccount">
    <van-nav-bar v-show="is_weixin" title="绑定银行卡" left-text="返回" left-arrow @click-left="cancel"/>
    <div>
      <van-cell-group>
        <van-field v-model="form.memberCode" label="用户编号:" readonly />
        <van-field v-model="form.memberFullName" label="用户名称:" readonly />
        <van-field v-model="form.memberTypeDesc" label="用户类型:" readonly />
        <van-field v-model="form.idCardTypeDesc" label="证件类型:" readonly />
        <van-field v-model="form.idCard" label="证件号:" readonly />
        <van-field v-model="form.accountName" required label="账户名称:" placeholder="请输入账户名称" />
        <van-field v-model="form.bankName" required label="开户银行:"  clickable  placeholder="请输入银行名称进行搜索" right-icon="search" @click-right-icon="searchBank"/>
        <van-field v-model="form.cardAccount" required label="银行卡卡号：" placeholder="请输入银行卡卡号" />
        <!-- 开户银行选择器 -->
        <van-popup v-model="bankArray" position="bottom">
          <van-picker
            show-toolbar
            :columns="bankList"
            value-key="bankName"
            @cancel="bankArray = false"
            @confirm="onConfirm"
          />
        </van-popup>
      </van-cell-group>
      
    </div>
    <div class="Btn">
      <van-button type="danger" class="sure" @click="openAccount">确 认</van-button>
      <van-button type="default" class="sure" @click="cancel">取 消</van-button>
    </div>
    <p class="tips">温馨提示：银行卡绑定完成后请重新进入平台进行下一步操作</p>
    <div id="thirdPayHtml" style="display:none;"></div>
  </div>
</template>

<script>
export default {
  name: "OpenAccountPersonal",
  data() {
    return {
      idTypeList:[],
      form:{
        memberGuid:'',
        memberCode: "",
        memberFullName: "",
        memberType: "",
        memberTypeDesc:'',
        idCardType:'',
        idCardTypeDesc:'',
        idCard:'',
        bankName:'',
        baseBankChannelId:'',
        accountName:'',
        cardAccount:'',
        bankChannel: 1,//目前只有贵州场外
      },
      show: false,
      bankList: [],
      bankArray: false,
      is_weixin:false,
    };
  },
  created(){
    var _this = this;
    _this.getMemberBasicInfo();
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
    //获取会员基本信息
    getMemberBasicInfo(){
      var _this = this;
      var memberGuid = _this.$route.query.memberGuid;
      _this.$http.get("/api/member/getMemberBasicInfo",{params:{memberGuid:memberGuid}}).then(function (res) {
        var data = res.data;
        if (data.code == 0) {
          _this.idTypeList = data.data.zjTypeList;
          _this.form.memberGuid = data.data.membersVo.memberGuid;
          _this.form.memberCode = data.data.membersVo.memberCode;
          _this.form.memberFullName = data.data.membersVo.memberFullName;
          _this.form.accountName = data.data.membersVo.memberFullName;
          _this.form.idCard = data.data.membersVo.idCard;
          _this.form.idCardType = data.data.membersVo.idCardType;
          _this.form.memberType = data.data.membersVo.memberType;
          _this.form.memberTypeDesc = data.data.membersVo.memberTypeDesc;
          //获取证件类型
          for(var i=0; i<_this.idTypeList.length; i++){
            if(_this.form.idCardType == _this.idTypeList[i].id){
              _this.form.idCardTypeDesc = _this.idTypeList[i].typeName;
              break;
            }
          }
        } else {
          _this.$toast(data.msg);
        }
      })
    },
    openBank() {
      var _this = this;
      _this.show = true;
    },
    //查询银行信息
    searchBank(){
      var _this = this;
      if(_this.form.bankName){
        var bankChannel = 1;//目前只有贵州场外
        _this.$http.get("/api/sys/bank/search",{params:{'bankName':_this.form.bankName,"memberType":_this.form.memberType,"bankChannel":bankChannel}}).then(function(res){
          var data = res.data;
          _this.bankLoading = false;
          if(data.code==0){
            _this.bankList = data.data;
          }
        })
        _this.bankArray = true;
      }else{
        _this.$toast("请输入开户银行名称");
      }
    },

    onConfirm(value) {
      var _this = this;
      _this.form.bankName = value.bankName;
      _this.form.baseBankChannelId = value.id;
      _this.bankArray = false;
    },

    //开户
    openAccount(){
      var _this = this;
      //校验
      if (_this.form.accountName == "") {
        _this.$toast("请填写账户名称");
        return;
      }
      if (_this.form.baseBankChannelId == "") {
        _this.$toast("请选择开户银行");
        return;
      }
      if (_this.form.cardAccount == "") {
        _this.$toast("请填写银行卡卡号");
        return;
      }
      _this.$http.post("/api/planner/member/cust/openacc",_this.form).then(function(res){
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

    },
    //取消
    cancel(){
      var _this = this;
      _this.$router.go(-1);
    },

  }
};
</script>
<style>
.openAccount .van-button {
  width: 1.3rem;
  height: 0.7rem;
  line-height: 0.7rem;
  cursor: pointer;
}
.openAccount .van-nav-bar .van-icon{
  color: #333;
}
.openAccount .van-nav-bar__text{
  color: #333;
}
.openAccount .van-nav-bar__left{
  left: 0;
}
.openAccount .van-cell {
  width: 7.5rem;
  height: 1rem;
  line-height: 0.6rem;
  font-size: 0.3rem;
  margin-bottom: 0.1rem;
}
.openAccount .van-cell-group {
  background: transparent;
}
.openAccount .van-button--danger {
  color: #fff;
  background-color: #ed2424;
  border: 1px solid #ed2424;
}
.openAccount .van-action-sheet {
  max-height: 40%;
}
.openAccount .van-picker__confirm{
  color:#ed2424;
}
.openAccount .van-picker__cancel{
  color: #666;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.openAccount {
  width: 7.5rem；;
}
.openAccount p {
  color: #333;
  font-size: 0.3rem;
  line-height: 0.6rem;
  margin-bottom: 0.2rem;
}
.Btn {
  text-align: center;
}
.sure{
  width: 1.5rem
}
.openAccount .tips{
  color: #848080;
  font-size: 0.24rem;
  margin-left: 0.5rem;
  margin-top: 0.4rem;
}
</style>
