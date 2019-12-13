<template>
  <div class="organWait">
    <van-nav-bar v-show="is_weixin" title="待审核" />
    <div>
        <div class="titleDes">
        <p class="status">用户您好，您的资料已提交审核，您的审核状态为：<span style='font-size:0.32rem;color:#ed2424'>{{form.memberStatusDesc}}</span></p>
      </div>
      <van-tabs @click="onClick">
        <van-tab title="基本信息">
          <div >
            <van-cell-group class="text">
              <van-field v-model="form.memberFullName" disabled label="企业全称:" />
              <van-field v-model="form.memberName" label="企业简称:" disabled/>
              <van-field v-model="form.companyCreditCode" required disabled label-width="2.7rem" label="统一社会信用代码:" />
              <van-field v-model="form.companyTypeDesc" required label="企业类型:" disabled clickable />
              <van-field v-model="form.legalMan" required disabled label="企业法人:"/>
              <van-field v-model="form.legalIdCardTypeDesc" required disabled label="法人证件类型:" label-width="2.6rem" />
              <van-field v-model="form.legalIdCard" required label="法人证件号:" disabled/>
              <van-field v-model="form.openTimeStr" label="成立时间:"  disabled />
              <van-field v-model="form.totalAssets" label="总资产(亿):" disabled />
              <van-field v-model="form.netAssets" label="净资产(亿):" disabled />
              <van-field v-model="form.fundsSources" label="资金来源:" disabled />
              <van-field v-model="form.address" label="注册地址:" disabled  />
              <van-field v-model="form.memberAddress" label="详细地址:" disabled />
            </van-cell-group>
            <van-field v-model="form.businessScope" rows="1" class='textarea' type="textarea" autosize disabled label="业务经营范围:" label-width="2.4rem"  placeholder="请输入业务经营范围" />
          </div>
          <div class="text" style="margin-top:0.1rem">
            <van-field v-model="form.operatorName" required label="业务负责人:" disabled/>
            <van-field v-model="form.operatorIdTypeDesc" required label="业务负责人证件:" label-width="2.6rem" disabled  />
            <van-field v-model="form.operatorIdCard" required label="业务负责人证件号:" label-width="2.6rem" disabled/>
            <van-field v-model="form.memberPhone" label="手机号:"  disabled/>
            <van-field v-model="form.operatorLoginName" required label="登录名:" disabled />
          </div>
        </van-tab>
        <van-tab title="证明文件">
          <div class="ImgBox clear">
            <div class="file  fl">
              <van-uploader v-model="yyzzFileList" :disabled="true" :deletable='false' :max-count="1"/>
              <p>营业执照</p>
            </div>
            <div class="file fr">
              <van-uploader v-model="sqwtsFileList" :disabled="true" :deletable='false' :max-count="1"/>
              <p>授权人委托书</p>
            </div>
            <div class="file fl">
              <van-uploader v-model="positiveFileList" :disabled="true" :deletable='false' :max-count="1"/>
              <p>身份证正面</p>
            </div>
            <div class="file fr">
              <van-uploader v-model="reverseFileList" :disabled="true" :deletable='false' :max-count="1"/>
              <p>身份证反面</p>
            </div>
            <div class="file fl">
              <van-uploader v-model="otherFileList" :disabled="true" :deletable='false' :max-count="1"/>
              <p>其他</p>
            </div>
            
          </div>
        </van-tab>
      </van-tabs>
      <p class="logOut" @click="logOut">退出登录</p>
    </div>
  </div>
