<template>
  <div class="personalDetail">
    <van-nav-bar v-show="is_weixin" title="客户详情" left-text="返回" left-arrow @click-left="cancel"/>
    <div>
      <van-tabs @click="onClick" sticky>
        <van-tab title="基本信息">
          <van-cell-group class="text">
            <van-field v-model="form.memberCode" disabled label="用户编号:" />
            <van-field v-model="form.memberStatusDesc" disabled label="状态:" />
            <van-field v-model="form.memberFullName" :disabled="is_disabled" label="姓名:" required />
            <van-field v-model="form.memberPhone" :disabled="is_disabled" label="手机号:" />
            <van-field v-model="form.operatorLoginName" :disabled="is_disabled" required label="登录名:"  />
            <van-field
              v-model="form.idTypeDesc"
              required
             
              label="证件类型:"
              :disabled="is_disabled"
             
            />
            <van-field v-model="form.idCard" required :disabled="is_disabled" label="证件号:" />
            <van-field
              :value="form.address"
              label="地址:"
            
              :disabled="is_disabled"
            />
            <van-field v-model="form.memberAddress" :disabled="is_disabled" label="详细地址:" />
          </van-cell-group>
        </van-tab>
        <van-tab title="证明文件">
          <div class="ImgBox clear">
            <div class="file idCardPositive fl">
              <van-uploader v-model="positiveFileList"  :disabled="is_disabled" :max-count="1"  :deletable="is_del"  />
              <p>身份证正面</p>
            </div>
            <div class="file idCardReverse fr">
              <van-uploader v-model="reverseFileList" :disabled="is_disabled" :max-count="1"  :deletable="is_del"/>
              <p>身份证反面</p>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
   
  </div>
</template>
<script>
import OSS from "ali-oss";
import {validMobileNo, validIdCard, validLoginName } from "@/utils/validate";
export default {
  name: "PersonalDetailDis",
  data() {
    return {
      idTypeList:[],
      areaList:{},
      form: {
        isSubmit: 2,
      },
      reviewForm: {
        memberGuid:'',
        reviewStatus: '',
        reviewOpinion: '',
      },
      positiveFileList: [
        { url: '' },
      ],
      reverseFileList: [
        { url: '' },
      ],
      is_weixin:false,
      is_disabled: true,
      is_del:false,
    };
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
    onClick(name, title) {
    },
    //获取数据
    getDetail(){
      var _this = this;
      var memberGuid = _this.$route.params.memberGuid;
      this.$http.get("/api/member/getMemberDetail",{params:{memberGuid:memberGuid}}).then(function (res) {
        var data = res.data;
        if (data.code == 0) {
          _this.idTypeList = data.data.zjTypeList;
          _this.reviewForm.memberGuid = memberGuid;
            _this.form = data.data.membersVo;
            var address = "";
            if(data.data.membersVo.districtName){
              address = _this.form.provinceName + "/" + _this.form.cityName + "/" + _this.form.districtName;
            }
            _this.form.idTypeDesc = data.data.membersVo.operatorIdTypeDesc;
            _this.form.address = address;
            _this.positiveFileList[0].url = "http://"+ data.data.membersVo.fzrPositiveFilePathFull;
            _this.reverseFileList[0].url = "http://"+ data.data.membersVo.fzrNegativeFilePathFull;
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
};
</script>
<style>
.personalDetail .van-button {
  height: 0.7rem;
  line-height: 0.7rem;
  cursor: pointer;
}
.personalDetail .van-nav-bar .van-icon {
  color: #333;
}
.personalDetail .van-nav-bar__text {
  color: #333;
}
.personalDetail .van-nav-bar__left {
  left: 0;
}
.personalDetail .text .van-cell {
  width: 7.5rem;
  height: 1rem;
  line-height: 0.6rem;
  font-size: 0.3rem;
  margin-bottom: 0.1rem;
}
.personalDetail .van-cell-group {
  background: transparent;
}
.personalDetail .van-button--danger {
  color: #fff;
  background-color: #ed2424;
  border: 1px solid #ed2424;
}
.personalDetail .van-action-sheet {
  max-height: 40%;
}
.personalDetail .van-picker__confirm {
  color: #ed2424;
}
.personalDetail .van-picker__cancel {
  color: #666;
}
.personalDetail .van-field__control {
  text-align: right;
}
.personalDetail .van-tabs__wrap {
  margin-bottom: 0.3rem;
}
.personalDetail .van-ellipsis {
  font-size: 0.3rem;
}
.personalDetail .van-uploader__upload {
  width: 2rem;
  height: 2rem;
  margin: 0;
}
.personalDetail .van-uploader {
  margin-left: 0.5rem;
  width: 2rem;
  height: 2rem;
}
.personalDetail .van-uploader__wrapper {
  width: 2rem;
  height: 2rem;
}
.personalDetail .van-uploader__input {
  width: 2rem;
  height: 2rem;
}
.personalDetail .van-uploader__preview-image {
  width: 2rem;
  height: 2rem;
}
.personalDetail .secondBtn{
  width: 7.5rem;
  margin: 0 auto;
  text-align: center;
}
.personalDetail .secondBtn .van-button{
  width: 1.5rem;
  height: 0.7rem;
  line-height: 0.7rem;
}
.personalDetail .van-dialog__header{
  padding-top: 0.1rem;
}
.personalDetail .van-dialog__confirm{
  color:#ed2424;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.personalDetail {
  width: 7.5rem;
  padding-bottom: 1rem;
}
.personalDetail p {
  color: #333;
  font-size: 0.3rem;
  line-height: 0.6rem;
  margin-bottom: 0.2rem;
  text-align: center;
}
.ImgBox {
  height: 3rem;
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
.personalDetail a {
  color: #fff;
}
.file img{
  width: 2rem;
  height: 2rem;
  margin-left: 0.5rem;
}
</style>
