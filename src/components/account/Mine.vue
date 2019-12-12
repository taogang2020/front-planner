<template>
  <div class="Mine">
    <van-nav-bar  title="个人中心" />
    <div class="content" >
      <van-cell-group>
        <van-field v-model="form.operatorName" required label="操作员名称:" />
        <van-field v-model="form.operatorLoginName" required label="登录名:" />
        <van-field v-model="form.operatorPhone" label="手机号:"  />
        <van-cell title="性别" required>
          <van-radio-group v-model="form.gender" name="gender"  @change="changeSex">
            <van-radio name="1" checked-color="#ed2424">男</van-radio>
            <van-radio name="2" checked-color="#ed2424">女</van-radio>
          </van-radio-group>
        </van-cell>
        <van-field
              :value="form.idTypeDesc"
              required
              @click="showCardType = true"
              label="证件类型:"
              readonly
              clickable
              placeholder="请选择"
            />
        <van-field v-model="form.idCard" required label="证件号:" />
        <van-field v-model="form.operatorStatusDesc" disabled label="状态:" />
        <van-field v-model="form.department"  label="部门:" />
        <van-field v-model="form.duty"  label="职务:" />
      </van-cell-group>

    </div>
     <div class="secondBtn">
        <van-button type="danger" class="pre" @click="saveClick">保 存</van-button>
        <van-button type="default" class="pre" @click="cancel">取 消</van-button>
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
  </div>
</template>

<script>
import {validMobileNo, validIdCard, validLoginName } from "@/utils/validate";
export default {
  name: "Mine",
  data() {
    return {
      form:{},
      idTypeList: [],
      showCardType:false,
    };
  },

  created() {
    var _this = this;
    _this.getOperatorDetail();
  },

  methods: {
    //获取操作员信息
    getOperatorDetail(){
      var _this = this;
      var params = {'operatorGuid':sessionStorage.getItem("operatorguid")};
      this.$http.get("/api/members/operator/getOperatorDetail",{params:params}).then(function (res) {
        var data = res.data;
        if (data.code == 0) {
          _this.form = data.data.operatorVo;
          _this.idTypeList = data.data.zjTypeList;
          _this.form.gender = (data.data.operatorVo.gender).toString();
        } else {
          _this.$toast(data.msg);
        }
      })
    },
    // 点击确认身份证类型
    onConfirm(value) {
      var _this = this;
      _this.form.idTypeDesc = value.typeName;
      _this.form.idType = value.id;
      _this.showCardType = false;
    },
    //性别变化
    changeSex(name){
      var _this = this;
      _this.form.gender = name;
    },
    //保存
    saveClick(){
      var _this = this;
      if (_this.form.operatorName == "") {
        _this.$toast("请填写操作员名称");
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
      if (_this.form.operatorPhone) {
        if(!validMobileNo(_this.form.operatorPhone)){
          _this.$toast("请填写正确的手机号");
          return;
        }
      }
      if (_this.form.gender == "" || _this.form.gender == null || _this.form.gender == undefined) {
        _this.$toast("请选择性别");
        return;
      }
      if (_this.form.idType == "") {
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
      _this.$http.post("/api/members/operator/update",_this.form).then(function (res) {
        var data = res.data;
        if (data.code == 0) {
          _this.$toast(data.msg); 
        } else {
          _this.$toast(data.msg);
        }
      })
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
.Mine .edit {
  top: 0.2rem;
}
.Mine .van-nav-bar__left .van-icon{
  top: 0;
}
.Mine .van-nav-bar .van-icon {
  color: #333;
}
.Mine .van-nav-bar__left {
  left: 0;
}
.Mine .van-nav-bar__text{
  color: #333;
}
.Mine .content .van-cell {
  width: 7.5rem;
  height: 1rem;
  line-height: 0.6rem;
  font-size: 0.3rem;
  margin-bottom: 0.1rem;
}
.Mine .content .van-cell-group {
  background: transparent;
  margin-top: 0.1rem;
}
.Mine .van-cell:not(:last-child)::after{
  border-bottom: none !important;
}
.Mine .van-hairline--top::after {
  border-top-width: 0px !important;
}
.Mine .van-radio-group{
  background: #fff;
  float: right;
}
.Mine .van-radio{
  float: left;
  margin-left: 0.5rem;
  margin-top: 0.1rem;
}
.Mine .van-field__control {
  text-align: right;
}
.Mine .van-action-sheet {
  max-height: 40%;
}
.Mine .van-picker__confirm {
  color: #ed2424;
}
.Mine .van-picker__cancel {
  color: #666;
}
.Mine .van-button--danger {
  color: #fff;
  background-color: #ed2424;
  border: 1px solid #ed2424;
}
.Mine .secondBtn{
  width: 2.8rem;
  margin: 0 auto;
}
.Mine .secondBtn .van-button{
  width: 1.3rem;
  height: 0.7rem;
  line-height: 0.7rem;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.Mine{
  width: 7.5rem;
  font-size: 0.3rem;
}
.content{
  padding-bottom: 1rem;
}
.list {
  height: 1rem;
  background: #fff;
  padding: 0.2rem;
  border-bottom: 0.01rem solid #f3f3f3;
  font-size: 0.32rem;
  color: #252f3f;
  line-height: 1rem;
  letter-spacing: 0.01rem;
}
.sex{
  color: #323233;
  line-height: 1rem;
  margin: 0 0.3rem;
}
</style>
