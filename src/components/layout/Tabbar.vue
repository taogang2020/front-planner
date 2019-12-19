<template>
  <div class="Tabbar">
    

    <van-tabbar route active-color="#ed2424">
      <van-tabbar-item replace to="/tradeList" icon="wap-home">交易市场</van-tabbar-item>
      <van-tabbar-item replace to="/customerList" icon="column">客户</van-tabbar-item>
      <van-tabbar-item replace to="/user" icon="manager">个人中心</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'Tabbar',
  data () {
    return {
      
     
    }
  },
   methods: {
     
   },
  created() {
    
  }
}
</script>
<style>
.Tabbar .van-tabbar-item--active .van-tabbar-item__text {
  color: #252f3f;
}
.Tabbar .van-tabbar-item__icon {
  font-size: 0.5rem;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.Tabbar {
  width: 7.5rem;
  height: 1rem;
}
a {
  color: #99a0aa;
}
</style>
