<template>
  <div>
    <div class='main'>
        <!-- 这里是子组件的路由视图 -->
        <router-view></router-view>
    </div>
    
    <div class='bot'>
      <!-- 底部 -->
      <tabbar-nav></tabbar-nav>
    </div>
  </div>
</template>
<script>
// 引入侧边栏
import tabbarNav from './layout/Tabbar'
export default {
  name: 'Index',
  components: {
    tabbarNav,
  }
}
</script>

<style scoped>

.main{
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background: #fafafa;
}
.bot{
  height: 1rem;
  width: 100%;
  position: fixed;
  bottom: 0;
  z-index: 999;
}

</style>