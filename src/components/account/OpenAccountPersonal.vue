<template>
  <div class="openAccount">
    <van-nav-bar v-show="is_weixin" title="开通资金账户" />
    <div>
      <van-cell-group>
        <van-field v-model="form.userNo" label="客户编号:" readonly />
        <van-field v-model="form.name" label="客户名称:" readonly />
        <van-field v-model="form.Type" label="客户类型:" readonly />
        <van-field v-model="form.idCardType" label="证件类型:" readonly />
        <van-field v-model="form.idCard" label="证件号:" readonly />
        <van-field v-model="form.AccountName" label="账户名称:" placeholder="请输入账户名称：" />
        <van-field label="开户银行:" readonly clickable :value="form.bank" @click="bankArray = true" placeholder="请选择" />
        <van-field v-model="form.code" label="银行账号：" placeholder="请输入银行账号：" />
        <!-- 开户银行选择器 -->
        <van-popup v-model="bankArray" position="bottom">
            <van-picker
                show-toolbar
                :columns="columns"
                value-key="name"
                @cancel="bankArray = false"
                @confirm="onConfirm"
            />
        </van-popup>
      </van-cell-group>
      
    </div>
    <div class="Btn">
      <van-button type="danger" class="sure">确 认</van-button>
      <van-button type="default" class="sure">取 消</van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "OpenAccountPersonal",
  data() {
    return {
      form:{
        userNo: "",
        name: "",
        username: "",
        Type:'',
        idCardType:'',
        idCard:'',
        AccountName:'',
        bank:'',
      },
      show: false,
      columns: [
          {"name":"浙江","id":1},
          {"name":"宁波","id":2},
          {"name":"上海","id":3},
          {"name":"北京","id":4},
          {"name":"杭州","id":5}
      ],
      bankArray: false,
      is_weixin:false,
    };
  },
  created(){
    var _this = this;
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
    openBank() {
      var _this = this;
      _this.show = true;
    },
    onConfirm(value) {
      var _this = this;
      var keyId = value.id;
	    var text= value.name;
      console.log('当前值'+keyId + '当前索引'+text);
      _this.bankArray = false
    },
  }
};
</script>
<style>
.openAccount .van-button {
  width: 1.3rem;
  height: 0.7rem;
  line-height: 0.7rem;
  cursor: pointer;
}
.openAccount .van-nav-bar .van-icon{
  color: #333;
}
.openAccount .van-nav-bar__text{
  color: #333;
}
.openAccount .van-nav-bar__left{
  left: 0;
}
.openAccount .van-cell {
  width: 7.5rem;
  height: 1rem;
  line-height: 0.6rem;
  font-size: 0.3rem;
  margin-bottom: 0.1rem;
}
.openAccount .van-cell-group {
  background: transparent;
}
.openAccount .van-button--danger {
  color: #fff;
  background-color: #ed2424;
  border: 1px solid #ed2424;
}
.openAccount .van-action-sheet {
  max-height: 40%;
}
.openAccount .van-picker__confirm{
  color:#ed2424;
}
.openAccount .van-picker__cancel{
  color: #666;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.openAccount {
  width: 7.5rem；;
}
.openAccount p {
  color: #333;
  font-size: 0.3rem;
  line-height: 0.6rem;
  margin-bottom: 0.2rem;
}
.Btn {
  text-align: center;
}
.sure{
  width: 1.5rem
}
</style>
