<template>
  <div class="register">
    <van-nav-bar
        title="客户代注册"
      />
    <div>
      <van-cell-group v-show="active">
        <van-field v-model="form.memberFullName" label="姓名:" required placeholder="请输入用户名" />
        <van-field v-model="form.memberPhone" label="手机号:" placeholder="请输入手机号" />
        <van-field v-model="form.operatorLoginName" required label="登陆名:" placeholder="请输入登陆名" />
        <van-field
          v-model="form.secrectCode"
          required
          type="password"
          label="登录密码:"
          placeholder="请输入登录密码"
        />
        <van-field
          :value="form.idType"
          required
          @click="showCardType = true"
          label="证件类型:"
          readonly
          clickable
          placeholder="请选择"
        />
        <van-field v-model="form.idCard" required label="证件号:" placeholder="请输入证件号" />
        <van-field
          :value="form.address"
          label="地址:"
          @click="showPopup"
          readonly
          placeholder="请选择地址"
        />
        <div class="firstBtn">
          <van-button type="danger" class="next" @click="next">下一步</van-button>
        </div>
      </van-cell-group>
      <div class="second" v-show="!active">
        <p class="title">请上传相关证件</p>
        <div class="ImgBox clear">
          <div class="file idCardPositive fl">
            <van-uploader :after-read="afterRead" />
            <p>身份证正面</p>
          </div>
          <div class="file idCardReverse fr">
            <van-uploader :after-read="afterRead" />
            <p>身份证反面</p>
          </div>
        </div>
        <div class="secondBtn">
          <van-button type="danger" class="pre" @click="pre">上一步</van-button>
          <van-button type="danger" class="pre" @click="pre">提交审核</van-button>
        </div>
      </div>
    </div>
    <!-- 证件类型选择器 -->
    <van-popup v-model="showCardType" position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        value-key="name"
        @cancel="showCardType = false"
        @confirm="onConfirm"
      />
    </van-popup>
    <!-- 地址选择器 -->
    <van-popup v-model="AddrPopup" position="bottom" :style="{ height: '40%' }">
      <van-picker ref="area" show-toolbar :columns="cityList" @cancel="AddrPopup = false" @confirm="sureAddress" @change="onChange" />
    </van-popup>
    
  </div>
</template>

<script>
const citys = [
  {
    value: 1,
    label: "浙江",
    children: [
      {
        value: 2,
        label: "杭州",
        children: [
          {
            value: 7,
            label: "临安区"
          },
          {
            value: 8,
            label: "下城区"
          },
          {
            value: 9,
            label: "上城区"
          }
        ]
      },
      {
        value: 3,
        label: "宁波",
        children: [
          {
            value: 10,
            label: "海曙区"
          },
          {
            value: 11,
            label: "江东区"
          },
          {
            value: 12,
            label: "江北区"
          }
        ]
      }
    ]
  },
  {
    value: 4,
    label: "福建",
    children: [
      {
        value: 5,
        label: "福州",
        children: [
          {
            value: 13,
            label: "鼓楼区"
          },
          {
            value: 14,
            label: "台江区"
          },
          {
            value: 15,
            label: "仓山区"
          }
        ]
      },
      {
        value: 6,
        label: "厦门",
        children: [
          {
            value: 16,
            label: "思明区"
          },
          {
            value: 17,
            label: "海沧区"
          },
          {
            value: 18,
            label: "湖里区"
          }
        ]
      }
    ]
  }
];
function getChildArray(citys){
  let parentList = [];
  citys.forEach((itme, index)=>{
    parentList.push(itme.label);
  })
  return parentList
}
function getChlidList(name, citys){
  let list = [];
  citys.forEach(itme=>{
    if(itme.label == name){
      list = itme.children;
    }
  })
  return getChildArray(list);
}

