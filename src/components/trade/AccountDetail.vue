<template>
  <div class="AccountDetail">
    <van-nav-bar v-show='is_weixin' title="资金到账明细"  right-text="明细" @click-right="detailClick"
    />
    <div>
      <van-cell-group>
        <van-field v-model="form.name" label="客户名称:" readonly />
        <van-field v-model="form.bankNo" label="银行卡号:" readonly />
        <van-field v-model="form.bankName" label="开户银行:" readonly />
        <van-field v-model="form.money" label="到账金额:" readonly />
        <van-field
          v-model="form.transferMoney"
          label="转让代码:"
          @click="showTransferCode = true"
          readonly
          placeholder="请选择"
        />
        <van-field v-model="form.transferMoney" label="转让名称:" placeholder="请输入转让名称" />
        <div>
          <van-field class="transferMoney fl" v-model="form.transferMoney" label="交易金额:" placeholder="请输入交易金额" />
          <span class="fl amount">全额到账</span>
        </div>
        <van-field v-model="form.assets" label="购买资产:" placeholder="请输入购买资产" />
      </van-cell-group>
    </div>
    <div class="Btn">
      <van-button type="danger">确 认</van-button>
      <van-button @click="cancel" type="default">取 消</van-button>
    </div>
    <!-- 转让代码选择器 -->
    <van-popup v-model="showTransferCode" position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        value-key="name"
        @cancel="showTransferCode = false"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "AccountDetail",
  data() {
    return {
      form: {
        name: "",
        bankNo: "",
        bankName: "",
        money: "",
        transferMoney: "",
        assets: ""
      },
      showTransferCode: false,
      columns: [
        { name: "浙江", id: 1 },
        { name: "宁波", id: 2 },
        { name: "上海", id: 3 },
        { name: "北京", id: 4 },
        { name: "杭州", id: 5 }
      ],
      is_weixin:false,
    };
  },
  created(){
    var _this = this;
    _this.isWeixin();

  },
  methods: {
    // 判断是否微信打开
    isWeixin(){
      var _this = this;
      var ua = navigator.userAgent.toLowerCase();
      var isWeixin = ua.indexOf('micromessenger') != -1;
      if (isWeixin) {
        _this.is_weixin = false;
        return true;
      } else {
        _this.is_weixin = true;
        return false;
      }
    },

    // 点击确定转让代码
    onConfirm(value) {
      var _this = this;
      var keyId = value.id;
      var text = value.name;
      _this.form.value = text;
      console.log("当前值" + keyId + "当前索引" + text);
      _this.showTransferCode = false;
    },
    // 明细点击
    detailClick() {

    },
    // 点击返回
    cancel() {
      var _this = this;
      _this.$router.go(-1);
    },
   
  }
};
</script>
<style>
.AccountDetail .van-button {
  width: 1.3rem;
  height: 0.7rem;
  line-height: 0.7rem;
  cursor: pointer;
}
.AccountDetail .van-nav-bar .van-icon {
  color: #333;
}
.AccountDetail .van-nav-bar__text {
  color: #333;
}
.AccountDetail .van-nav-bar__left {
  left: 0;
}
.AccountDetail .van-cell {
  width: 7.5rem;
  height: 1rem;
  line-height: 0.6rem;
  font-size: 0.3rem;
  margin-bottom: 0.1rem;
}
.AccountDetail .van-cell-group {
  background: transparent;
}
.AccountDetail .van-button--danger {
  color: #fff;
  background-color: #ed2424;
  border: 1px solid #ed2424;
}
.AccountDetail .van-nav-bar__right .van-nav-bar__text {
  color: #ed2424;
}
.AccountDetail .van-picker__confirm {
  color: #ed2424;
}
.AccountDetail .van-picker__cancel {
  color: #666;
}
.AccountDetail .van-field__control {
  text-align: right;
}
.AccountDetail .transferMoney {
  width: 5.5rem;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.AccountDetail {
  width: 7.5rem;
  font-size: 0.25rem;
}
.AccountDetail p {
  color: #333;
  font-size: 0.3rem;
  line-height: 0.6rem;
  margin-bottom: 0.2rem;
}
.Btn {
  text-align: center;
}
.amount {
  font-size: 0.26rem;
  display: block;
  width: 1.2rem;
  height: 0.6rem;
  background: red;
  margin-left: 0.2rem;
  margin-top: 0.2rem;
  color: #fff;
  text-align: center;
  line-height: 0.6rem;
  border-radius: 0.04rem;
}
</style>
