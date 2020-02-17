<template>
  <div class="tradeList">
    <div class="top clear">
      <van-cell-group class="fl inp">
        <van-field v-model="form.transferName" placeholder="请输入转让资产名称" />
      </van-cell-group>
      <p class="fr choose" @click="search">搜索</p>
    </div>
    <div class="clearFixd">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div class="noData" v-if="noData">暂无数据</div>
        <div v-else>
          <van-list
            class="list"
            ref="list"
            v-model="loading"
            :finished="finished"
            :offset="30"
            finished-text="- 没有更多了 -"
            @load="onLoad"
          >
            <div class="item" v-for='item in myList'>
              <div class="itemTop">
                <p class="fl name">{{item.transferName}}</p>
                <p class="fr channel">
                  银行渠道:
                  <span>{{item.registAgencyName}}</span>
                </p>
              </div>
              <div class="itemCenter van-clearfix">
                <p>
                  转让金额：
                  <span>{{item.transferMoney}}</span>元
                </p>
                <p v-if="item.transferRateType == 1">
                  固定收益率：
                  <span>年化{{item.transferRate}}</span>%
                </p>
                <p v-if="item.transferRateType == 2">
                  固定折价率：
                  <span>年化{{item.transferRate}}</span>%
                </p>
                <p>
                  转让到期日：
                  <span>{{item.transferEndTimeStr}}</span>
                  <span v-if="item.issueStatus==7 || item.issueStatus==8 || item.issueStatus==9" class="date">({{item.issueStatusDesc}})</span>
                  <span v-if="item.issueStatus!=7 && item.issueStatus!=8 && item.issueStatus!=9" class="date">(剩余{{item.transferEndDateAndNowDateDiff}}天)</span>
                </p>
              </div>
              <div class="clear">
                <div class="bind fl" @click="handelClick(item.issueGuid)">绑定白名单</div>
                <!-- <div class="bind fl" @click="detailClick()">资金到账情况</div> -->
              </div>
            </div>
          </van-list>
        </div>
      </van-pull-refresh>
    </div>
    <div class="bot">
      <!-- 底部 -->
      <tabbar-nav></tabbar-nav>
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
        <van-checkbox class="fl" name="1">0-1000w</van-checkbox>
        <van-checkbox class="fl" name="2">1000-5000w</van-checkbox>
        <van-checkbox class="fl" name="3">5000-10000w</van-checkbox>
      </van-checkbox-group>
      <p class="title">利率：</p>
      <van-checkbox-group v-model="rate" class="clear" @change="checkboxChangerate">
        <van-checkbox class="fl" name="1">0-10%</van-checkbox>
        <van-checkbox class="fl" name="2">10-15%</van-checkbox>
        <van-checkbox class="fl" name="3">15-20%</van-checkbox>
      </van-checkbox-group>
      <p class="title">银行渠道：</p>
      <van-checkbox-group v-model="channel" class="clear" @change="checkboxChangechanl">
        <van-checkbox class="fl" name="1">贵州场外</van-checkbox>
        <van-checkbox class="fl" name="2">山东金交</van-checkbox>
      </van-checkbox-group>
    </van-dialog>
  </div>
</template>

