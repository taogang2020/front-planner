<template>
  <div class="capitalDetail">
    <van-nav-bar v-show='is_weixin' title="资金到账明细" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div class="listBox">
      <div class="clear title">
        <p class="fl">转让名称</p>
        <p class="fl">交易金额</p>
        <p class="fl">资产金额</p>
      </div>
      <ul class="list">
        <li class="clear" v-for='item in list' :key="item">
          <p class="fl">{{item.transferName}}</p>
          <p class="fl">{{item.tradeMoney}}</p>
          <p class="fl">{{item.assetsMoney}}</p>
        </li>
      </ul>
    </div>
    <div class="Btn">
      <van-button @click="cancel" type="default">返 回</van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CapitalDetail",
  data() {
    return {
        list:[
            {'transferName':'票据资产01','tradeMoney':'1000','assetsMoney':'2000'},
            {'transferName':'票据资产02','tradeMoney':'1000','assetsMoney':'2000'},
            {'transferName':'票据资产03','tradeMoney':'1000','assetsMoney':'2000'}
        ],
        is_weixin:false,
    };
  },
  mounted() {
    //改变body的背景色
    document.querySelector("body").setAttribute("style", "background:#fff");
  },
  // 销毁
  beforeDestroy() {
    document.querySelector("body").removeAttribute("style");
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
      if (isWeixin){
        _this.is_weixin = false;
        return true;
      }else{
        _this.is_weixin = false;
        return false;
      }
    },

    // 点击返回
    cancel() {
      var _this = this;
      _this.$router.go(-1);
    },
    // 点击左侧箭头
    onClickLeft() {
      var _this = this;
      _this.$router.go(-1);
    }
  }
};
</script>
<style>
.capitalDetail .van-nav-bar .van-icon {
  color: #333;
}
.capitalDetail .van-nav-bar__text {
  color: #333;
}
.capitalDetail .van-nav-bar__left {
  left: 0;
}
.capitalDetail .Btn .van-button {
  height: 0.7rem;
  line-height: 0.7rem;
  cursor: pointer;
  background-color: #ed2424;
  border: 1px solid #ed2424;
  color: #fff;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.capitalDetail {
  width: 7.5rem;
  font-size: 0.3rem;
}
.capitalDetail .listBox {
  padding: 0 0.3rem;
  box-sizing: border-box;
}
.title p {
  width: 2.3rem;
  text-align: center;
  line-height: 0.8rem;
}
.title {
  height: 0.8rem;
  border-bottom: 0.01rem solid #ccc;
}
.list li {
  width: 100%;
  height: 0.8rem;
  border-bottom: 0.01rem solid #ccc;
}
.list p {
  width: 2.3rem;
  text-align: center;
  line-height: 0.8rem;
  font-size: 0.25rem;
}
.Btn{
    width: 1.3rem;
    margin: 0.2rem auto
}
</style>
