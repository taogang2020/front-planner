<template>
  <div class="whiteList">
    <van-nav-bar
      v-show="is_weixin"
      title="绑定白名单"
      style="height:0.9rem;position:fixed;width: 100%;"
    />
    <div v-show="is_weixin" style="height:0.9rem;width:100%"></div>
    <div class="listBox clear">
      <div class="top clear">
        <van-cell-group class="inp fl">
          <van-field
            v-model="value"
            placeholder="请输入用户名称"
            right-icon="search"
            @input="search"
          />
        </van-cell-group>
        
      </div>
      <div class="item">
        <div class="title clear">
          <van-checkbox
          icon-size="20px"
            class="fl"
            v-model="checked"
            @change="checkAll"
            shape="square"
            checked-color="#ed2424"
          ></van-checkbox>
          <p class="fl titleName">用户名称</p>
          <p class="fl titleName">用户编号</p>
          
          <p class="fl titleName">账号</p>
          <p class="fl titleName">白名单</p>
        </div>
        <div class="clearFixd clear van-clearfix">
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <div v-if="noData" class="noData">暂无数据</div>
            <div v-else>
              <van-list
                class="list van-clearfix"
                ref="list"
                v-model="loading"
                :finished="finished"
                :offset="30"
                finished-text="- 没有更多了 -"
                @load="onLoad"
              >
                <van-checkbox-group v-model="selectedData" ref="checkboxGroup">
                  <li class="list van-clearfix" v-for="item in myList" :key="item.memberId">
                    <div class="checkbox fl">
                      <van-checkbox
                        shape="square"
                        icon-size="20px"
                        v-show="item.bindStatus != 2 && item.bindStatus != 3"
                        :name="item.memberId"
                        :value="item.memberId"
                        checked-color="#ed2424"
                        ref="checkboxes"
                        slot="right-icon"
                        @click="changes(item.accountId)"
                      />
                    </div>
                    <span class="fl">{{item.memberFullName}}</span>
                    <span class="fl" style="color:#ed2424" @click="detailClick(item.memberGuid)">{{item.memberCode}}</span>
                    <span class="fl"><span style="width:1rem;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{item.bankName}}</span><span style="width:0.6rem;display: inline-block;"> | {{item.accountNo.substring(item.accountNo.length-4)}}</span></span>
                    <span class="fl">{{item.bindStatusDesc}}</span>
                  </li>
                </van-checkbox-group>
              </van-list>
            </div>
          </van-pull-refresh>
        </div>
      </div>
      
    </div>
    <div class="botBtn">
    <p class="choose" @click="bindClick">绑定</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "BindWhiteList",
  data() {
    return {
      form: {
        issueGuid: "",
        memberFullName: "",
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      bindForm: {
        issueGuid: "",
        idsArray:[],
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
      noData: false, // 如果没有数据，显示暂无数
    };
  },

  mounted() {
    document.querySelector("body").setAttribute("style", "background-color:#fff");
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
      _this.$http
        .post("/api/planner/white/selectWhiteList", _this.form)
        .then(function(res) {
          var data = res.data;
          if (data.code == 0) {
            _this.loading = false;
            _this.myList = _this.myList.concat(data.data.membersList.list);
            // 调用全选方法
            if(Number(_this.checked) == 1){
              _this.checkAll();
            }
            // 如果没有数据，显示暂无数据
            if (_this.myList.length === 0 && _this.form.pageNo === 1) {
              _this.noData = true;
              return;
            }
            // 如果加载完毕，显示没有更多了
            if (data.data.membersList.totalpage === _this.form.pageNo) {
              _this.finished = true;
            }
            if (
              Number(data.data.membersList.totalpage) >
              Number(_this.form.pageNo)
            ) {
              _this.form.pageNo++;
            }
          } else {
            _this.$toast(data.msg);
          }
        });
    },
    // 列表上拉加载
    onLoad() {
      var _this = this;
      // 异步更新数据
      setTimeout(() => {
        console.log(_this.selectedData,333);
        _this.getList();
        _this.loading = true;
      }, 500);
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
      }, 500);
    },
    // 单选
    changes(accountId) {
      var _this = this;
      setTimeout(() => {
        console.log(_this.selectedData,111);
      });
    },
    // 全选
    checkAll() {
      var _this = this;
      var key = _this.checked;
      var listArr = _this.myList;
      var ids=[];
      // 选中
      if (Number(key) == 1) {
        listArr.forEach(function(value) {
          if (value.bindStatus != 2 && value.bindStatus != 3) {
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
      // console.log(_this.selectedData, 222);
    },
    // 搜索
    search() {
      var _this = this;
      _this.loading = false;
      _this.finished = false;
      _this.noData = false;
      _this.myList = [];
      _this.form.pageNo = 1;
      _this.form.memberFullName = _this.value;
      _this.getList();    
    },
    // 点击绑定
    bindClick() {
      var _this = this;
      _this.bindForm.issueGuid = _this.$route.params.issueGuid;
      _this.myList.forEach(value=>{
          // console.log(value);
          if(_this.selectedData.includes(value.memberId)){
            _this.bindForm.idsArray.push({memberId:value.memberId, accountId:value.accountId});
          }
      })
      if(_this.bindForm.idsArray.length == 0){
        _this.$toast("请选择要绑定的数据");
        return;
      }
      _this.$http
        .post("/api/planner/white/batchBindWhiteList", _this.bindForm)
        .then(function(res) {
          var data = res.data;
          if (data.code == 0 && data.data.bindStatus==2) {
            _this.$toast("受理成功");
            _this.loading = false;
            _this.finished = false;
            _this.myList = [];
            _this.form.pageNo = 1;
            _this.getList();
          }else if(data.code == 0 && data.data.bindStatus==4){
            _this.$toast("受理失败，原因：" + data.data.failReason);
          }else {
            _this.$toast(data.msg);
          }
        });

    },
    detailClick(memberGuid){
      var _this = this;
      _this.$router.push({
        name:'whiteListDetail',
        params:{'memberGuid' : memberGuid}, 
      })
    }
  }
   
};
</script>
<style>
.whiteList .inp {
  width: 7.3rem;
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
/* .whiteList .van-checkbox__icon {
  width: 0.35rem;
  height: 0.35rem;
} */
/* .whiteList .van-icon-success {
  width: 0.3rem;
  height: 0.3rem;
  font-size: 0.3rem;
  line-height: 0.3rem;
} */
.whiteList .van-list__finished-text{
  padding-bottom: 0.8rem;
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
.botBtn{
  padding-top: 0.8rem;
  width: 7.5rem;
  height: 0.8rem;
  position: fixed;
  bottom: 0;
  left: 0;
}
.whiteList .choose {
  width: 7.5rem;
  height: 0.8rem;
  background: #ed2424;
  color: #fff;
  font-size: 0.3rem;
  text-align: center;
  line-height: 0.8rem;
 
}
.noData {
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
  padding-top: 0.8rem;
  box-sizing: border-box;
}
.item li {
  width: 100%;
  height: 0.8rem;
  border-bottom: 0.01rem solid #ccc;
}
.title {
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
.titleName {
  width: 1.7rem;
  text-align: center;
  font-size: 0.25rem;
}
.list span {
  width: 1.65rem;
  height: 0.8rem;
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
  width: 0.42rem;
  height: 0.7rem;
  /* margin-top: 0.2rem; */
}
</style>