<script>
import tabbarNav from "../layout/Tabbar";
import {dateCommonFormat } from '@/utils/common';
export default {
  name: "TradeList",
  components: {
    tabbarNav
  },
  data() {
    return {
      form:{
        transferName:'',
        pageNo:1,
        pageSize:10,
        total:0,
      },
      dialog: false,
      transfer: [],
      rate: [],
      channel: [],
      isLoading: false, // 下拉的加载图案
      loading: false, // 当loading为true时，转圈圈
      finished: false, // 数据是否请求结束，结束会先显示- 没有更多了 -
      myList: [],
      noData: false // 如果没有数据，显示暂无数
    };
  },
  methods: {
    handelClick(issueGuid) {
      var _this = this;
      _this.$router.push({ 
        name:'bindWhiteList', 
        params:{'issueGuid' : issueGuid}, 
      })
    },
    // 获取列表
    getList(){
      var _this = this;
      var params = _this.form;
      // _this.finished = false;
      _this.loading = true;
      _this.$http.post("/api/planner/issue/selectParentAssetsIssue",params).then(function (res) {
        var data = res.data;
        if (data.code == 0) {
          _this.loading = false;
          _this.myList = _this.myList.concat(data.data.list);
          // 如果没有数据，显示暂无数据
          if (_this.myList.length === 0 && _this.form.pageNo === 1) {
            _this.noData = true;
            return;
          }
          // 如果加载完毕，显示没有更多了
          if (data.data.totalpage === _this.form.pageNo) {
            _this.finished = true;
          }
          if(Number(data.data.totalpage) > Number(_this.form.pageNo)) {
            _this.form.pageNo ++;
          }
        } else {
          _this.$toast(data.msg);
        }
      })
    },
    // 列表上拉加载
    onLoad() {
      // console.log(111)
      var _this = this;
      // 异步更新数据
      setTimeout(() => {
        _this.getList();
        _this.loading = true;
      }, 500)
    },
    // 下拉刷新
    onRefresh() {
      var _this = this;
      setTimeout(() => {
        // 重新初始化这些属性
        _this.isLoading = false;
        _this.myList = [];
        _this.form.pageNo = 1;
        _this.loading = false;
        _this.finished = false;
        _this.noData = false;
        // 请求信息
        _this.getList();
      }, 500)
    },
    // 搜索
    search() {
      var _this = this;
      _this.loading = false;
      _this.finished = false;
      _this.myList = [];
      _this.form.pageNo = 1;
      _this.getList();
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
    detailClick() {
      
    },
    //只能选择一个
    checkboxChangetra(val) {
      var _this = this;
      if (_this.transfer.length == 2) {
        _this.transfer.splice(0, 1);
      }
      console.log(_this.transfer.toString());
     

    },
    //只能选择一个
    checkboxChangerate(val) {
      var _this = this;
      if (_this.rate.length == 2) {
        _this.rate.splice(0, 1);
      }
    },
    //只能选择一个
    checkboxChangechanl(val) {
      var _this = this;
      if (_this.channel.length == 2) {
        _this.channel.splice(0, 1);
      }
    }
  }
};
</script>
<style>
.tradeList .inp {
  width: 6.4rem;
  height: 0.6rem;
  border: 0.02rem solid #666;
  border-radius: 0.05rem;
}
.tradeList .inp .van-cell {
  padding: 0.05rem;
  font-size: 0.25rem;
}
.tradeList .van-dialog__confirm,
.van-dialog__confirm:active {
  color: #ed2424;
}
.tradeList .van-dialog__content {
  padding: 0.2rem;
}
.tradeList .van-checkbox {
  margin-bottom: 0.15rem;
}
.tradeList .van-checkbox__icon {
  opacity: 0;
}
.tradeList .van-checkbox__label {
  border: 1px solid #ccc;
  padding: 0.05rem;
  font-size: 0.25rem;
  border-radius: 0.05rem;
}
.tradeList .van-checkbox__icon--checked + .van-checkbox__label {
  border: 1px solid #ed2424;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tradeList {
  width: 7.5rem;
}
.clearFixd{
  padding-top: 1rem;
  padding-bottom: 1rem;
  box-sizing: border-box;
}
.noData{
  font-size: 0.3rem;
  line-height: 0.5rem;
  text-align: center;
}
.top {
  width: 7.5rem;
  box-sizing: border-box;
  padding: 0.1rem ;
  background: #fff;
  position: fixed;
  z-index: 9;
}
.tradeList .choose {
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
  width: 3.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.channel {
  font-size: 0.25rem;
  line-height: 0.5rem;
  width: 3.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
.developing {
  display: block;
  width: 7.5rem;
  position: fixed;
  bottom: 1rem;
  top: 0;
}
.bot {
  height: 1rem;
  width: 100%;
  position: fixed;
  bottom: 0;
  z-index: 999;
}
</style>
