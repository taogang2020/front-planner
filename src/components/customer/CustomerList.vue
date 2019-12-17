<template>
  <div class="customerList">
    <van-nav-bar title="客户管理" />
    <div class="listBox ">
      <div class="clear"><p class="titlename" @click="registerClick">客户代注册</p></div>
      <div class=" title">
        <p class="fl">客户编号</p>
        <p class="fl">客户全称</p>
        <p class="fl">客户类型</p>
      </div>

       
          <div v-if='noData'> 暂无数据 </div>
          <div v-else>
            <van-list
              class="list"
              ref="list"
              v-model="loading"
              :finished="finished"
              finished-text="- 没有更多了 -"
              @load="onLoad"
            >
            
              <div class="van-clearfix" v-for='item in myList' :key="item.assetsMoney" >
                <p class="fl" v-if="item.memberType == 1"><router-link :to="{name:'organDetail',params:{'memberGuid':item.memberGuid}}">{{item.memberCode}}</router-link></p>
                <p class="fl" v-if="item.memberType == 2"><router-link :to="{name:'personalDetail',params:{'memberGuid':item.memberGuid}}">{{item.memberCode}}</router-link></p>
                <p class="fl">{{item.memberFullName}}</p>
                <p class="fl">{{item.memberStatusDesc}}</p>
              </div>
            </van-list>
          </div>
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
      form:{
        memberFullName: '',
        memberPhone:'',
        memberType:-1,
        memberStatus:-1,
        pageNo:1,
        pageSize:10,
      },
      list:[],
      show:false,
      loading: false, // 当loading为true时，转圈圈
      finished: false, // 数据是否请求结束，结束会先显示- 没有更多了 -
      myList:[],
      noData: false, // 如果没有数据，显示暂无数
    



    };
  },
  created(){
    var _this = this;
    // _this.getList();
  },
  methods: {
    // 获取列表
    getList(){
      var _this = this;
      var params = _this.form;
      // _this.finished = false;
      _this.loading = true;
      _this.$http.post("/api/member/page/search",params).then(function (res) {
        var data = res.data;
        if (data.code == 0) {
          _this.loading = false;
          _this.myList = _this.myList.concat(data.data.pageData.list);
          // 如果没有数据，显示暂无数据
          if (_this.myList.length === 0 && _this.form.pageNo === 1) {
            _this.noData = true;
            return;
          }
          // 如果加载完毕，显示没有更多了
          if (data.data.pageData.totalpage === _this.form.pageNo) {
            _this.finished = true;
          }
          if(Number(data.data.pageData.totalpage) > Number(_this.form.pageNo)) {
            _this.form.pageNo ++;
          }      
        } else {
          _this.$toast(data.msg);
        }
      })
    },
     // 列表加载
    onLoad () {
      var _this = this;
      console.log(this.form.pageNo)
      _this.getList();
      // 异步更新数
      
    },
   


    handClick(item){
      console.log(item.memberGuid)
     // console.log(item.memberType)

    },
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
  position: relative;
  top: 50%;
  height:3rem;
  margin-top:-1.5rem;
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
  min-height: auto;
}

a{
  color: #ed2424;
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
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
.block a{
  color: #fff;
}
.titlename{
  width: 2rem;
  height: 0.7rem;
  background: red;
  text-align: center;
  float: right;
  color: #fff;
  border-radius: 0.05rem;
  margin: 0.1rem 0;
  line-height: 0.7rem;
}
</style>
