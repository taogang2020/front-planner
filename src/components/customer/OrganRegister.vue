<template>
  <div class="register">
    <van-nav-bar v-show="is_weixin" title="客户代注册" left-text="返回" left-arrow @click-left="cancel"/>
    <div>
      <van-cell-group v-show="firstTep">
        <van-field v-model="form.memberFullName" required label="企业全称:" placeholder="请输入企业全称" />
        <van-field v-model="form.memberName" label="企业简称:" placeholder="请输入企业简称" />
        <van-field v-model="form.companyCreditCode" required label-width="2.7rem" label="统一社会信用代码:" placeholder="请输入统一社会信用代码" />
        <van-field :value="form.companyTypeDesc" required label="企业类型:" readonly clickable  @click="showcompanyType = true" placeholder="请选择企业类型" />
        <van-field v-model="form.legalMan" required label="企业法人:" placeholder="请输入企业法人" />
        <van-field :value="form.legalIdCardTypeDesc" required @click="showlegalIdCardType = true" label="法人证件类型:" label-width="2.6rem" readonly clickable  placeholder="请选择" />
        <van-field v-model="form.legalIdCard" required label="法人证件号:" placeholder="请输入法人证件号"/>
        <van-field v-model="form.openTime" label="成立时间:"  readonly @click="showTime = true" placeholder="请选择成立时间"/>
        <van-field v-model="form.totalAssets" label="总资产(亿):" label-width="2.6rem"  placeholder="请输入总资产" />
        <van-field v-model="form.netAssets" label="净资产(亿):" label-width="2.6rem"  placeholder="请输入净资产" />
        <van-field v-model="form.fundsSources" label="资金来源:" label-width="2.6rem"  placeholder="请输入资金来源" />
        <van-field :value="form.address" label="注册地址:" @click="showPopup" readonly  placeholder="请选择注册地址" />
        <van-field v-model="form.memberAddress" label="详细地址:" label-width="2.6rem"  placeholder="请输入详细地址" />
        <van-field v-model="form.businessScope" rows="1" class='textarea' type="textarea" autosize label="业务经营范围:" label-width="2.4rem"  placeholder="请输入业务经营范围" />
        <div class="firstBtn"><van-button type="danger" class="pre" @click="firstNext">下一步</van-button></div>
      </van-cell-group>
      <div v-show="secondTep">
        <van-field v-model="form.operatorName" required label="业务负责人:" placeholder="请输入业务负责人" />
        <van-field :value="form.operatorIdTypeDesc" required @click="showCardType = true" label="证件类型:" readonly clickable  placeholder="请选择证件类型" />
        <van-field v-model="form.operatorIdCard" required label="证件号:" placeholder="请输入证件号"/>
        <van-field v-model="form.memberPhone" label="手机号:" placeholder="请输入手机号" />
        <van-field v-model="form.operatorLoginName" required label="登录名:" placeholder="请输入登录名" />
        <van-field v-model="form.secrectCode" required type="password" label="登录密码:" placeholder="请输入登录密码" />
        <div class="secondBtn">
          <van-button type="danger" class="pre" @click="secondPre">上一步</van-button>
          <van-button type="danger" class="pre" @click="secondNext">下一步</van-button>
        </div>
          
      </div>
      <div class="second" v-show="thirdTep">
          <p class="title">请上传相关证件</p>
          <div class="ImgBox clear">
            <div class="file fl">
              <van-uploader v-model="yyzzFileList"  :before-read='beforeUpload' :max-count="1" :after-read="uploadYyzz" :before-delete="delYyzz" />
              <p>营业执照</p>
            </div>
            <div class="file fr">
              <van-uploader v-model="sqwtsFileList"  :before-read='beforeUpload' :max-count="1" :after-read="uploadSqwts" :before-delete="delSqwts" />
              <p>授权人委托书</p>
            </div>
            <div class="file idCardPositive fl">
              <van-uploader v-model="positiveFileList"  :before-read='beforeUpload' :max-count="1" :after-read="uploadPositive" :before-delete="delPositive" />
              <p>负责人身份证正面</p>
            </div>
            <div class="file idCardPositive fr">
              <van-uploader v-model="reverseFileList"  :before-read='beforeUpload' :max-count="1" :after-read="uploadNegative" :before-delete="delNegative" />
              <p>负责人身份证反面</p>
            </div>
            <div class="file fl">
              <van-uploader v-model="otherFileList"  :before-read='beforeUpload' :max-count="1" :after-read="uploadOther" :before-delete="delOther" />
              <p>其他</p>
            </div>
          </div>
          <div class="thirdBtn">
            <van-button type="danger" class="pre" @click="thirdPre">上一步</van-button>
            <van-button type="danger" class="pre" @click="submitClick(2)">保存</van-button>
            <van-button type="danger" style="width:1.8rem" class="pre" @click="submitClick(1)">成为用户</van-button>
          </div>
          
      </div>
    </div>
    <!-- 企业类型选择器 -->
    <van-popup v-model="showcompanyType" position="bottom">
        <van-picker
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
import { validMobileNo,validIdCard,validLoginName,validLoginPassword } from "@/utils/validate";
import {dateCommonFormat } from '@/utils/common';

