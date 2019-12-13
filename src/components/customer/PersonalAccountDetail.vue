<template>
  <div class="personalWait">
    <van-nav-bar v-show="is_weixin" title="客户详情"/>
    <div>
      <van-tabs @click="onClick" sticky>
        <van-tab title="基本信息">
          <van-cell-group>
            <van-field v-model="form.memberFullName" disabled label="姓名:" required />
            <van-field v-model="form.memberPhone" disabled label="手机号:" />
            <van-field v-model="form.operatorLoginName" disabled required label="登录名:"  />
            <van-field v-model="form.idTypeDesc" disabled required label="证件类型:" />
            <van-field v-model="form.idCard" required disabled label="证件号:" />
            <van-field v-model="form.address" disabled label="地址:" />
            <van-field v-model="form.memberAddress" disabled label="详细地址:" />
          </van-cell-group>
        </van-tab>
        <van-tab title="证明文件">
          <div class="ImgBox clear">
            <div class="file idCardPositive fl">
              <van-uploader v-model="positiveFileList" :disabled="true" :deletable='false' :max-count="1"/>
              <p>身份证正面</p>
            </div>
            <div class="file idCardReverse fr">
              <van-uploader v-model="reverseFileList" :disabled="true" :deletable='false' :max-count="1"/>
              <p>身份证反面</p>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>
<script>
export default {
  name: "PersonalAccountDetail",
  data() {
    return {
      form: {},
      positiveFileList: [
        { url: '' },
      ],
      reverseFileList: [
        { url: '' },
      ],
      is_weixin:false,
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
        var guid = sessionStorage.getItem('guid')
        this.$http.get("/api/member/getMemberDetail",{params:{memberGuid:guid}}).then(function (res) {
          var data = res.data;
          if (data.code == 0) {
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
  }
};
</script>
<style>
.personalWait .van-button {
  height: 0.7rem;
  line-height: 0.7rem;
  cursor: pointer;
}
.personalWait .van-nav-bar .van-icon {
  color: #333;
}
.personalWait .van-nav-bar__text {
  color: #333;
}
.personalWait .van-nav-bar__left {
  left: 0;
}
.personalWait .van-cell {
  width: 7.5rem;
  height: 1rem;
  line-height: 0.6rem;
  font-size: 0.3rem;
  margin-bottom: 0.1rem;
}
.personalWait .van-cell-group {
  background: transparent;
}
.personalWait .van-button--danger {
  color: #fff;
  background-color: #ed2424;
  border: 1px solid #ed2424;
}
.personalWait .van-action-sheet {
  max-height: 40%;
}
.personalWait .van-picker__confirm {
  color: #ed2424;
}
.personalWait .van-picker__cancel {
  color: #666;
}
.personalWait .van-field__control {
  text-align: right;
}
.personalWait .van-tabs__wrap {
  margin-bottom: 0.3rem;
}
.personalWait .van-ellipsis {
  font-size: 0.3rem;
}
.personalWait .van-uploader__upload {
  width: 2rem;
  height: 2rem;
  margin: 0;
}
.personalWait .van-uploader {
  margin-left: 0.5rem;
  width: 2rem;
  height: 2rem;
}
.personalWait .van-uploader__wrapper {
  width: 2rem;
  height: 2rem;
}
.personalWait .van-uploader__input {
  width: 2rem;
  height: 2rem;
}
.personalWait .van-uploader__preview-image {
  width: 2rem;
  height: 2rem;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.personalWait {
  width: 7.5rem;
  padding-bottom: 1rem;
}
.personalWait p {
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
.personalWait a {
  color: #fff;
}
.file img{
  width: 2rem;
  height: 2rem;
  margin-left: 0.5rem;
}
</style>
