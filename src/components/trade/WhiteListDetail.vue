<template>
  <div class="whiteListDetail">
    <van-nav-bar v-show="is_weixin" title="详情" />
    <div class="content">
      <van-cell-group>
        <van-field v-model="form.agencyName" disabled label="渠道名称:" />
        <van-field v-model="form.accountStatusDesc" disabled label-width="2.4rem" label="资金账户状态:" />
        <van-field v-model="form.memberCode" disabled label="用户编号:" />
        <van-field v-model="form.memberFullName" disabled label="用户名称:" />
        <van-field v-model="form.memberTypeDesc" disabled label="用户类型:" />
        <van-field v-if="!isOrgan" v-model="form.idCard" disabled label="证件号:" />
        <van-field
          v-if="isOrgan"
          v-model="form.companyCreditCode"
          disabled
          label-width="2.6rem"
          label="统一社会信用代码:"
        />
        <van-field v-model="form.bankName" disabled label="开户银行:" />
        <van-field v-model="form.accountName" disabled label="账户名称:" />
        <van-field v-model="form.cardAccount" disabled label="银行卡卡号:" />
        <van-field v-if="isOrgan" v-model="form.bankContact" disabled label="联系人姓名:" />
        <van-field v-model="form.channelAccountName" label-width="2.4rem" disabled label="渠道账户名称:" />
        <van-field v-model="form.channelCardAccount" disabled label="渠道账号:" />
      </van-cell-group>
    </div>
    <div class="secondBtn">
      <van-button type="default" class="pre" @click="cancel">返 回</van-button>
    </div>
  </div>
</template>

<script>
import { validMobileNo, validIdCard, validLoginName } from "@/utils/validate";
export default {
  name: "whiteListDetail",
  data() {
    return {
      form: {},
      isOrgan: false,
      is_weixin: false
    };
  },

  created() {
    var _this = this;
    _this.getOperatorDetail();
    _this.isWeixin();
  },

  methods: {
    // 判断是否是微信打开
    isWeixin() {
      var _this = this;
      var ua = navigator.userAgent.toLowerCase();
      var isWeixin = ua.indexOf("micromessenger") != -1;
      if (isWeixin) {
        _this.is_weixin = false;
        return true;
      } else {
        _this.is_weixin = true;
        return false;
      }
    },
    //获取操作员信息
    getOperatorDetail() {
      var _this = this;
      var bankChannel = 1; //目前只有贵州场外
      var memberGuid = _this.$route.params.memberGuid;
      _this.$http
        .get("/api/planner/member/cust/search/detail", {
          params: { bankChannel: bankChannel, memberGuid: memberGuid }
        })
        .then(function(res) {
          var data = res.data;
          if (data.code == 0) {
            if (data.data.membersAccountVo.memberType == 1) {
              _this.isOrgan = true;
            } else {
              _this.isOrgan = false;
            }
            _this.form = data.data.membersAccountVo;
          } else {
            _this.$toast(data.msg);
          }
        });
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
.whiteListDetail .edit {
  top: 0.2rem;
}
.whiteListDetail .van-nav-bar__left .van-icon {
  top: 0;
}
.whiteListDetail .van-nav-bar .van-icon {
  color: #333;
}
.whiteListDetail .van-nav-bar__left {
  left: 0;
}
.whiteListDetail .van-nav-bar__text {
  color: #333;
}
.whiteListDetail .content .van-cell {
  width: 7.5rem;
  height: 1rem;
  line-height: 0.6rem;
  font-size: 0.3rem;
  margin-bottom: 0.1rem;
}
.whiteListDetail .content .van-cell-group {
  background: transparent;
  margin-top: 0.1rem;
}
.whiteListDetail .van-cell:not(:last-child)::after {
  border-bottom: none !important;
}
.whiteListDetail .van-hairline--top::after {
  border-top-width: 0px !important;
}
.whiteListDetail .van-radio-group {
  background: #fff;
  float: right;
}
.whiteListDetail .van-radio {
  float: left;
  margin-left: 0.5rem;
  margin-top: 0.1rem;
}
.whiteListDetail .van-field__control {
  text-align: right;
}
.whiteListDetail .secondBtn {
  width: 1.5rem;
  margin: 0 auto;
}
.whiteListDetail .secondBtn .van-button {
  width: 1.5rem;
  height: 0.7rem;
  line-height: 0.7rem;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.whiteListDetail {
  width: 7.5rem;
  font-size: 0.3rem;
}
.content {
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
.sex {
  color: #323233;
  line-height: 1rem;
  margin: 0 0.3rem;
}
</style>
