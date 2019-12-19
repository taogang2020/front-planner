/**
 * axios封装
 * 请求拦截，相应拦截，错误统一处理
 */
import axios from 'axios'

// 创建axios实例
var instance = axios.create({
    timeout: 1000 * 12
  })
instance.interceptors.request.use(
    config => {
      // 每次请求前判断vue中是否存在token
      // 如果存在，同意在http请求的header中加入token
      // 即使本地存在token,也有可能是过去的，所以在详情拦截器中队返回状态做出判断
      const token = sessionStorage.getItem("token")
      
      if (token) {
        config.headers.token = token
      }
      return config
    },
    error => {
      return Promise.error(error)
    }
  )
  instance.interceptors.response.use(response => {
    // 判断登录是否过期
    if (response.data.code === 10001) {
         清除token
      sessionStorage.removeItem("token")
      location.href = '/login';
      // 清除token
    }
    return response
  })
  export default instance