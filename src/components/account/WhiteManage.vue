<template>
  <div class="whiteManage">
    <div class="top clear">
      <van-cell-group class="fl inp">
        <van-field v-model="value" placeholder="请输入用户名" right-icon="search" />
      </van-cell-group>
      <p class="fr choose" @click="screen">筛选</p>
    </div>
    <div class="list">
      <div class="item">
        <div class="itemTop">
          <p class="fl name">国盛资产转让1期</p>
          <p class="fr channel">
            银行渠道：<span>贵州场外</span>
          </p>
        </div>
        <div class="itemCenter">
          <p>
            转让金额：<span>12345</span>元
          </p>
          <p>
            转让折价率：<span>5</span>%
          </p>
          <p>
            资产到期日：<span>2020-06-09</span><span class="date">(剩余120天)</span>
          </p>
        </div>
        <div class="clear">
          <div class="bind fl" @click="handelClick()">绑定白名单</div>
          <div class="bind fl" @click="detailClick()">资金到账情况</div>
        </div>
      </div>
      <div class="item">
        <div class="itemTop">
          <p class="fl name">国盛资产转让1期</p>
          <p class="fr channel">
            银行渠道:
            <span>贵州场外</span>
          </p>
        </div>
        <div class="itemCenter">
          <p>
            转让金额：<span>12345</span>元
          </p>
          <p>
            转让折价率：<span>5</span>%
          </p>
          <p>
            资产到期日：<span>2020-06-09</span><span class="date">(剩余120天)</span>
          </p>
        </div>
        <div class="clear">
          <div class="bind fl" @click="handelClick()">绑定白名单</div>
          <div class="bind fl" @click="handelClick()">资金到账情况</div>
        </div>
        
      </div>
    </div>
    <van-dialog
      v-model="dialog"
      show-cancel-button
      confirmButtonColor="#ED2424"
      @open="open"
      :before-close="closeBtn"
      >
      <p class="title">转让金额：</p>
      <van-checkbox-group v-model="transfer" class="clear" @change="checkboxChangetra">
        <van-checkbox class="fl"  name='1'>0-1000w</van-checkbox>
        <van-checkbox class="fl"  name='2'>1000-5000w</van-checkbox>
        <van-checkbox class="fl"  name='3'>5000-10000w</van-checkbox>
      </van-checkbox-group>
      <p class="title">利率：</p>
      <van-checkbox-group v-model="rate" class="clear" @change="checkboxChangerate">
        <van-checkbox class="fl"  name='1'>0-10%</van-checkbox>
        <van-checkbox class="fl"  name='2'>10-15%</van-checkbox>
        <van-checkbox class="fl"  name='3'>15-20%</van-checkbox>
      </van-checkbox-group>
      <p class="title">银行渠道：</p>
      <van-checkbox-group v-model="channel" class="clear" @change="checkboxChangechanl">
        <van-checkbox class="fl"  name='1'>贵州场外</van-checkbox>
        <van-checkbox class="fl"  name='2'>山东金交</van-checkbox>
      </van-checkbox-group>
      
    </van-dialog>
  </div>
</template>

<script>
export default {
  name: "WhiteManage",
  data() {
    return {
      value: "",
      dialog: false,
      transfer: [],
      rate: [],
      channel: []
    };
  },
  methods: {
    handelClick() {
      var _this = this;
      _this.$dialog
        .alert({
          message:"绑定成功，为保证您的XX请及时进行线下打款操作，线下打款帐号：XXXXXXXXX",
            confirmButtonColor:'#ed2424'
        })
        .then(() => {
          // on close
        });
    },
    screen() {
      var _this = this;
      _this.dialog = true;
    },
    closeBtn(action, done) {
      var _this = this;
      if (action === "cancel") {
        //取消按钮

        done();
      } else if (action === "confirm") {
        //确定按钮
        _this.dialog = false;
        done();
      }
    },
    //   打开弹窗时清空数据
    open() {
      var _this = this;
      _this.transfer = [];
      _this.rate = [];
      _this.channel = [];
    },
    // 资金到账情况
    detailClick(){


    },
     //只能选择两个
    checkboxChangetra(val) {
      var _this = this;
      if(_this.transfer.length==2){
         _this.transfer.splice(0,1)
      }
    },
     //只能选择两个
    checkboxChangerate(val) {
      var _this = this;
      if(_this.rate.length==2){
         _this.rate.splice(0,1)
      }
    },
     //只能选择两个
    checkboxChangechanl(val) {
      var _this = this;
      if(_this.channel.length==2){
         _this.channel.splice(0,1)
      }
    },
  }
};
</script>
<style>
.whiteManage .inp {
  width: 6.4rem;
  height: 0.6rem;
  border: 0.02rem solid #666;
  border-radius: 0.05rem;
}
.whiteManage .inp .van-cell {
  padding: 0.05rem;
  font-size: 0.25rem;
}
.whiteManage .van-dialog__confirm,
.van-dialog__confirm:active {
  color: #ed2424;
}
.whiteManage .van-dialog__content {
  padding: 0.2rem;
}
.whiteManage .van-checkbox {
  margin-bottom: 0.15rem;
}
.whiteManage .van-checkbox__icon {
  opacity: 0;
}
.whiteManage .van-checkbox__label {
  border: 1px solid #ccc;
  padding: 0.05rem;
  font-size: 0.25rem;
  border-radius: 0.05rem;
}
.whiteManage .van-checkbox__icon--checked + .van-checkbox__label {
  border: 1px solid #ed2424;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.whiteManage{
  width: 7.5rem;
}
.top {
  padding: 0.1rem;
  background: #fff;
}
.whiteManage .choose {
  color: #333;
  font-size: 0.3rem;
  line-height: 0.6rem;
}
.list .item {
  width: 100%;
  height: auto;
  background: #fff;
  margin-bottom: 0.1rem;
  padding: 0.2rem 0.1rem;
  box-sizing: border-box;
}
.itemTop {
  height: 0.5rem;
  margin-bottom: 0.2rem;
}
.name {
  font-size: 0.32rem;
  color: #333;
  line-height: 0.5rem;
}
.channel {
  font-size: 0.25rem;
  line-height: 0.5rem;
}
.itemCenter {
  padding-left: 0.3rem;
  box-sizing: border-box;
}
.itemCenter p {
  font-size: 0.28rem;
  margin-bottom: 0.25rem;
  color: #666;
}
.date {
  color: #ed2424;
  margin-left: 0.15rem;
}
.bind {
  width: 1.6rem;
  height: 0.5rem;
  background: #ed2424;
  font-size: 0.25rem;
  text-align: center;
  line-height: 0.5rem;
  color: #fff;
  margin-left: 0.3rem;
  border-radius: 0.08rem;
  cursor: pointer;
}
.title {
  margin: 0.2rem 0;
  font-size: 0.3rem;
  color: #333;
}
</style>
