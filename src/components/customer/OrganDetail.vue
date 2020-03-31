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
              <van-field v-model="form.memberFullName" required :disabled="is_disabled" label="企业全称:" placeholder="请输入企业全称"/>
              <van-field v-model="form.memberName" label="企业简称:" :disabled="is_disabled" placeholder="请输入企业简称"/>
              <van-field v-model="form.companyCreditCode" required :disabled="is_disabled" label-width="2.7rem" label="统一社会信用代码:" placeholder="请输入统一社会信用代码"/>
              <van-field :value="form.companyTypeDesc" required label="企业类型:" :disabled="is_disabled" clickable  @click="companyTypeSelect" placeholder="请选择企业类型" />
              <van-field v-model="form.legalMan" required :disabled="is_disabled" label="企业法人:" placeholder="请输入企业法人"/>
              <van-field :value="form.legalIdCardTypeDesc" required @click="legalIdCardTypeSelect" label="法人证件类型:" label-width="2.6rem" :disabled="is_disabled" clickable  placeholder="请选择" />
              <van-field v-model="form.legalIdCard" required label="法人证件号:" label-width="2.6rem" :disabled="is_disabled" placeholder="请输入法人证件号"/>
              <van-field v-model="form.openTime" label="成立时间:"  :disabled="is_disabled" @click="showTimeSelect" placeholder="请选择成立时间"/>
              <van-field v-model="form.totalAssets" label="总资产(亿):" :disabled="is_disabled" placeholder="请输入总资产"/>
              <van-field v-model="form.netAssets" label="净资产(亿):" :disabled="is_disabled" placeholder="请输入净资产"/>
              <van-field v-model="form.fundsSources" label="资金来源:" :disabled="is_disabled" placeholder="请输入资金来源"/>
              <van-field :value="form.address" label="注册地址:" @click="showPopup" :disabled="is_disabled"  placeholder="请选择注册地址" />
              <van-field v-model="form.memberAddress" label="详细地址:" :disabled="is_disabled" placeholder="请输入详细地址"/>
            </van-cell-group>
            <van-field v-model="form.businessScope" rows="1" class='textarea' type="textarea" autosize :disabled="is_disabled" label="业务经营范围:" label-width="2.4rem"  placeholder="请输入业务经营范围" />
          </div>
          <div class="text" style="margin-top:0.1rem">
            <van-field v-model="form.operatorName" required label="业务负责人:" label-width="2.6rem" :disabled="is_disabled" placeholder="请输入业务负责人" />
            <van-field :value="form.operatorIdTypeDesc" required @click="cardTypeSelect" label="证件类型:"  :disabled="is_disabled" clickable  placeholder="请选择证件类型" />
            <van-field v-model="form.operatorIdCard" required label="业务负责人证件号:" label-width="2.6rem" :disabled="is_disabled" placeholder="请输入证件号"/>
            <van-field v-model="form.memberPhone" label="手机号:"  :disabled="is_disabled" placeholder="请输入手机号" />
            <van-field v-model="form.operatorLoginName" required label="登录名:" :disabled="is_disabled" placeholder="请输入登录名" />
          </div>
        </van-tab>
        <van-tab title="证明文件">
          <div class="ImgBox clear">
            <div class="file  fl">
              <van-uploader v-model="yyzzFileList" :before-read='beforeUpload' :disabled="is_disabled" :max-count="1" :after-read="uploadYyzz" :before-delete="delYyzz" :deletable="is_del"/>
              <p>营业执照</p>
            </div>
            <div class="file fr">
              <van-uploader v-model="sqwtsFileList" :before-read='beforeUpload' :disabled="is_disabled" :max-count="1" :after-read="uploadSqwts" :before-delete="delSqwts" :deletable="is_del"/>
              <p>授权人委托书</p>
            </div>
            <div class="file idCardPositive fl">
              <van-uploader v-model="positiveFileList" :before-read='beforeUpload' :disabled="is_disabled" :max-count="1" :after-read="uploadPositive" :before-delete="delPositive" :deletable="is_del"/>
              <p>负责人身份证正面</p>
            </div>
            <div class="file idCardPositive fr">
              <van-uploader v-model="reverseFileList" :before-read='beforeUpload' :disabled="is_disabled" :max-count="1" :after-read="uploadNegative" :before-delete="delNegative" :deletable="is_del"/>
              <p>负责人身份证反面</p>
            </div>
            <div class="file fl">
              <van-uploader v-model="otherFileList" :before-read='beforeUpload' :disabled="is_disabled" :max-count="1" :after-read="uploadOther" :before-delete="delOther"/>
              <p>其他</p>
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
        <van-button type="danger" class="pre" style="width:1.8rem" v-if="showSaveBtn" @click="submitClick(1)">成为用户</van-button>
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
    <!-- 地址选择器 -->
    <van-popup v-model="AddrPopup" position="bottom" :style="{ height: '40%' }" >
      <van-area show-toolbar :area-list="areaList" @cancel="AddrPopup = false" @confirm="sureAddress" />
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
import { validMobileNo,validIdCard,validLoginName } from "@/utils/validate";
import {dateCommonFormat } from '@/utils/common';
export default {
  name: "OrganDetail",
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
      showcompanyType: false,
      showlegalIdCardType: false,
      showTime:false,
      AddrPopup:false,
      showCardType: false,
      is_disabled: true,
      showSaveBtn : false,
      showDelete : false,
      showReview : false,
      is_del:false,
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
            }
          } else {
            _this.$toast(data.msg);
          }
        })
    },
    //企业类型选择
    companyTypeSelect(){
      var _this = this;
      if(!_this.is_disabled){
        _this.showcompanyType = true;
      }
    },
    //法人证件类型选择
    legalIdCardTypeSelect(){
      var _this = this;
      if(!_this.is_disabled){
        _this.showlegalIdCardType = true;
      }
    },
    //成立时间选择
    showTimeSelect(){
      var _this = this;
      if(!_this.is_disabled){
        _this.showTime = true;
      }
    },
    //负责人证件类型选择
    cardTypeSelect(){
      var _this = this;
      if(!_this.is_disabled){
        _this.showCardType = true;
      }
    },
    // 点击地址
    showPopup() {
      var _this = this;
      if(!_this.is_disabled){
        _this.AddrPopup = true;
      }
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
      _this.showcompanyType = false;
    },
    // 点击确认法人证件类型
    onLegalIdCardType(value) {
      var _this = this;
      _this.form.legalIdCardTypeDesc = value.typeName;
      _this.form.legalIdCardType = value.id;
      _this.showlegalIdCardType = false
    },
    // 点击确定成立时间
    onShowTime(value) {
      var _this = this;
      _this.form.openTime = dateCommonFormat(value);
      _this.showTime = false;
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
      if(!_this.is_disabled){
        _this.form.yyzzFilePath = "";
        _this.form.yyzzFileName = "";
        return true;
      }else{
        return false;
      }
    },
    // 删除授权人委托书
    delSqwts() {
      var _this = this;
      if(!_this.is_disabled){
        _this.form.sqwtsFilePath = "";
        _this.form.sqwtsFileName = "";
        return true;
      }else{
        return false;
      }
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
    // 删除其他
    delOther() {
      var _this = this;
      if(!_this.is_disabled){
        _this.form.otherFilePath = "";
        _this.form.otherFileName = "";
        return true;
      }else{
        return false;
      }
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
    //编辑
    editClick(){
      var _this = this;
      _this.getAdress();
      _this.is_disabled = false;
      _this.showSaveBtn = true;
      _this.is_del = true;
    },
    //取消
    cancelEditClick(){
      var _this = this;
      _this.getDetail();
      _this.is_disabled = true;
      _this.showSaveBtn = false;
      _this.is_del = false;
    },
    //保存或者提交审核
    submitClick(isSubmit){
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
        _this.$toast("请输入正确的负责人证件号");
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
