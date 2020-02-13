<template>
  <div class="whiteList">
    <van-nav-bar v-show="is_weixin" title="绑定白名单" style="height:0.9rem;position:fixed;width: 100%;"/>
    <div v-show="is_weixin" style="height:0.9rem;width:100%"></div>
    <div class="top clear">
      <van-cell-group class="inp fl">
        <van-field
          v-model="value"
          placeholder="请输入用户名"
          right-icon="search"
          @click-right-icon="search"
        />
      </van-cell-group>
      <p class="fr choose" @click="bindClick">绑定</p>
    </div>
    <div class="item">
      <div class="title clear">
        <van-checkbox
          class="fl"
          v-model="checked"
          @change="checkAll"
          shape="square"
          checked-color="#ed2424"
        ></van-checkbox>
        <p class="fl titleName">用户名称</p>
        <p class="fl titleName">用户编号</p>
        <p class="fl titleName">是否已绑白名单</p>
      </div>
      <div class="clearFixd">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <div v-if='noData' class="noData"> 暂无数据 </div>
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
      <van-checkbox-group v-model="selectedData" ref="checkboxGroup" >
        <li class="list" v-for="item in myList" :key="item.memberId">
          <div class="checkbox fl">
            <van-checkbox
              v-show="item.isBind==2"
              shape="square"
              :name="item.memberId"
              :value="item.memberId"
              checked-color="#ed2424"
              ref="checkboxes"
              slot="right-icon"
              @click="changes"
            />
          </div>
          <span class="fl">{{item.memberFullName}}</span>
          <span class="fl">{{item.memberCode}}</span>
          <span v-if="item.isBind==1" class="fl">是</span>
          <span v-if="item.isBind==2" class="fl">否</span>
        </li>
      </van-checkbox-group>
      </van-list>
        </div>
      </van-pull-refresh>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BindWhiteList",
  data() {
    return {
      form:{
        issueGuid: "",
        memberFullName: '',
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      myList: [],
      value: "",
      result: [],
      checked: false,
      selectedData: [],
      is_weixin: false,
      isLoading: false, // 下拉的加载图案
      loading: false, // 当loading为true时，转圈圈
      finished: false, // 数据是否请求结束，结束会先显示- 没有更多了 -
      noData: false // 如果没有数据，显示暂无数
      
    };
  },

  mounted() {
    document
      .querySelector("body")
      .setAttribute("style", "background-color:#fff");
  },
  beforeDestroy() {
    document.querySelector("body").removeAttribute("style");
  },
  created() {
    var _this = this;
    _this.isWeixin();
    _this.getList();
  },
  methods: {
    // 判断是否微信打开
    isWeixin() {
      var _this = this;
      var ua = navigator.userAgent.toLowerCase();
      var isWeixin = ua.indexOf("micromessenger") != -1;
      if (isWeixin) {
        _this.is_weixin = false;
        return true;
      } else {
        _this.is_weixin = true;
        return false;
      }
    },
    // 获取集合
    getList() {
      var _this = this;
      _this.loading = true;
      _this.form.issueGuid = _this.$route.params.issueGuid;
      _this.$http.post("/api/planner/white/selectWhiteList",_this.form).then(function (res) {
        var data = res.data;
        if (data.code == 0) {
          _this.loading = false;
          _this.myList = _this.myList.concat(data.data.membersList.list);
          // 调用全选方法
          _this.checkAll();
          // 如果没有数据，显示暂无数据
          if (_this.myList.length === 0 && _this.form.pageNo === 1) {
            _this.noData = true;
            return;
          }
          // 如果加载完毕，显示没有更多了
          if (data.data.membersList.totalpage === _this.form.pageNo) {
            _this.finished = true;
          }
          if(Number(data.data.membersList.totalpage) > Number(_this.form.pageNo)) {
            _this.form.pageNo ++;
          }
        } else {
          _this.$toast(data.msg);
        }
      })
    },
    // 列表上拉加载
    onLoad() {
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
    // 单选
    changes() {
      var _this = this;
      setTimeout(() => {
        console.log(this.selectedData, 111)
      })
    },
    // 全选
    checkAll() {
      var _this = this;
      var key = _this.checked;
      var listArr = _this.myList;
      let ids = [];
      // 选中
      if (Number(key) == 1) {
        listArr.forEach(function(value) {
          if(value.isBind==2){
            ids.push(value.memberId);
          }
        });
        _this.selectedData = ids;
      } else {
        // // 取消选中
        // listArr.forEach(value => {
        //   if(value.is_check==1){
        //     if (!_this.selectedData.includes(value.id)) {
        //       ids.push(value.id);
        //     }
        //    }
        // });
        _this.selectedData = [];
      }
      console.log(_this.selectedData, 222);
    },
    // 搜索
    search() {},
    // 点击绑定
    bindClick() {
      var _this = this;
      console.log(_this.result);
    },

    // 点击返回
    onClickLeft() {}
  }
};
</script>
<style>
.whiteList .inp {
  width: 6.4rem;
  height: 0.6rem;
  border: 0.02rem solid #666;
  border-radius: 0.05rem;
}
.whiteList .inp .van-cell {
  padding: 0.05rem;
  font-size: 0.25rem;
}
.whiteList .van-nav-bar .van-icon {
  color: #333;
}
.whiteList .van-nav-bar__text {
  color: #333;
}
.whiteList .van-nav-bar__left {
  left: 0;
}
.whiteList .van-nav-bar__right .van-nav-bar__text {
  color: #ed2424;
}
.whiteList .van-checkbox {
  margin-top: 0.2rem;
}
.whiteList .title .van-checkbox {
  margin-top: 0.05rem;
}
.whiteList .van-checkbox__icon {
  width: 0.3rem;
  height: 0.3rem;
}
.whiteList .van-icon-success {
  width: 0.3rem;
  height: 0.3rem;
  font-size: 0.3rem;
  line-height: 0.3rem;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.whiteList {
  width: 7.5rem;
  height: auto;
  font-size: 0.3rem;
  font-size: 0.3rem;
}
.whiteList .choose {
  color: #333;
  font-size: 0.3rem;
  line-height: 0.6rem;
}
.noData{
  font-size: 0.3rem;
  line-height: 0.5rem;
  text-align: center;
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
.item {
  width: 100%;
  height: 0.8rem;
  padding: 0.2rem 0.1rem;
  box-sizing: border-box;
}
.item li {
  width: 100%;
  height: 0.8rem;
  border-bottom: 0.01rem solid #ccc;
}
.title {
  padding-bottom: 0.2rem;
  border-bottom: 0.01rem solid #ccc;
}
.titleName {
  width: 2.3rem;
  text-align: center;
  font-size: 0.25rem;
}
.list span {
  width: 2.3rem;
  text-align: center;
  display: block;
  line-height: 0.8rem;
  font-size: 0.2rem;
  color: #252f3f;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.checkbox {
  width: 0.3rem;
  height: 0.3rem;
}
</style>
