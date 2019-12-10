<template>
  <div class="Tabber">
    <van-tabbar v-model="active" class="active_tab" >

      <van-tabbar-item>
            <router-link to="/tradeList">
                <span>交易市场</span>
            </router-link>
            <!-- <template slot="icon" slot-scope="props">
                <img :src="props.active ? home_icon.active : home_icon.normal"/>
            </template> -->
        </van-tabbar-item>

        <van-tabbar-item>
            <router-link to="/customerList">
                <span>客户</span>
            </router-link>
            <!-- <template slot="icon" slot-scope="props">
                <img :src="props.active ? category_icon.active : category_icon.normal"/>
            </template> -->
        </van-tabbar-item>

        <van-tabbar-item>
            <router-link to="/user">
                <span>个人中心</span>
            </router-link>
            <!-- <template slot="icon" slot-scope="props">
                <img :src="props.active ? message_icon.active : message_icon.normal"/>
            </template> -->
        </van-tabbar-item>

    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'Tabbar',
  data () {
    return {
      currIndex: 0,
      active: 0,
      home_icon: {
          normal: require('../../assets/imgs/product_list_tab1.png'),
          active: require('../../assets/imgs/product_list_tab2.png')
      },
      category_icon: {
          normal: require('../../assets/imgs/product_list_tab1.png'),
          active: require('../../assets/imgs/product_list_tab2.png')
      },
      message_icon: {
          normal: require('../../assets/imgs/product_list_tab1.png'),
          active: require('../../assets/imgs/product_list_tab2.png')
      },
     
    }
  },
   methods: {
     
   },
  created() {
    
  }
}
</script>
<style>
.active_tab .router-link-active {
    color: #252F3F;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.Tabber{
  width: 7.5rem;
}
a {
  color: #99A0AA;
}
</style>
