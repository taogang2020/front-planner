<template>
  <div class="personalDetail">
    <van-nav-bar v-show="is_weixin" title="客户详情"/>
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
              :value="form.idTypeDesc"
              required
              @click="idTypeSelect"
              label="证件类型:"
              :disabled="is_disabled"
              clickable
              placeholder="请选择"
            />
            <van-field v-model="form.idCard" required :disabled="is_disabled" label="证件号:" />
            <van-field
              :value="form.address"
              label="地址:"
              @click="showPopup"
              :disabled="is_disabled"
              placeholder="请选择地址"
            />
            <van-field v-model="form.memberAddress" :disabled="is_disabled" label="详细地址:" />
          </van-cell-group>
        </van-tab>
        <van-tab title="证明文件">
          <div class="ImgBox clear">
            <div class="file idCardPositive fl">
              <van-uploader v-model="positiveFileList" :before-read='beforeUpload' :disabled="is_disabled" :max-count="1" :after-read="uploadPositive" :before-delete="delPositive" />
              <p>身份证正面</p>
            </div>
            <div class="file idCardReverse fr">
              <van-uploader v-model="reverseFileList" :before-read='beforeUpload' :disabled="is_disabled" :max-count="1" :after-read="uploadNegative" :before-delete="delNegative" />
              <p>身份证反面</p>
            </div>
          </div>
        </van-tab>
      </van-tabs>
      <div class="secondBtn">
        <van-button type="danger" class="pre" v-if="(form.memberStatus == 3 || form.memberStatus == 6) && !showSaveBtn" @click="editClick()">编 辑</van-button>
        <van-button type="danger" class="pre" v-if="(form.memberStatus == 3 || form.memberStatus == 6) && !showSaveBtn" @click="deleteClick()">删 除</van-button>
        <!--
        <van-button type="danger" class="pre" style="width:1.8rem" v-if="form.memberStatus == 1 && !showSaveBtn" @click="reviewClick(2)">审核通过</van-button>
        <van-button type="danger" class="pre" style="width:1.8rem" v-if="form.memberStatus == 1 && !showSaveBtn" @click="reviewClick(3)">审核退回</van-button>
        -->
        <van-button type="danger" class="pre" v-if="showSaveBtn" @click="cancelEditClick()">取 消</van-button>
        <van-button type="danger" class="pre" v-if="showSaveBtn" @click="submitClick(2)">保 存</van-button>
        <van-button type="danger" class="pre isUser" style="width:1.8rem" v-if="showSaveBtn" @click="submitClick(1)">成为用户</van-button>
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
    <!-- 删除弹框 -->
    <van-dialog v-model="showDelete" title="确认删除吗？" show-cancel-button @confirm="confirmDelete"></van-dialog>
    <!-- 审核弹框 -->
    <!-- 
    <van-dialog v-model="showReview" title="审核" show-cancel-button :before-close="confirmReview">
       <van-field
      v-model="reviewForm.reviewOpinion"
      rows="1"
      required
      autosize
      label="审核意见"
      type="textarea"
      placeholder="请输入审核意见"
    />
    </van-dialog>
    -->
  </div>