export default {
  name: "OrganRegister",
  data() {
    return {
      areaList:{},
      idTypeList:[],
      companyTypeList:[],
      yyzzFileList:[],
      sqwtsFileList:[],
      positiveFileList:[],
      reverseFileList:[],
      otherFileList:[],
      form:{
        memberGuid:'',
        memberFullName: "",
        memberName: "",
        companyCreditCode:'',
        companyType:'',
        companyTypeDesc:"",
        legalMan:'',
        legalIdCardType:'',
        legalIdCardTypeDesc:"",
        legalIdCard:'',
        address:"",
        provinceCode: "", //省
        cityCode: "", //市
        districtCode: "", //区
        memberAddress:'',
        businessScope: '',
        operatorName:'',
        openTime:'',
        operatorIdType:'',
        operatorIdTypeDesc:"",
        operatorIdCard:'',
        memberPhone:'',
        operatorLoginName:'',
        secrectCode:'',
        yyzzFilePath:"",//营业执照
        yyzzFileName:"",
        sqwtsFilePath:"",//授权人委托书
        sqwtsFileName:"",
        fzrPositiveFilePath:"",//负责人身份证正面
        fzrPositiveFileName:"",
        fzrNegativeFilePath:"",//负责人身份证反面
        fzrNegativeFileName:"",
        otherFilePath:"",//其他
        otherFileName:"",
        totalAssets:"",//总资产
        netAssets:"",//净资产
        fundsSources:"",//资金来源
        memberType: 1,//机构
        isSubmit:"",//保存2 提交审核1
      },
      minDate:new Date(1970, 10, 1),
      currentDate: new Date(),
      firstTep: true,
      secondTep: false,
      thirdTep: false,
      AddrPopup:false,
      showTime:false,
      showcompanyType: false,
      showlegalIdCardType: false,
      showCardType: false,
      showAddress:false,
      is_weixin:false,
      
    }
  },

  created() {
    var _this = this;
    _this.getAdress();
    _this.getSelect();
    _this.isWeixin()
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
    //获取下拉框信息
    getSelect() {
      var _this = this;
      this.$http.get("/api/member/toRegisterPage").then(function(res) {
        var data = res.data;
        if (data.code == 0) {
          _this.idTypeList = data.data.zjTypeList;
          _this.companyTypeList = data.data.companyTypeList;
          //法人证件类型赋值
          _this.form.legalIdCardTypeDesc = _this.idTypeList[0].typeName;
          _this.form.legalIdCardType = _this.idTypeList[0].id;
          //业务负责人证件类型赋值
          _this.form.operatorIdTypeDesc = _this.idTypeList[0].typeName;
          _this.form.operatorIdType = _this.idTypeList[0].id;
        }
      });
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
      _this.showcompanyType = false;
    },
    // 点击确认法人证件类型
    onLegalIdCardType(value) {
      var _this = this;
      _this.form.legalIdCardTypeDesc = value.typeName;
      _this.form.legalIdCardType = value.id;
      _this.showlegalIdCardType = false;
    },
    // 点击确认身份证类型
    onConfirm(value) {
      var _this = this;
      _this.form.operatorIdTypeDesc = value.typeName;
      _this.form.operatorIdType = value.id;
      _this.showCardType = false;
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
    // 保存或者提交
    submitClick(isSubmit){
      var _this = this;
      //判断文件是否上传
      if (_this.form.yyzzFilePath == "") {
        _this.$toast("请上传营业执照文件");
        return;
      }
      if (_this.form.sqwtsFilePath == "") {
        _this.$toast("请上传请上传授权人委托书文件");
        return;
      }
      if (_this.form.fzrPositiveFilePath == "") {
        _this.$toast("请上传负责人身份证正面文件");
        return;
      }
      if (_this.form.fzrNegativeFilePath == "") {
        _this.$toast("请上传负责人身份证反面文件");
        return;
      }
      _this.form.isSubmit = isSubmit;
      var savesecrectCode = _this.form.secrectCode;
      var  md5 = crypto.createHash("md5");
      md5.update(_this.form.secrectCode) //需要加密的密码
      _this.form.secrectCode = md5.digest('hex');  //password 加密完的密码
      _this.$http.post("/api/planner/member/cust/register",_this.form).then(function(res){
        var data =res.data;
        if(data.code==0){
          var result =data.data;
          if(result) {
            _this.$toast("操作成功");
            //返回列表
            _this.$router.push({
              path:'/user'
            });
          } else {
            _this.$toast("操作失败");
            _this.form.secrectCode = savesecrectCode;
          }
        } else {
          _this.$toast(data.msg);
          _this.form.secrectCode = savesecrectCode;
        } 
      });
    },
    //下一步
    firstNext(){
      var _this = this;
      if (_this.form.memberFullName == "") {
        _this.$toast("请填写企业全称");
        return;
      }
      if (_this.form.companyCreditCode == "") {
        _this.$toast("请填写统一社会信用代码");
        return;
      }
      if (_this.form.companyType == "") {
        _this.$toast("请选择企业类型");
        return;
      }
      if (_this.form.legalMan == "") {
        _this.$toast("请填写企业法人");
        return;
      }
      if (_this.form.legalIdCardType == "") {
        _this.$toast("请选择法人证件类型");
        return;
      }
      if (_this.form.legalIdCard == "") {
        _this.$toast("请填写法人证件号");
        return;
      }
      if(!validIdCard(_this.form.legalIdCard)){
        _this.$toast("请输入正确的法人证件号");
        return;
      }
      _this.firstTep = false;
      _this.secondTep = true;
      _this.thirdTep = false
    },
    secondPre(){
      var _this = this;
      _this.firstTep = true;
      _this.secondTep = false;
      _this.thirdTep = false
    },
    //下一步
    secondNext(){
      var _this = this;
      if (_this.form.operatorName == "") {
        _this.$toast("请填写业务负责人");
        return;
      }
      if (_this.form.operatorIdType == "") {
        _this.$toast("请选择负责人证件类型");
        return;
      }
      if (_this.form.operatorIdCard == "") {
        _this.$toast("请填写负责人证件号码");
        return;
      }
      if(!validIdCard(_this.form.operatorIdCard)){
        _this.$toast("请输入正确的证件号");
        return;
      }
      if (_this.form.memberPhone != "" && !validMobileNo(_this.form.memberPhone)) {
        _this.$toast("请填写正确的手机号");
        return;
      }
      if (_this.form.operatorLoginName == "") {
        _this.$toast("请填写登录名");
        return;
      }
      if(!validLoginName(_this.form.operatorLoginName)){
        _this.$toast("登录名以字母开头，只能包含字母、数字、下划线");
        return;
      }
      if (_this.form.secrectCode == "") {
        _this.$toast("请填写登录密码");
        return;
      }
      if(!validLoginPassword(_this.form.secrectCode)){
        _this.$toast("登录密码只能包含字母、数字、下划线");
        return;
      }
      _this.firstTep = false;
      _this.secondTep = false;
      _this.thirdTep = true;
    },
    thirdPre(){
      var _this = this;
      _this.firstTep = false;
      _this.secondTep = true;
      _this.thirdTep = false;
    },
    //取消
    cancel(){
      var _this = this;
      _this.$router.go(-1);
    },

    
  }

}
</script>
<style>
.register .van-button {
  height: 0.7rem;
  line-height: 0.7rem;
  cursor: pointer;
}
.register .van-nav-bar__text{
  color: #333;
}
.register .van-cell {
  width: 7.5rem;
  height: 1rem;
  line-height: 0.6rem;
  font-size: 0.3rem;
  margin-bottom: 0.1rem;
}
.register .van-cell-group {
  background: transparent;
}
.register .van-button--danger {
  color: #fff;
  background-color: #ed2424;
  border: 1px solid #ed2424;
}
.register .van-action-sheet {
  max-height: 40%;
}
.register .van-picker__confirm{
  color:#ed2424;
}
.register .van-picker__cancel{
  color: #666;
}
.register .van-uploader__upload {
  width: 2rem;
  height: 2rem;
  margin: 0;
}
.register .van-uploader {
  margin-left: 0.5rem;
  width: 2rem;
  height: 2rem;
}
.register .van-uploader__wrapper {
  width: 2rem;
  height: 2rem;
}
.register .van-uploader__input{
  width: 2rem;
  height: 2rem;;
}
.register .van-uploader__preview-image{
  width: 2rem;
  height: 2rem;;
}
.register .van-field__control{
  text-align: right;
}
.register .secondBtn{
  width: 3.5rem;
  margin: 0 auto;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.register {
  width: 7.5rem；;
}
.register p {
  color: #333;
  font-size: 0.3rem;
  line-height: 0.6rem;
  margin-bottom: 0.2rem;
  text-align: center;
}
.register .firstBtn{
  width: 1.6rem;
  margin: 0 auto;
}
.register .secondBtn{
  width: 3.6rem;
  margin: 0 auto;
}
.register .title{
  font-size: 0.4rem;
  text-align: center;
  color: #ed2424;
  margin-bottom: 0.4rem;
}
.register .textarea {
  width: 7.5rem;
  line-height: 0.6rem;
  font-size: 0.3rem;
}
.register .textarea .van-field__control{
  min-height: 1rem;
  line-height: 0.6rem;
}
.second{
  padding: 0.4rem;
  box-sizing: border-box;
}
.file{
  width: 3rem;
  height: 3rem;
  position: relative;
}
.file p{
  position: absolute;
  bottom: 0;
  left: 0.7rem;
}
.idCardPositive p{
  left: 0.5rem;
}
.head-img{
  width: 3rem;
  height: 2rem;;
}
.PositiveImg{
  position: absolute;
  left: 0rem;
  top: 0;
}
.ReverseImg{
  position: absolute;
  left: 0rem;
  top: 0;
}
.thirdBtn{
  width: 6.5rem;
  margin: 0 auto;
  text-align: center;
}
.pre{
  width: 1.6rem;
}
</style>
