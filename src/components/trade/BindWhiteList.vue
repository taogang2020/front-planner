<template>
  <div class="whiteList">
    <van-nav-bar v-show="is_weixin" title="绑定白名单" />
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
        <p class="fl titleName">客户名称</p>
        <p class="fl titleName">身份证号</p>
        <p class="fl titleName">是否已绑白名单</p>
      </div>
      <van-checkbox-group v-model="selectedData" ref="checkboxGroup" >
        <li class="list" v-for="item in list" :key="item.id">
          <div class="checkbox fl">
            <van-checkbox
              v-show="item.is_check==1"
              shape="square"
              :name="item.id"
              :value="item.id"
              checked-color="#ed2424"
              ref="checkboxes"
              slot="right-icon"
              @click="changes"
            />
          </div>
          <span class="fl">{{item.name}}</span>
          <span class="fl">{{item.idcard}}</span>
          <span class="fl">{{item.name}}</span>
        </li>
      </van-checkbox-group>
    </div>
  </div>
</template>

<script>
export default {
  name: "BindWhiteList",
  data() {
    return {
      value: "",
      result: [],
      checked: false,
      list: [
        { name: "子文涵", id: 4, is_check: 1, idcard: "330000198607182967" },
        { name: "桓何不", id: 5, is_check: 0, idcard: "330000198607182967" },
        { name: "谷紫怡", id: 6, is_check: 1, idcard: "330000198607182967" },
        { name: "谷紫二", id: 7, is_check: 1, idcard: "330000198607182967" }
      ],
      selectedData: [],
      is_weixin: false
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
      var listArr = _this.list;
      let ids = [];
      // 选中
      if (Number(key) == 1) {
        listArr.forEach(function(value) {
          if(value.is_check==1){
            ids.push(value.id);
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
.top {
  padding: 0.1rem;
  background: #fff;
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
}
.checkbox {
  width: 0.3rem;
  height: 0.3rem;
}
</style>
