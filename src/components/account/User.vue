<template>
  <div>
    <div class="User">
      <div class="bg-color">
        <router-link :to="{name:'myAccount'}">
          <img class="fl" src="../../assets/imgs/head_port.png"/>
          <p class="fl">您好，{{form.operatorName}}</p>
        </router-link>
        <!-- <van-icon name="plus" size="0.4rem" color="#fff" /> -->
      </div>
      <div class="accountManger clear">
        <div class="item clear">
          <div class="fl list" @click="openAccount">
            <van-icon name="graphic" size="0.7rem" color="#ffd01e" />
            <p class="titlename">银行卡管理</p>
          </div>
          <div class="fl list" @click="insteadRegister">
            <van-icon name="friends" size="0.7rem" color="#ffd01e" />
            <p class="titlename">代注册</p>
          </div>
        </div>     
      </div>
    </div>
    <van-overlay :show="insteadRegisterShow" @click="insteadRegisterShow = false" >
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
  name: "Login",
  data() {
    return {
      form:{},
      insteadRegisterShow:false,
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
        } else {
          _this.$toast(data.msg);
        }
      })
    },
    //去往开户页面
    openAccount(){
      var _this = this;
      _this.$router.push({ 
        path:'/openAccountList',  
      })
    },
    //代注册
    insteadRegister(){
      var _this = this;
      _this.insteadRegisterShow = true;
    },
    
  }
};
</script>
<style>
.User .van-icon {
  left: 29%;
  top: 0.13rem;
  margin-top: 0.3rem;
}
.User .bg-color .van-icon{
  float: right;
  top: 0;
  left: 0;
  margin-top: 0;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.User {
  width: 7.5rem;
  height: auto;
  font-size: 0.28rem;
}
.User img {
  width: 1rem;
  height: 1rem;
}
.bg-color {
  padding: 0.2rem;
  box-sizing: border-box;
  width: 100%;
  height: 2rem;
  background: -webkit-linear-gradient(left, #eb3b3b, #f74a4a);
  background: -o-linear-gradient(left, #eb3b3b, #f74a4a);
  background: -moz-linear-gradient(left, #eb3b3b, #f74a4a);
  background: linear-gradient(left, #eb3b3b, #f74a4a);
}
.bg-color p {
  color: #fff;
  margin-top: 0.3rem;
  margin-left: 0.2rem;
}
.item{
  background: #fff;
  width: 100%;
  border-radius: 0.15rem;
  overflow: hidden;
}
.accountManger .list {
  width: 25%;
  height: 2.2rem;
  background: #fff;
  /* margin-right: 0.3rem; */
  font-size: 0.32rem;
  color: #252f3f;
  letter-spacing: 0.01rem;
}
.accountManger{
  width: 7.1rem;
  height: auto;
  margin: 0.2rem auto;
}
.titlename{
  text-align: center;
  font-size: 0.28rem;
  margin-top: 0.3rem;
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  top: 50%;
  height:3rem;
  margin-top:-1.5rem;
  font-size: 0.3rem;
}
.block {
  width: 3rem;
  height: 3rem;
  background-color: #fff;
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
.block a{
  color: #fff;
}

</style>
