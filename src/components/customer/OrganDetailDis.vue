<template>
  <div class="organDetail">
    <van-nav-bar v-show="is_weixin" title="客户详情" left-text="返回" left-arrow @click-left="cancel"/>
    <div>
        
      <van-tabs @click="onClick">
        <van-tab title="基本信息">
          <div >
            <van-cell-group class="text">
              <van-field v-model="form.memberCode" disabled label="用户编号:" />
              <van-field v-model="form.memberStatusDesc" disabled label="状态:" />
              <van-field v-model="form.memberFullName" required :disabled="is_disabled" label="企业全称:" />
              <van-field v-model="form.memberName" label="企业简称:" :disabled="is_disabled" />
              <van-field v-model="form.companyCreditCode" required :disabled="is_disabled" label-width="2.7rem" label="统一社会信用代码:" />
              <van-field v-model="form.companyTypeDesc" required label="企业类型:" :disabled="is_disabled" />
              <van-field v-model="form.legalMan" required :disabled="is_disabled" label="企业法人:" />
              <van-field v-model="form.legalIdCardTypeDesc"  label="法人证件类型:" label-width="2.6rem" :disabled="is_disabled" />
              <van-field v-model="form.legalIdCard" required label="法人证件号:" label-width="2.6rem" :disabled="is_disabled" />
              <van-field v-model="form.openTime" label="成立时间:"  :disabled="is_disabled" />
              <van-field v-model="form.totalAssets" label="总资产(亿):" :disabled="is_disabled" />
              <van-field v-model="form.netAssets" label="净资产(亿):" :disabled="is_disabled" />
              <van-field v-model="form.fundsSources" label="资金来源:" :disabled="is_disabled" />
              <van-field v-model="form.address" label="注册地址:" :disabled="is_disabled"  />
              <van-field v-model="form.memberAddress" label="详细地址:" :disabled="is_disabled" />
            </van-cell-group>
            <van-field v-model="form.businessScope" rows="1" class='textarea' type="textarea" autosize :disabled="is_disabled" label="业务经营范围:" label-width="2.4rem"   />
          </div>
          <div class="text" style="margin-top:0.1rem">
            <van-field v-model="form.operatorName" required label="业务负责人:" label-width="2.6rem" :disabled="is_disabled"  />
            <van-field v-model="form.operatorIdTypeDesc" required label="证件类型:"  :disabled="is_disabled" clickable  />
            <van-field v-model="form.operatorIdCard" required label="业务负责人证件号:" label-width="2.6rem" :disabled="is_disabled" />
            <van-field v-model="form.memberPhone" label="手机号:"  :disabled="is_disabled" />
            <van-field v-model="form.operatorLoginName" required label="登录名:" :disabled="is_disabled"  />
          </div>
        </van-tab>
        <van-tab title="证明文件">
          <div class="ImgBox clear">
            <div class="file  fl">
              <van-uploader v-model="yyzzFileList"  :disabled="is_disabled" :max-count="1"  :deletable="is_del"/>
              <p>营业执照</p>
            </div>
            <div class="file fr">
              <van-uploader v-model="sqwtsFileList" :disabled="is_disabled" :max-count="1"  :deletable="is_del"/>
              <p>授权人委托书</p>
            </div>
            <div class="file idCardPositive fl">
              <van-uploader v-model="positiveFileList" :disabled="is_disabled" :max-count="1" :deletable="is_del"/>
              <p>负责人身份证正面</p>
            </div>
            <div class="file idCardPositive fr">
              <van-uploader v-model="reverseFileList"  :max-count="1" :deletable="is_del"/>
              <p>负责人身份证反面</p>
            </div>
            <div class="file fl" v-show="showOtherPic">
              <van-uploader v-model="otherFileList" :disabled="is_disabled" :max-count="1"  />
              <p>其他</p>
            </div>
            
          </div>
        </van-tab>
      </van-tabs>
     
    </div>
   
  </div>