</template>
<script>
import OSS from "ali-oss";
import {validMobileNo, validIdCard, validLoginName } from "@/utils/validate";
export default {
  name: "PersonalDetail",
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
      showCardType: false,
      AddrPopup: false,
      is_disabled: true,
      showSaveBtn : false,
      showDelete : false,
      showReview : false,
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
    //证件类型选择
    idTypeSelect(){
      var _this = this;
      if(!_this.is_disabled){
        _this.showCardType = true;
      }
    },
    // 点击确认身份证类型
    onConfirm(value) {
      var _this = this;
      _this.form.idTypeDesc = value.typeName;
      _this.form.idCardType = value.id;
      _this.showCardType = false;
    },
    // 点击地址
    showPopup() {
      var _this = this;
      if(!_this.is_disabled){
        _this.AddrPopup = true;
      }
    },
    // 点击确认地址
    sureAddress(value) {
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
    // 删除身份证正面
    delPositive(){
      var _this = this;
      if(!_this.is_disabled){
        _this.form.fzrPositiveFilePath = "";
        _this.form.fzrPositiveFileName = "";
        return true;
      }else{
        return false;
      }
    },
    //删除身份证反面
    delNegative(){
      var _this = this;
      if(!_this.is_disabled){
        _this.form.fzrNegativeFilePath = "";
        _this.form.fzrNegativeFileName = "";
        return true;
      }else{
        return false;
      }
    },
    // 上传身份证正面
    uploadPositive(file) {
      var _this = this;
      _this.uploadFile(file, 3);
    },
    // 上传身份证反面
    uploadNegative(file) {
      var _this = this;
      _this.uploadFile(file, 4);
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
    uploadFile(params, fileType) {
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
              if (fileType == 3) {
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
    //编辑
    editClick(){
      var _this = this;
      _this.getAdress();
      _this.is_disabled = false;
      _this.showSaveBtn = true;
    },
    //取消
    cancelEditClick(){
      var _this = this;
      _this.getDetail();
      _this.is_disabled = true;
      _this.showSaveBtn = false;
    },
    //保存或者提交审核
    submitClick(isSubmit){
      var _this = this;
      if (_this.form.memberFullName == "") {
        _this.$toast("请填写姓名");
        return;
      }
      if (_this.form.memberPhone) {
        if(!validMobileNo(_this.form.memberPhone)){
          _this.$toast("请填写正确的手机号");
          return;
        }
      }
      if (_this.form.operatorLoginName == "") {
        _this.$toast("请填写登录名");
        return;
      }
      if(!validLoginName(_this.form.operatorLoginName)){
        _this.$toast("登录名以字母开头，只能包含字母、数字、下划线");
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
      _this.$http.post("/api/planner/member/cust/register",_this.form).then(function(res){
        var data =res.data;
        if(data.code==0){
          var result =data.data;
          if(result) {
            _this.$toast("操作成功");
            _this.is_disabled = true;
            _this.showSaveBtn = false;
            //返回列表
            _this.$router.push({
              path:'/customerList'
            });
          } else {
            _this.$toast("操作失败");
          }
        } else {
          _this.$toast(data.msg);
        } 
      });
    },
    //删除弹窗
    deleteClick(){
      var _this = this;
      _this.showDelete = true;
    },
    //确认删除
    confirmDelete(){
      var _this = this;
      _this.$http.get("/api/planner/member/cust/delete",{params:{memberGuid:_this.form.memberGuid}}).then(function (res) {
        var data = res.data;
        if (data.code == 0) {
          _this.$toast("删除成功");
          //返回列表
          _this.$router.push({
            path:'/customerList'
          });
        } else {
          _this.$toast(data.msg);
        }
      });
    },
    //审核弹窗
    // reviewClick(type){
    //   var _this = this;
    //   _this.showReview = true;
    //   _this.reviewForm.reviewStatus = type;
    // },
    //确认审核
    // confirmReview(action,done){
    //   var _this = this;
    //   if(action === 'confirm') {
    //     if(_this.reviewForm.reviewOpinion){
    //       _this.$http.get("/api/planner/member/review",{params:_this.reviewForm}).then(function (res) {
    //         var data = res.data;
    //         if (data.code == 0) {
    //           _this.$toast("成功");
    //           //返回列表
    //           _this.$router.push({
    //             path:'/customerList'
    //           });
    //         } else {
    //           _this.$toast(data.msg);
    //         }
    //       });
    //       done();//关闭
    //     } else {
    //       _this.$toast("请填写审核意见");
    //       done(false);//不关闭
    //     }
    //   } else if (action === 'cancel') {
    //     _this.reviewForm.reviewStatus = "";
    //     _this.reviewForm.reviewOpinion = "";
    //     done(); //关闭
    //   }
    // },

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
