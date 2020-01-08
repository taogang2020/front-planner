<template>
  <div class="organBack">
    <van-nav-bar v-show="is_weixin" title="审核退回"/>
    <div>
        <div class="titleDes">
        <p class="status">用户您好，你的资料已提交审核，您的审核状态为：<span style='font-size:0.3rem;color:#ed2424'>{{form.memberStatusDesc}}</span>，请根据审核意见更改资料。</p>
        <p class="status">审核意见：{{form.reviewOpinion}}</p>
      </div>
      <van-tabs v-model="active" >
        <van-tab title="基本信息">
          <div >
            <van-cell-group class="text">
              <van-field v-model="form.memberFullName" required label="企业全称:" placeholder="请输入企业全称" />
              <van-field v-model="form.memberName" label="企业简称:" placeholder="请输入企业简称" />
              <van-field v-model="form.companyCreditCode" required label-width="2.7rem" label="统一社会信用代码:" placeholder="请输入统一社会信用代码" />
              <van-field :value="form.companyTypeDesc" required label="企业类型:" readonly clickable  @click="showcompanyType = true" placeholder="请选择企业类型" />
              <van-field v-model="form.legalMan" required label="企业法人:" placeholder="请输入企业法人" />
              <van-field :value="form.legalIdCardTypeDesc" required @click="showlegalIdCardType = true" label="法人证件类型:" label-width="2.6rem" readonly clickable  placeholder="请选择" />
              <van-field v-model="form.legalIdCard" required label="法人证件号:" placeholder="请输入法人证件号"/>
              <van-field v-model="form.openTime" label="成立时间:"  readonly @click="showTime = true" placeholder="请选择成立时间"/>
              <van-field v-model="form.totalAssets" label="总资产(亿):"  placeholder="请输入总资产" />
              <van-field v-model="form.netAssets" label="净资产(亿):"  placeholder="请输入净资产" />
              <van-field v-model="form.fundsSources" label="资金来源:"  placeholder="请输入资金来源" />
              <van-field :value="form.address" label="注册地址:" @click="showPopup" readonly  placeholder="请选择注册地址" />
              <van-field v-model="form.memberAddress" label="详细地址:"  placeholder="请输入详细地址" />
            </van-cell-group>
            <van-field v-model="form.businessScope" rows="1" class='textarea' type="textarea" autosize label="业务经营范围:" label-width="2.4rem"  placeholder="请输入业务经营范围" />
          </div>
          <div class="text" style="margin-top:0.1rem">
            <van-field v-model="form.operatorName" required label="业务负责人:" placeholder="请输入业务负责人" />
            <van-field :value="form.operatorIdTypeDesc" required @click="showCardType = true" label="证件类型:" readonly clickable  placeholder="请选择证件类型" />
            <van-field v-model="form.operatorIdCard" required label="证件号:" placeholder="请输入证件号"/>
            <van-field v-model="form.memberPhone" label="手机号:" placeholder="请输入手机号" />
            <van-field v-model="form.operatorLoginName" required label="登录名:" placeholder="请输入登录名" />
          </div>
        </van-tab>
        <van-tab title="证明文件">
          <div class="ImgBox clear">
            <div class="file  fl">
              <van-uploader v-model="yyzzFileList" accept=".jpg,.jpeg,.png,.pdf,.JPG,.JPEG,.PDF" :before-read='beforeUpload' :max-count="1" :after-read="uploadYyzz" :before-delete="delYyzz" />
              <p>营业执照</p>
            </div>
            <div class="file fr">
              <van-uploader v-model="sqwtsFileList" accept=".jpg,.jpeg,.png,.pdf,.JPG,.JPEG,.PDF" :before-read='beforeUpload' :max-count="1" :after-read="uploadSqwts" :before-delete="delSqwts" />
              <p>授权人委托书</p>
            </div>
            <div class="file idCardPositive fl">
              <van-uploader v-model="positiveFileList" accept=".jpg,.jpeg,.png,.pdf,.JPG,.JPEG,.PDF" :before-read='beforeUpload' :max-count="1" :after-read="uploadPositive" :before-delete="delPositive" />
              <p>负责人身份证正面</p>
            </div>
            <div class="file idCardPositive fr">
              <van-uploader v-model="reverseFileList" accept=".jpg,.jpeg,.png,.pdf,.JPG,.JPEG,.PDF" :before-read='beforeUpload' :max-count="1" :after-read="uploadNegative" :before-delete="delNegative" />
              <p>负责人身份证反面</p>
            </div>
            <div class="file fl">
              <van-uploader v-model="otherFileList" accept=".jpg,.jpeg,.png,.pdf,.JPG,.JPEG,.PDF" :before-read='beforeUpload' :max-count="1" :after-read="uploadOther" :before-delete="delOther" />
              <p>其他</p>
            </div>
          </div>
        </van-tab>
      </van-tabs>
      <div class="secondBtn">
        <van-button type="danger" class="pre" @click="save">保 存</van-button>
        <van-button type="danger" class="pre" @click="submit">提交</van-button>
      </div>
      <p class="logOut" @click="logOut">退出登录</p>
    </div>
    <!-- 企业类型选择器 -->
    <van-popup v-model="showcompanyType" position="bottom">
        <van-picker
            ref="companyType"
            show-toolbar
            :columns="companyTypeList"
            value-key="typeName"
            @cancel="showcompanyType = false"
            @confirm="onCompanyType"
        />
    </van-popup>
    <!-- 法人类型选择器 -->
    <van-popup v-model="showlegalIdCardType" position="bottom">
        <van-picker
            show-toolbar
            :columns="idTypeList"
            value-key="typeName"
            @cancel="showlegalIdCardType = false"
            @confirm="onLegalIdCardType"
        />
    </van-popup>
    <!-- 证件类型选择器 -->
    <van-popup v-model="showCardType" position="bottom">
        <van-picker
            show-toolbar
            :columns="idTypeList"
            value-key="typeName"
            @cancel="showCardType = false"
            @confirm="onConfirm"
        />
    </van-popup>
    <!-- 地址选择器 -->
    <van-popup v-model="AddrPopup" position="bottom" :style="{ height: '40%' }" >
      <van-area show-toolbar :area-list="areaList" @cancel="AddrPopup = false" @confirm="sureAddress" />
    </van-popup>
    <!-- 时间选择器 -->
    <van-popup v-model="showTime" position="bottom" :style="{ height: '40%' }" >
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        @cancel="showTime = false"
        @confirm="onShowTime"
      />
    </van-popup>
    
  </div>