export default {
  name: "PersonalRegister",
  data() {
    return {
      cityList: [
        {
          values: getChildArray(citys),
          className: "column1"
        },
        {
          values: getChlidList("浙江", citys),
          className: "column2",
          defaultIndex: 0
        },
        {
          values: getChlidList("杭州", citys[0]["children"]),
          className: "column3",
          defaultIndex: 0
        }
      ],
      provinceInfo: citys[0],
      cityInfo: citys[0]['children'][0],
      areaInfo: citys[0]['children'][0]['children'][0],
      defaultIndex: [0, 0, 0],

      columns: [
        { name: "浙江", id: 1 },
        { name: "宁波", id: 2 },
        { name: "上海", id: 3 },
        { name: "北京", id: 4 },
        { name: "杭州", id: 5 }
      ],
      form: {
        memberFullName: "",
        memberPhone: "",
        operatorLoginName: "",
        secrectCode: "",
        idType: "",
        idCard: "",
        address: "",
      },
      active: true,
      AddrPopup: false,
      showCardType: false,
      showAddress: false,
     
    };
  },
  created() {
    var _this = this;
  },
  methods: {
    diffIndex(indexs) {
      var _this = this;
      let editIndexFlag;
      indexs.forEach((item, index) => {
        if (item != this.defaultIndex[index]) {
          editIndexFlag = index;
          _this.defaultIndex[index] = item;
          return false;
        }
      });
      let length = this.defaultIndex.length;
      for (var i = editIndexFlag + 1; i < length; i++) {
        _this.defaultIndex[i] = 0;
      }
      return _this.defaultIndex;
    },

    updIds() {
      var _this = this;
      _this.provinceInfo = citys[_this.defaultIndex[0]];
      _this.cityInfo = citys[_this.defaultIndex[0]]['children'][_this.defaultIndex[1]];
      _this.areaInfo = citys[_this.defaultIndex[0]]['children'][_this.defaultIndex[1]]['children'][_this.defaultIndex[2]];
      console.log("id"+_this.provinceInfo.value+"name"+_this.provinceInfo.label)
      console.log("id"+_this.cityInfo.value+"name"+_this.cityInfo.label)
      console.log("id"+_this.areaInfo.value+"name"+_this.areaInfo.label)

    },
    onChange(picker, values) {
      var _this = this;
      let indexs = _this.diffIndex(picker.getIndexes());
      //设置城市
      let cityList = getChlidList(values[0], citys);
      picker.setColumnValues(1, cityList);
      let areaList = getChlidList(cityList[indexs[1]],citys[indexs[0]]["children"]);
      picker.setColumnValues(2, areaList);
      _this.updIds();
    },

    // 点击地址
    showPopup() {
      var _this = this;
      _this.AddrPopup = true;
     
    },
    // 点击确认地址
    sureAddress(value) {
      console.log(value);
      var _this = this;
      _this.AddrPopup = false;
    },
    // 点击确认身份证类型
    onConfirm(value) {
      var _this = this;
      var keyId = value.id;
      var text = value.name;
      _this.form.value = text;
      console.log("当前值" + keyId + "当前索引" + text);
      _this.showCardType = false;
    },
    // 上传图片
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      console.log(file);
    },

    next() {
      var _this = this;
      var reg = /^(13|14|15|16|17|18|19)[0-9]{9}$/;
      if (_this.form.memberFullName == "") {
        _this.$toast("请填写用户名");
        return;
      }
      if (_this.form.operatorLoginNam == "") {
        _this.$toast("请填写登录名");
        return;
      }
      if (_this.form.secrectCode == "") {
        _this.$toast("请填写登录密码");
        return;
      }
      if (_this.form.idType == "") {
        _this.$toast("请选择身份证类型");
        return;
      }
      if (_this.form.idCard == "") {
        _this.$toast("请填写身份证号");
        return;
      }
      if (_this.form.memberPhone != reg) {
        _this.$toast("请填写正确的手机号");
        return;
      }
      _this.active = false;
    },

    pre() {
      var _this = this;
      _this.active = true;
    }
  }
};
</script>
<style>
.register .van-button {
  height: 0.7rem;
  line-height: 0.7rem;
  cursor: pointer;
}
.register .van-nav-bar__text{
  color: #333;
}
.register .van-cell {
  width: 7.5rem;
  height: 1rem;
  line-height: 0.6rem;
  font-size: 0.3rem;
  margin-bottom: 0.1rem;
}
.register .van-cell-group {
  background: transparent;
}
.register .van-button--danger {
  color: #fff;
  background-color: #ed2424;
  border: 1px solid #ed2424;
}
.register .van-action-sheet {
  max-height: 40%;
}
.register .van-picker__confirm {
  color: #ed2424;
}
.register .van-picker__cancel {
  color: #666;
}
.register .van-uploader__upload {
  width: 2rem;
  height: 2rem;
  /* opacity: 0;
  z-index: 999; */
}
/* .register .van-uploader__upload-icon{
  opacity: 0;
} */
.register .van-field__control {
  text-align: right;
}
.register .van-uploader {
  margin-left: 0.5rem;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.register {
  width: 7.5rem;
}
.register p {
  color: #333;
  font-size: 0.3rem;
  line-height: 0.6rem;
  margin-bottom: 0.2rem;
  text-align: center;
}
.register .firstBtn {
  width: 1.5rem;
  margin: 0 auto;
}
.register .secondBtn {
  width: 3.6rem;
  margin: 0 auto;
}
.register .title {
  font-size: 0.4rem;
  text-align: center;
  color: #ed2424;
  margin-bottom: 0.4rem;
}
.second {
  padding: 0.4rem;
  box-sizing: border-box;
}
.file {
  width: 3rem;
  position: relative;
}
.head-img {
  width: 3rem;
  height: 2rem;
}
.PositiveImg {
  position: absolute;
  left: 0rem;
  top: 0;
}
.ReverseImg {
  position: absolute;
  left: 0rem;
  top: 0;
}
</style>
