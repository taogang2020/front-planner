<template>
  <div class="customerList">
    <van-nav-bar title="客户管理" right-text="客户代注册" @click-right="registerClick"/>
    <div class="listBox">
      <div class="clear title">
        <p class="fl">客户编号</p>
        <p class="fl">姓名</p>
        <p class="fl">证件号</p>
      </div>
      <ul class="list">
        <li class="clear" v-for='item in list' :key="item">
          <p class="fl">{{item.transferName}}</p>
          <p class="fl">{{item.tradeMoney}}</p>
          <p class="fl">{{item.assetsMoney}}</p>
        </li>
      </ul>
    </div>
    <van-overlay :show="show" @click="show = false">
      <div class="wrapper" @click.stop>
        <div class="block">
          <p><router-link :to="{name:'organRegister'}">企业</router-link></p>
          <p><router-link :to="{name:'personalRegister'}">个人</router-link></p>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
export default {
  name: "CustomerList",
  data() {
    return {
        list:[
            {'transferName':'票据资产01','tradeMoney':'1000','assetsMoney':'2000'},
            {'transferName':'票据资产02','tradeMoney':'1000','assetsMoney':'2000'},
            {'transferName':'票据资产03','tradeMoney':'1000','assetsMoney':'2000'}
        ],
        show:false,
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

  },
  methods: {
    // 点击返回
    cancel() {
      var _this = this;
      _this.$router.go(-1);
    },
    
    registerClick(){
        var _this = this;
        _this.show = true

    }
  }
};
</script>
<style>
.customerList .van-nav-bar .van-icon {
  color: #333;
}
.customerList .van-nav-bar__text {
  color: #333;
}
.customerList .van-nav-bar__left {
  left: 0;
}
.customerList .Btn .van-button {
  height: 0.7rem;
  line-height: 0.7rem;
  cursor: pointer;
  background-color: #ed2424;
  border: 1px solid #ed2424;
  color: #fff;
}
.customerList .van-nav-bar__text {
  color: #ed2424;
}
.customerList .wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.customerList .block {
  width: 3rem;
  height: 3rem;
  background-color: #fff;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.customerList {
  width: 7.5rem;
  font-size: 0.3rem;
}
a{
  color: #fff;
}
.customerList .listBox {
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
.block p{
    width: 2rem;
    height: 0.8rem;
    text-align: center;
    margin: 0.4rem auto;
    color: #fff;
    background: #ed2424;
    line-height: 0.8rem;
    border-radius: 0.08rem;

}
</style>