</template>

<script>
import OSS from "ali-oss";
import crypto from "crypto";
import { validMobileNo,validIdCard,validLoginName } from "@/utils/validate";
import {dateCommonFormat } from '@/utils/common';
export default {
  name: "OrganCheckBack",
  data() {
    return {
      active:0,
      areaList:{},
      idTypeList:[],
      companyTypeList:[],
      yyzzFileList:[
        { url: '' },
      ],
      sqwtsFileList:[
        { url: '' },
      ],
      positiveFileList:[
        { url: '' },
      ],
      reverseFileList:[
        { url: '' },
      ],
      otherFileList:[
        { url: '' },
      ],
      form:{
        isSubmit:'',  //提交：1 保存：2
      },
      minDate:new Date(1970, 10, 1),
      currentDate: new Date(),
      AddrPopup:false,
      showTime:false,
      showcompanyType: false,
      showlegalIdCardType: false,
      showCardType: false,
      is_weixin:false,
    }
  },
  created() {
    var _this = this;
    _this.getAdress();
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
    //获取地址
    getAdress() {
      var _this = this;
      this.$http.get("/api/sys/area/search/mobile").then(function(res) {
        var data = res.data;
        if (data.code == 0) {
          _this.areaList = data.data;
        }
      });
    },
    //获取数据
    getDetail(){
      var _this = this;
      var guid = sessionStorage.getItem('guid')
      this.$http.get("/api/member/getMemberDetail",{params:{memberGuid:guid}}).then(function (res) {
        var data = res.data;
        if (data.code == 0) {
            _this.idTypeList = data.data.zjTypeList;
            _this.companyTypeList = data.data.companyTypeList;
            _this.form = data.data.membersVo;
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
            _this.form.openTime = dateCommonFormat(data.data.membersVo.openTime);
            _this.yyzzFileList[0].url = "http://"+ data.data.membersVo.yyzzFilePathFull;
            _this.sqwtsFileList[0].url = "http://"+ data.data.membersVo.sqwtsFilePathFull;
            _this.positiveFileList[0].url = "http://"+ data.data.membersVo.fzrPositiveFilePathFull;
            _this.reverseFileList[0].url = "http://"+ data.data.membersVo.fzrNegativeFilePathFull;
            if(data.data.membersVo.otherFilePathFull){
              _this.otherFileList[0].url = "http://"+ data.data.membersVo.otherFilePathFull;
            }else{
              _this.otherFileList = [];
            }
        } else {
          _this.$toast(data.msg);
        }
      })
    },

    // 点击地址
    showPopup() {
      var _this = this;
      _this.AddrPopup = true;
      
    },
    // 点击确定成立时间
    onShowTime(value) {
      var _this = this;
      _this.form.openTime = dateCommonFormat(value);
      _this.showTime = false;
    },
    // 点击确认地址
    sureAddress(value){
      var _this = this;
      _this.form.provinceId = null;
      _this.form.cityId = null;
      _this.form.districtId = null;
      _this.form.provinceCode = value[0].code;
      _this.form.cityCode = value[1].code;
      _this.form.districtCode = value[2].code;
      _this.form.address = value[0].name+"/"+value[1].name+"/"+value[2].name;
      _this.AddrPopup = false;
    },
    // 点击确认企业类型
    onCompanyType(value) {
      var _this = this;
      _this.form.companyTypeDesc = value.typeName;
      _this.form.companyType = value.id;
      _this.showcompanyType = false
    },
    // 点击确认法人证件类型
    onLegalIdCardType(value) {
      var _this = this;
      _this.form.legalIdCardTypeDesc = value.typeName;
      _this.form.legalIdCardType = value.id;
      _this.showlegalIdCardType = false
    },
    // 点击确认身份证类型
    onConfirm(value) {
      var _this = this;
      _this.form.operatorIdTypeDesc = value.typeName;
      _this.form.operatorIdType = value.id;
      _this.showCardType = false
    },

    // 删除营业执照
    delYyzz() {
      var _this = this;
      _this.form.yyzzFilePath = "";
      _this.form.yyzzFileName = "";
      return true;
    },
    // 删除授权人委托书
    delSqwts() {
      var _this = this;
      _this.form.sqwtsFilePath = "";
      _this.form.sqwtsFileName = "";
      return true;
    },
    // 删除身份证正面
    delPositive(){
      var _this = this;
      _this.form.fzrPositiveFilePath = "";
      _this.form.fzrPositiveFileName = "";
      return true;
    },
    //删除身份证反面
    delNegative(){
      var _this = this;
      _this.form.fzrNegativeFilePath = "";
      _this.form.fzrNegativeFileName = "";
      return true;
    },
    // 删除其他
    delOther() {
      var _this = this;
      _this.form.otherFilePath = "";
      _this.form.otherFileName = "";
      return true;
    },
    // 上传营业执照
    uploadYyzz(file) {
      var _this = this;
      _this.uploadFile(file,1);
    },
    // 上传授权人委托书
    uploadSqwts(file) {
      var _this = this;
      _this.uploadFile(file,2);
    },
    // 上传身份证正面
    uploadPositive(file) {
      var _this = this;
      _this.uploadFile(file,3);
    },
    // 上传身份证反面
    uploadNegative(file) {
      var _this = this;
      _this.uploadFile(file,4);
    },
    // 上传其他
    uploadOther(file) {
      var _this = this;
      _this.uploadFile(file,5);
    },
    // 上传图片验证
    beforeUpload(file) {
      var _this = this;
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        _this.$toast("上传文件不能超过2MB");
      }
      return isLt2M;
    },
    // 上传图片
    uploadFile(params,fileType) {
      // 此时可以自行将文件上传至服务器
      var _this = this;
      this.$http
        .post("/api/member/upload/ststoken", { uploadFileType: 1 })
        .then(function(res) {
          var data = res.data;
          if (data.code == 0) {
            var client = OSS({
              accessKeyId: data.data.accessKeyId,
              accessKeySecret: data.data.accessKeySecret,
              stsToken: data.data.securityToken,
              bucket: data.data.bucketName,
              region: "oss-cn-beijing"
            });
            var fileName = params.file.name;
            var fileformat = _this.getCaption(params.file.name, 1);
            var suffix = "." + fileformat;
            var uuid = _this.uuid();
            var storeAs = data.data.uploadPath + "/" + uuid + suffix;
            try {
              let result = client.put(storeAs, params.file);
              if(fileType == 1){
                // 营业执照
                _this.form.yyzzFilePath = storeAs;
                _this.form.yyzzFileName = fileName;
              } else if (fileType == 2) {
                // 授权人委托书
                _this.form.sqwtsFilePath = storeAs;
                _this.form.sqwtsFileName = fileName;
              } else if(fileType == 3){
                // 身份证正面
                _this.form.fzrPositiveFilePath = storeAs;
                _this.form.fzrPositiveFileName = fileName;
              } else if (fileType == 4) {
                // 身份证反面
                _this.form.fzrNegativeFilePath = storeAs;
                _this.form.fzrNegativeFileName = fileName;
              } else if (fileType == 5) {
                // 其他
                _this.form.otherFilePath = storeAs;
                _this.form.otherFileName = fileName;
              }
            } catch (e) {
              console.log(e);
            }
          } else {
            _this.$toast(data.msg);
          }
        });
    },
    // 生成uuid
    uuid() {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4";
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
      s[8] = s[13] = s[18] = s[23] = "";

      var uuid = s.join("");
      return uuid;
    },
    // 截取图片文件格式
    getCaption(obj, state) {
      var index = obj.lastIndexOf(".");
      if (state == 0) {
        obj = obj.substring(0, index);
      } else {
        obj = obj.substring(index + 1, obj.length);
      }
      return obj;
    },
    
    //检验必填项
    checkRequired(){
      var _this = this;
      if (_this.form.memberFullName == "") {
        _this.$toast("请填写企业全称");
        return false;
      }
      if (_this.form.companyCreditCode == "") {
        _this.$toast("请填写统一社会信用代码");
        return false;
      }
      if (_this.form.companyType == "") {
        _this.$toast("请选择企业类型");
        return false;
      }
      if (_this.form.legalMan == "") {
        _this.$toast("请填写企业法人");
        return false;
      }
      if (_this.form.legalIdCardType == "") {
        _this.$toast("请选择法人证件类型");
        return false;
      }
      if (_this.form.legalIdCard == "") {
        _this.$toast("请填写法人证件号");
        return false;
      }
      if(!validIdCard(_this.form.legalIdCard)){
        _this.$toast("请输入正确的法人证件号");
        return false;
      }
      if (_this.form.operatorName == "") {
        _this.$toast("请填写业务负责人");
        return false;
      }
      if (_this.form.operatorIdType == "") {
        _this.$toast("请选择负责人证件类型");
        return false;
      }
      if (_this.form.operatorIdCard == "") {
        _this.$toast("请填写负责人证件号码");
        return false;
      }
      if(!validIdCard(_this.form.operatorIdCard)){
        _this.$toast("请输入正确的负责人证件号码");
        return false;
      }
      if (_this.form.memberPhone) {
        if(!validMobileNo(_this.form.memberPhone)){
          _this.$toast("请填写正确的手机号");
          return false;
        }
      }
      if (_this.form.operatorLoginName == "") {
        _this.$toast("请填写登录名");
        return false;
      }
      if(!validLoginName(_this.form.operatorLoginName)){
        _this.$toast("登录名以字母开头，只能包含字母、数字、下划线");
        return false;
      }
      //判断文件是否上传
      if (_this.form.yyzzFilePath == "") {
        _this.$toast("请上传营业执照文件");
        return false;
      }
      if (_this.form.sqwtsFilePath == "") {
        _this.$toast("请上传请上传授权人委托书文件");
        return false;
      }
      if (_this.form.fzrPositiveFilePath == "") {
        _this.$toast("请上传负责人身份证正面文件");
        return false;
      }
      if (_this.form.fzrNegativeFilePath == "") {
        _this.$toast("请上传负责人身份证反面文件");
        return false;
      }
      return true;
    },
    // 保存
    save(){
      var _this = this;
      if(_this.checkRequired()){
        _this.form.isSubmit = 2;
        _this.$http.post("/api/planner/member/edit",_this.form).then(function(res){
          var data = res.data;
          if(data.code==0){
            _this.$toast(data.msg);
            _this.active = 0;
          }else{
            _this.$toast(data.msg);
          }
        })
      }
    },
    // 提交
    submit(){
      var _this = this;
      if(_this.checkRequired()){
        _this.form.isSubmit = 1;
        _this.$http.post("/api/planner/member/edit",_this.form).then(function(res){
            var data = res.data;
            if(data.code==0){
                _this.$toast(data.msg);
                _this.$router.push({ 
                    path:'/organCheckWait',//跳转到待审核
                })
            }else{
              _this.$toast(data.msg);
            }
        })
      }
    },
    //退出登录
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
    },

  }

}
</script>
<style>
.organBack .van-button {
  height: 0.7rem;
  line-height: 0.7rem;
  cursor: pointer;
}
.organBack .van-nav-bar .van-icon{
  color: #333;
}
.organBack .van-nav-bar__text{
  color: #333;
}
.organBack .van-nav-bar__left{
  left: 0;
}
.organBack .text .van-cell {
  width: 7.5rem;
  height: 1rem;
  line-height: 0.6rem;
  font-size: 0.3rem;
  margin-bottom: 0.1rem;
}
.organBack .textarea {
  width: 7.5rem;
  min-height: 1rem;
  line-height: 0.6rem;
  font-size: 0.3rem;
  /* margin-bottom: 0.1rem; */
}
.organBack .textarea .van-field__control{
  min-height: 1rem;
  line-height: 0.6rem;
  /* font-size: 0.3rem; */
  /* margin-bottom: 0.1rem; */
}
.organBack .van-cell-group {
  background: transparent;
}
.organBack .van-button--danger {
  color: #fff;
  background-color: #ed2424;
  border: 1px solid #ed2424;
}
.organBack .van-action-sheet {
  max-height: 40%;
}
.organBack .van-picker__confirm{
  color:#ed2424;
}
.organBack .van-picker__cancel{
  color: #666;
}
.organBack .van-field__control{
  text-align: right;
}
.organBack .van-uploader__upload {
  width: 2rem;
  height: 2rem;
  margin: 0;
}
.organBack .van-uploader {
  margin-left: 0.5rem;
  width: 2rem;
  height: 2rem;
}
.organBack .van-uploader__wrapper {
  width: 2rem;
  height: 2rem;
}
.organBack .van-uploader__input{
  width: 2rem;
  height: 2rem;;
}
.organBack .van-uploader__preview-image{
  width: 2rem;
  height: 2rem;;
}
.organBack .van-tabs__wrap {
  margin-bottom: 0.3rem;
}

</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.organBack {
  width: 7.5rem;
  padding-bottom: 1rem;
}
.organBack p {
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
.organBack .secondBtn{
  width: 3.3rem;
  margin: 0 auto;
}
.second{
  padding: 0.4rem;
  box-sizing: border-box;
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
.organBack a{
    color: #fff;
}
.organBack .logOut {
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
.pre{
  width: 1.5rem;
}

</style>
