<template>
  <div class="capitalAccount">
    <van-nav-bar v-show ='is_weixin' title="资金到账明细" left-text="返回" right-text="全额到账" left-arrow @click-left="onClickLeft"  @click-right="accountClick"/>
    <div class="top clear">
      <van-cell-group class="inp">
        <van-field v-model="value" placeholder="请输入用户名" right-icon="search" @click-right-icon="search"/>
      </van-cell-group>
    </div>
    <div class="item">
      <div class="title clear">
        <!-- <div class="checkbox fl"><van-checkbox v-model="checked" @change="checkAll" shape="square" checked-color="#ed2424"></van-checkbox></div> -->
        <p class="fl titleName">客户名称</p>
        <p class="fl titleName">银行卡号</p>
        <p class="fl titleName">到账金额</p>
        <p class="fl titleName">备注</p>
      </div>
      <div class="clearFixd clear van-clearfix">
      <van-checkbox-group v-model="result" ref="checkboxGroup">
        <li class="list"  v-for = "item in list"  :key="item.id">
          <!-- <div class="checkbox fl" >
            <van-checkbox
              v-if="item.is_check==1"
              shape="square"
              :name="item.id"
              :value="item.id"
              checked-color="#ed2424"
              ref="checkboxes"
              slot="right-icon"
              @click="toggle(index,item.id)"
            />
          </div> -->
          <span class="fl">{{item.name}}</span>
          <span class="fl">{{item.idcard}}</span>
          <span class="fl">{{item.name}}</span>
        </li>
      </van-checkbox-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CapitalAccount",
  data() {
    return {
      value:'',
      result:[],
      is_weixin:false,
      checked:false,
      list:[
        {"name":"子文涵","id":4,"is_check":1,idcard:'中国工商(****1234)'},
        {"name":"桓何不","id":5,"is_check":0,idcard:'中国工商(****1234)'},
        {"name":"谷紫怡","id":6,"is_check":1,idcard:'中国工商(****1234)'},
        
      ],
      selectedData:[],
    };
  },
  mounted () {
     document.querySelector('body').setAttribute('style', 'background:#fff')
  },
  beforeDestroy() {
    document.querySelector('body').removeAttribute('style')
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
      if (isWeixin){
        _this.is_weixin = false;
        return true;
      }else{
        _this.is_weixin = false;
        return false;
      }
    },

    toggle(index,id) {
      var _this = this;
      this.$refs.checkboxes[index].toggle();
      console.log(id)
    },
    checkAll() {
      var _this = this;
      var key = _this.checked;
      var listArr = _this.list
      if(Number(key)==1){
        var checkArr=[]
        this.$refs.checkboxGroup.toggleAll(true);
        listArr.forEach(element => {
          if (this.selectedData.indexOf(element.id) < 0) {
             this.selectedData.push(element.id);
           }
         });
        console.log(_this.selectedData)
      }else{
        this.$refs.checkboxGroup.toggleAll();
        _this.selectedData=[];
      }
    },
    // 搜索
    search(){
      
 
    },
    accountClick() {
      var _this = this;
      console.log( _this.result)
    },

    // 点击返回
    onClickLeft() {
      
    },
  }
};
</script>
<style>

.capitalAccount .inp {
  width: 7.3rem;
  height: 0.6rem;
  border: 0.02rem solid #666;
  border-radius: 0.05rem;
}
.capitalAccount .inp .van-cell {
  padding: 0.05rem;
  font-size: 0.25rem;
}
.van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after{
    border-width:0 !important; 
}

.capitalAccount .van-nav-bar .van-icon{
  color: #333;
}
.capitalAccount .van-nav-bar__text{
  color: #333;
}
.capitalAccount .van-nav-bar__left{
  left: 0;
}
.capitalAccount .van-nav-bar__right .van-nav-bar__text{
  color: #ed2424;
}
.capitalAccount .van-checkbox{
  margin-top: 0.2rem;
}
.capitalAccount .title .van-checkbox{
  margin-top: 0.05rem;
}
.capitalAccount .van-checkbox__icon{
  width: 0.3rem;
  height: 0.3rem;
}
.capitalAccount .van-icon-success{
  width: 0.3rem;
  height: 0.3rem;
  font-size: 0.3rem;
  line-height: 0.3rem;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.capitalAccount{
  width: 7.5rem;
  height: auto;
  font-size: 0.3rem;
}
.item{
  width: 100%;
  height: 0.8rem;
   padding-top: 1rem;
  box-sizing: border-box;
}
.item li{
  width: 100%;
  height: 0.8rem;
  border-bottom: 0.01rem solid #ccc;
}
.title{
    position: fixed;
  background: #fff;
  z-index: 9;
  padding:0.2rem 0rem;
  box-sizing: border-box;
  width:7.3rem;
  margin-left: 0.1rem;
  border-bottom: 0.01rem solid #ccc;
}
.clearFixd{
  background: #fff;
  margin-top: 0.8rem;
  width: 100%;
  padding: 0 0.1rem;
  box-sizing: border-box;
}
.titleName{
  width: 1.75rem;
  text-align: center;
  font-size: 0.25rem;
}
.list span{
  width: 1.8rem;
  text-align: center;
  display: block;
  line-height: 0.8rem;
  font-size: 0.2rem;
  color: #252F3F;
}
.checkbox{
  width: 0.3rem;
  height: 0.3rem;
}
.top {
  width: 7.5rem;
  padding: 0.1rem;
  box-sizing: border-box;
  background: #fff;
  position: fixed;
  z-index: 9;
  height: 0.8rem;
  /* background: #fafafa; */
}


</style>