</template>
<script>
export default {
  name: "OrganCheckWait",
  data() {
    return {
      positiveFileList: [
        { url: '' },
      ],
      reverseFileList: [
        { url: '' },
      ],
      yyzzFileList: [
        { url: '' },
      ],
      sqwtsFileList: [
        { url: '' },
      ],
      otherFileList: [
        { url: '' },
      ],
      form:{},
      is_weixin:false,
    }
  },

  created() {
    var _this = this;
    _this.getDetail();
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
    //选项卡切换
    onClick(name, title) {
    },
    // 获取数据
    getDetail(){
        var _this = this;
        var guid = sessionStorage.getItem('guid')
        _this.$http.get("/api/member/getMemberDetail",{params:{memberGuid:guid}}).then(function (res) {
          var data = res.data;
          if (data.code == 0) {
            _this.form = data.data.membersVo;
            var zjTypeListArr = data.data.zjTypeList;
            for(var i = 0; i < zjTypeListArr.length; i++){
              if (zjTypeListArr[i].id==data.data.membersVo.legalIdCardType){
                _this.form.legalIdCardTypeDesc = zjTypeListArr[i].typeName;
                break;
              }
            }
            var address = "";
            if(data.data.membersVo.districtName){
              address = _this.form.provinceName + "/" + _this.form.cityName + "/" + _this.form.districtName;
            }
            _this.form.idTypeDesc = data.data.membersVo.operatorIdTypeDesc;
            _this.form.address = address;
            _this.yyzzFileList[0].url = "http://"+ data.data.membersVo.yyzzFilePathFull;
            _this.sqwtsFileList[0].url = "http://"+ data.data.membersVo.sqwtsFilePathFull;
            _this.positiveFileList[0].url = "http://"+ data.data.membersVo.fzrPositiveFilePathFull;
            _this.reverseFileList[0].url = "http://"+ data.data.membersVo.fzrNegativeFilePathFull;
            if(data.data.membersVo.otherFilePathFull){
              _this.otherFileList[0].url = "http://"+ data.data.membersVo.otherFilePathFull;
            }else{
              _this.otherFileList[0].url = ''
            }
          } else {
            _this.$toast(data.msg);
          }
        })
    },
    // 退出登录
    logOut() {
      var _this = this;
      _this.$http.get("/api/members/operator/logOut",{params:{token:sessionStorage.getItem("token")}}).then(function (res) {
        var data = res.data;
        if (data.code == 0) {
          sessionStorage.removeItem("token")
          _this.$router.push({  
            path:'/login',   
          }) 
        } else {
         _this.$toast(data.msg);
        }
      }) 
    }
    
  }

}
</script>
<style>
.organWait .van-button {
  height: 0.7rem;
  line-height: 0.7rem;
  cursor: pointer;
}
.organWait .van-nav-bar .van-icon{
  color: #333;
}
.organWait .van-nav-bar__text{
  color: #333;
}
.organWait .van-nav-bar__left{
  left: 0;
}
.organWait .text .van-cell {
  width: 7.5rem;
  height: 1rem;
  line-height: 0.6rem;
  font-size: 0.3rem;
  margin-bottom: 0.1rem;
}
.organWait .textarea {
  width: 7.5rem;
  min-height: 1rem;
  line-height: 0.6rem;
  font-size: 0.3rem;
}
.organWait .textarea .van-field__control{
  min-height: 1rem;
  line-height: 0.6rem;
}
.organWait .van-cell-group {
  background: transparent;
}
.organWait .van-button--danger {
  color: #fff;
  background-color: #ed2424;
  border: 1px solid #ed2424;
}
.organWait .van-action-sheet {
  max-height: 40%;
}
.organWait .van-picker__confirm{
  color:#ed2424;
}
.organWait .van-picker__cancel{
  color: #666;
}
.organWait .van-field__control{
  text-align: right;
}
.organWait .van-tabs__wrap {
  margin-bottom: 0.3rem;
}
.organWait .van-uploader__upload {
  width: 2rem;
  height: 2rem;
  margin: 0;
}
.organWait .van-uploader {
  margin-left: 0.5rem;
  width: 2rem;
  height: 2rem;
}
.organWait .van-uploader__wrapper {
  width: 2rem;
  height: 2rem;
}
.organWait .van-uploader__input {
  width: 2rem;
  height: 2rem;
}
.organWait .van-uploader__preview-image {
  width: 2rem;
  height: 2rem;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.organWait {
  width: 7.5rem;
  padding-bottom: 1rem;
}
.organWait p {
  color: #333;
  font-size: 0.3rem;
  line-height: 0.6rem;
  margin-bottom: 0.2rem;
  text-align: center;
}
.titleDes{
  background: #fff;
  padding: 0 0.2rem;
  box-sizing: border-box;
}
.titleDes p{
  text-align: left;
}
.file {
  width: 3rem;
  height: 3rem;
  position: relative;
}
.file p {
  position: absolute;
  bottom: 0;
  left: 0.7rem;
}
.organWait a{
  color: #fff;
}
.file img{
  width: 2rem;
  height: 2rem;
  margin-left: 0.5rem;
}
.organWait .logOut {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 999;
  width: 7.5rem;
  height: 0.8rem;
  background: #252f3f;
  color: #fff;
  font-size: 0.32rem;
  text-align: center;
  margin: 0;
  line-height: 0.8rem;
}
</style>