</template>
<script>
import OSS from "ali-oss";
import { validMobileNo,validIdCard,validLoginName } from "@/utils/validate";
import {dateCommonFormat } from '@/utils/common';
export default {
  name: "OrganDetailDis",
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
      minDate:new Date(1970, 10, 1),
      currentDate: new Date(),
      form:{
        isSubmit: 2,
      },
      reviewForm: {
        memberGuid:'',
        reviewStatus: '',
        reviewOpinion: '',
      },
      companyTypeList:[],
      areaList:{},
      idTypeList:[],
      is_weixin:false,
      
      showCardType: false,
      is_disabled: true,
      is_del:false,
      showOtherPic:true,
    }
  },

  created() {
    var _this = this;
    _this.getDetail();
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
    //选项卡切换
    onClick(name, title) {
    },
    
    // 获取数据
    getDetail(){
        var _this = this;
        var memberGuid = _this.$route.params.memberGuid;
        _this.$http.get("/api/member/getMemberDetail",{params:{memberGuid:memberGuid}}).then(function (res) {
          var data = res.data;
          if (data.code == 0) {
            _this.reviewForm.memberGuid = memberGuid;
            _this.form = data.data.membersVo;
            _this.companyTypeList = data.data.companyTypeList;
            _this.idTypeList = data.data.zjTypeList;
            //获取企业类型
            for(var i=0; i<_this.companyTypeList.length; i++){
              if(_this.form.companyType == _this.companyTypeList[i].id){
                _this.form.companyTypeDesc = _this.companyTypeList[i].typeName;
                break;
              }
            }
            //获取法人证件类型
            for(var i=0; i<_this.idTypeList.length; i++){
              if(_this.form.legalIdCardType == _this.idTypeList[i].id){
                _this.form.legalIdCardTypeDesc = _this.idTypeList[i].typeName;
                break;
              }
            }
            var address = "";
            if(data.data.membersVo.districtName){
              address = _this.form.provinceName + "/" + _this.form.cityName + "/" + _this.form.districtName;
            }
            _this.form.idTypeDesc = data.data.membersVo.operatorIdTypeDesc;
            _this.form.address = address;
            if(data.data.membersVo.openTime){
              _this.form.openTime = dateCommonFormat(data.data.membersVo.openTime);
            }else{
              _this.form.openTime = "";
            }
            _this.yyzzFileList[0].url = "http://"+ data.data.membersVo.yyzzFilePathFull;
            _this.sqwtsFileList[0].url = "http://"+ data.data.membersVo.sqwtsFilePathFull;
            _this.positiveFileList[0].url = "http://"+ data.data.membersVo.fzrPositiveFilePathFull;
            _this.reverseFileList[0].url = "http://"+ data.data.membersVo.fzrNegativeFilePathFull;
            if(data.data.membersVo.otherFilePathFull){
              _this.otherFileList[0].url = "http://"+ data.data.membersVo.otherFilePathFull;
            }else{
              _this.otherFileList = [];
              _this.showOtherPic = false;
            }
          } else {
            _this.$toast(data.msg);
          }
        })
    },
   
     //返回
    cancel() {
      var _this = this;
      _this.$router.go(-1);
    }
    
  }

}
</script>
<style>
.organDetail .van-button {
  height: 0.7rem;
  line-height: 0.7rem;
  cursor: pointer;
}
.organDetail .van-nav-bar .van-icon{
  color: #333;
}
.organDetail .van-nav-bar__text{
  color: #333;
}
.organDetail .van-nav-bar__left{
  left: 0;
}
.organDetail .text .van-cell {
  width: 7.5rem;
  height: 1rem;
  line-height: 0.6rem;
  font-size: 0.3rem;
  margin-bottom: 0.1rem;
}
.organDetail .textarea {
  width: 7.5rem;
  min-height: 1rem;
  line-height: 0.6rem;
  font-size: 0.3rem;
}
.organDetail .textarea .van-field__control{
  min-height: 1rem;
  line-height: 0.6rem;
}
.organDetail .van-cell-group {
  background: transparent;
}
.organDetail .van-button--danger {
  color: #fff;
  background-color: #ed2424;
  border: 1px solid #ed2424;
}
.organDetail .van-action-sheet {
  max-height: 40%;
}
.organDetail .van-picker__confirm{
  color:#ed2424;
}
.organDetail .van-picker__cancel{
  color: #666;
}
.organDetail .van-field__control{
  text-align: right;
}
.organDetail .van-tabs__wrap {
  margin-bottom: 0.3rem;
}
.organDetail .van-uploader__upload {
  width: 2rem;
  height: 2rem;
  margin: 0;
}
.organDetail .van-uploader {
  margin-left: 0.5rem;
  width: 2rem;
  height: 2rem;
}
.organDetail .van-uploader__wrapper {
  width: 2rem;
  height: 2rem;
}
.organDetail .van-uploader__input {
  width: 2rem;
  height: 2rem;
}
.organDetail .van-uploader__preview-image {
  width: 2rem;
  height: 2rem;
}
.idCardPositive p{
  left: 0.5rem;
}
.organDetail .secondBtn .van-button{
  width: 1.5rem;
  height: 0.7rem;
  line-height: 0.7rem;
}
.organDetail .van-dialog__header{
  padding-top: 0.1rem;
}
.organDetail .van-dialog__confirm{
  color:#ed2424;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.organDetail {
  width: 7.5rem;
  padding-bottom: 1rem;
}
.organDetail p {
  color: #333;
  font-size: 0.3rem;
  line-height: 0.6rem;
  margin-bottom: 0.2rem;
  text-align: center;
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
.idCardPositive p{
  left: 0.5rem;
}
.organDetail a{
  color: #fff;
}
.file img{
  width: 2rem;
  height: 2rem;
  margin-left: 0.5rem;
}
.secondBtn{
  width: 7rem;
  margin: 0 auto;
  text-align: center;
}

</style>
