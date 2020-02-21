import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import BindWhiteList from '@/components/trade/BindWhiteList'
import CapitalAccount from '@/components/trade/CapitalAccount'
import AccountDetail from '@/components/trade/AccountDetail'
import CapitalDetail from '@/components/trade/CapitalDetail'
import TradeList from '@/components/trade/TradeList'
import WhiteListDetail from '@/components/trade/WhiteListDetail'
import Mine from '@/components/account/Mine'
import User from '@/components/account/User'
import OpenAccountPersonal from '@/components/account/OpenAccountPersonal'
import OpenAccountOrgan from '@/components/account/OpenAccountOrgan'
import OrganRegister from '@/components/customer/OrganRegister'
import PersonalRegister from '@/components/customer/PersonalRegister'
import CustomerList from '@/components/customer/CustomerList'
import PersonalDetail from '@/components/customer/PersonalDetail'
import OrganDetail from '@/components/customer/OrganDetail'
import Login from '@/components/account/Login'
import Register from '@/components/account/Register'
import OrganCheckBack from '@/components/account/OrganCheckBack'
import OrganCheckWait from '@/components/account/OrganCheckWait'
import WhiteManage from '@/components/account/WhiteManage'
import MyAccount from '@/components/account/MyAccount'
import EditPassword from '@/components/account/EditPassword'
import OpenAccountList from '@/components/account/OpenAccountList'
import AccountDetailPersonal from '@/components/account/AccountDetailPersonal'
import AccountDetailOrgan from '@/components/account/AccountDetailOrgan'


Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      meta: {
        title: '绑定银行卡'
      },
      path: '/openAccountPersonal',
      name: 'openAccountPersonal',
      component: OpenAccountPersonal
    },
    {
      meta: {
        title: '绑定银行卡'
      },
      path: '/openAccountOrgan',
      name: 'openAccountOrgan',
      component: OpenAccountOrgan
    },
    {
      meta: {
        title: '绑定银行卡'
      },
      path: '/openAccountList',
      name: 'openAccountList',
      component: OpenAccountList
    },
    {
      meta: {
        title: '银行卡管理'
      },
      path: '/accountDetailPersonal',
      name: 'accountDetailPersonal',
      component: AccountDetailPersonal
    },
    {
      meta: {
        title: '银行卡管理'
      },
      path: '/accountDetailOrgan',
      name: 'accountDetailOrgan',
      component: AccountDetailOrgan
    },
    {
      meta: {
        title: '绑定白名单'
      },
      path: '/bindWhiteList/:issueGuid',
      name: 'bindWhiteList',
      component: BindWhiteList
    },
    {
      meta: {
        title: '资金到账明细'
      },
      path: '/accountDetail',
      name: 'accountDetail',
      component: AccountDetail
    },
    {
      meta: {
        title: '资金到账明细',
      },
      path: '/capitalAccount/:issueGuid',
      name: 'capitalAccount',
      component: CapitalAccount
    },
    {
      meta: {
        title: '资金到账明细',
      },
      path: '/capitalDetail',
      name: 'capitalDetail',
      component: CapitalDetail
    },
    {
      meta: {
        title: '白名单'
      },
      path: '/whiteManage',
      name: 'whiteManage',
      component: WhiteManage
    },
    {
      meta: {
        title: '客户代注册'
      },
      path: '/personalRegister',
      name: 'personalRegister',
      component: PersonalRegister
    },
    {
      meta: {
        title: '客户代注册'
      },
      path: '/organRegister',
      name: 'organRegister',
      component: OrganRegister
    },
    {
      meta: {
        title: '我的账户',
      },
      path: '/mine',
      name: 'mine',
      component: Mine
    },
    {
      meta: {
        title: '审核退回'
      },
      path: '/organCheckBack',
      name: 'organCheckBack',
      component: OrganCheckBack
    },
    {
      meta: {
        title: '待审核'
      },
      path: '/organCheckWait',
      name: 'organCheckWait',
      component: OrganCheckWait
    },
    {
      meta: {
        title: '客户详情'
      },
      path: '/organDetail/:memberGuid',
      name: 'organDetail',
      component: OrganDetail
    },
    {
      meta: {
        title: '客户详情'
      },
      path: '/personalDetail/:memberGuid',
      name: 'personalDetail',
      component: PersonalDetail
    },
    {
      meta: {
        title: '详情'
      },
      path: '/whiteListDetail/:memberGuid',
      name: 'whiteListDetail',
      component: WhiteListDetail
    },
    {
      meta: {
        title: '管理人注册',
      },
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      meta: {
        title: '登录',
      },
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      meta: {
        title: '我的账户',
      },
      path: '/myAccount',
      name: 'myAccount',
      component: MyAccount
    },
    {
      meta: {
        title: '密码修改',
      },
      path: '/editPassword',
      name: 'editPassword',
      component: EditPassword
    },
    {
      meta: {
        title: '客户管理'
      },
      path: '/customerList',
      name: 'customerList',
      component: CustomerList
    },
    {
      meta: {
        title: '交易市场'
      },
      path: '/tradeList',
      name: 'tradeList',
      component: TradeList
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      redirect: '/tradeList',
      children: [
      
      {
        meta: {
          title: '我的账户',
        },
        path: '/user',
        name: 'user',
        component: User
      }]
    }
    
  ]
})
//路由守卫，做登录拦截
router.beforeEach((to, from, next) => {
  // window.document.title = to.meta.title;
  
  if (to.meta.title) {
    document.title = to.meta.title
  }

  next()
  const type = to.meta.type
  // 判断该路由是否需要登录权限
  if (type === 'login') {
    if (window.localStorage.getItem('login')) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()  // 确保一定要有next()被调用
  }

})
export default router