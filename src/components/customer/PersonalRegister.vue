<template>
  <div class="register">
    <van-nav-bar v-show="is_weixin" title="客户代注册" />
    <div>
      <van-cell-group v-show="active">
        <van-field v-model="form.memberFullName" label="姓名:" required placeholder="请输入姓名" />
        <van-field v-model="form.memberPhone" label="手机号:" placeholder="请输入手机号" />
        <van-field v-model="form.operatorLoginName" required label="登录名:" placeholder="请输入登录名" />
        <van-field
          v-model="form.secrectCode"
          required
          type="password"
          label="登录密码:"
          placeholder="请输入登录密码"
        />
        <van-field
          :value="form.idTypeDesc"
          required
          @click="showCardType = true"
          label="证件类型:"
          readonly
          clickable
          placeholder="请选择"
        />
        <van-field v-model="form.idCard" required label="证件号:" placeholder="请输入证件号" />
        <van-field
          :value="form.address"
          label="地址:"
          @click="showPopup"
          readonly
          placeholder="请选择地址"
        />
        <van-field v-model="form.memberAddress" label="详细地址:" placeholder="请输入详细地址" />
        <div class="firstBtn">
          <van-button type="danger" class="next pre" @click="next">下一步</van-button>
        </div>
      </van-cell-group>
      <div class="second" v-show="!active">
        <p class="title">请上传相关证件</p>
        <div class="ImgBox clear">
          <div class="file idCardPositive fl">
            <van-uploader v-model="positiveFileList" accept=".jpg,.jpeg,.png,.pdf,.JPG,.JPEG,.PDF" :before-read='beforeUpload' :max-count="1" :after-read="uploadPositive" :before-delete="delPositive"/>
            <p>身份证正面</p>
          </div>
          <div class="file idCardReverse fr">
            <van-uploader v-model="reverseFileList" accept=".jpg,.jpeg,.png,.pdf,.JPG,.JPEG,.PDF" :before-read='beforeUpload' :max-count="1" :after-read="uploadNegative" :before-delete="delNegative" />
            <p>身份证反面</p>
          </div>
        </div>
        <div class="thirdBtn">
          <van-button type="danger" class="pre" @click="pre">上一步</van-button>
          <van-button type="danger" class="pre" @click="submitClick(2)">保存</van-button>
          <van-button type="danger" style="width:1.8rem" class="pre" @click="submitClick(1)">成为用户</van-button>
        </div>
      </div>
    </div>
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
    <van-popup v-model="AddrPopup" position="bottom" :style="{ height: '40%' }">
      <van-area  show-toolbar :area-list="areaList" @cancel="AddrPopup = false" @confirm="sureAddress" />
    </van-popup>
    
  </div>
</template>
<script>

import OSS from "ali-oss";
import crypto from "crypto";
import { validMobileNo,validIdCard,validLoginName,validLoginPassword } from "@/utils/validate";

export default {
  name: "PersonalRegister",
  data() {
    return {
      areaList:{},
      idTypeList:[],
      positiveFileList:[],
      reverseFileList:[],
      
      form: {
        memberGuid:'',
        memberFullName: "",
        memberPhone: "",
        operatorLoginName: "",
        secrectCode: "",
        idCardType: "",
        idTypeDesc: "",
        idCard: "",
        address: "",
        provinceCode: "", //省
        cityCode: "", //市
        districtCode: "", //区
        memberAddress: "", //详细地址
        memberType:2,//自然人
        fzrPositiveFilePath:"",
        fzrPositiveFileName:"",
        fzrNegativeFilePath:"",
        fzrNegativeFileName:"",
        isSubmit:"",//保存2 提交1
      },
      active: true,
      AddrPopup: false,
      showCardType: false,
      showAddress: false,
      is_weixin:false,
     
    };
  },
  created() {
    var _this = this;
    _this.getAdress();
    _this.getSelect();
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
    //获取下拉框信息
    getSelect() {
      var _this = this;
      this.$http.get("/api/member/toRegisterPage").then(function(res) {
        var data = res.data;
        if (data.code == 0) {
          _this.idTypeList = data.data.zjTypeList;
          _this.form.idTypeDesc = _this.idTypeList[0].typeName;
          _this.form.idCardType = _this.idTypeList[0].id;
        }
      });
    },
    
    // 点击地址
    showPopup() {
      var _this = this;
      _this.AddrPopup = true;
    },
    // 点击确认地址
    sureAddress(value) {
      var _this = this;
      _this.form.provinceCode = value[0].code;
      _this.form.cityCode = value[1].code;
      _this.form.districtCode = value[2].code;
      _this.form.address = value[0].name+"/"+value[1].name+"/"+value[2].name;
      _this.AddrPopup = false;
    },
    // 点击确认身份证类型
    onConfirm(value) {
      var _this = this;
      _this.form.idTypeDesc = value.typeName;
      _this.form.idCardType = value.id;
      _this.showCardType = false;
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
              if(fileType == 3){
                // 身份证正面
                _this.form.fzrPositiveFilePath = storeAs;
                _this.form.fzrPositiveFileName = fileName;
              } else if (fileType == 4) {
                // 身份证反面
                _this.form.fzrNegativeFilePath = storeAs;
                _this.form.fzrNegativeFileName = fileName;
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
    //下一步
    next() {
      var _this = this;
      if (_this.form.memberFullName == "") {
        _this.$toast("请填写姓名");
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
      if (_this.form.idCardType == "") {
        _this.$toast("请选择证件类型");
        return;
      }
      if (_this.form.idCard == "") {
        _this.$toast("请填写证件号");
        return;
      }
      if(!validIdCard(_this.form.idCard)){
        _this.$toast("请输入正确的证件号");
        return;
      }
      _this.active = false;
    },
    
    //保存或者提交审核
    submitClick(isSubmit){
      var _this = this;
      //判断文件是否上传
      if (_this.form.fzrPositiveFilePath == "") {
        _this.$toast("请上传身份证正面文件");
        return;
      }
      if (_this.form.fzrNegativeFilePath == "") {
        _this.$toast("请上传身份证反面文件");
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
              path:'/customerList'
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

    pre() {
      var _this = this;
      _this.active = true;
    }
  }
};
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
.register .van-picker__confirm {
  color: #ed2424;
}
.register .van-picker__cancel {
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
.register .van-field__control {
  text-align: right;
}
.register .van-uploader {
  margin-left: 0.5rem;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.register {
  width: 7.5rem;
}
.register p {
  color: #333;
  font-size: 0.3rem;
  line-height: 0.6rem;
  margin-bottom: 0.2rem;
  text-align: center;
}
.register .firstBtn {
  width: 1.6rem;
  margin: 0 auto;
}
.register .title {
  font-size: 0.4rem;
  text-align: center;
  color: #ed2424;
  margin-bottom: 0.4rem;
}
.second {
  padding: 0.4rem;
  box-sizing: border-box;
}
.file {
  width: 3rem;
  height: 3rem;
  position: relative;
}
.file p{
  position: absolute;
  bottom: 0;
  left: 0.7rem;
}
.head-img {
  width: 3rem;
  height: 2rem;
}
.PositiveImg {
  position: absolute;
  left: 0rem;
  top: 0;
}
.ReverseImg {
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
