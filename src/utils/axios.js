import axios from 'axios'
// import { setLocal } from '@/common/js/utils'
// import router from '../router'

export const baseURL = 'http://localhost:8084' //后端的URL
console.log('import.meta.env', import.meta.env)

axios.defaults.baseURL = 'http://localhost:8084' //后端的URL
axios.defaults.withCredentials = false //携带跨域凭证，在注册域名之后才有用
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest' //设置axios的默认请求头中的X-Requested-With字段为XMLHttpRequest
axios.defaults.headers['Access-Control-Allow-Origin'] = 'http://localhost:5050'
axios.defaults.headers['token'] = localStorage.getItem('token') || '' //localStorage即使网页关闭也会报错，不同域名的网页不能访问同一个LocalStorage数据
// axios.defaults.headers.post['Content-Type'] = 'application/json' //设置请求头的content-type为'application/json'

axios.interceptors.response.use((res) => {
  // //添加一个响应拦截器，进行下面的处理
  // if (typeof res.data !== 'object') {
  //   //showFailToast('服务端异常！')
  //   return Promise.reject(res)
  // }
  // if (res.data.resultCode != 200) {
  //   //异常返回检查，正常运行时为200，可以替换成res.status!=200
  //   //if (res.data.message) showFailToast(res.data.message)
  //   // if (res.data.resultCode == 416) {
  //   //   router.push({ path: '/login' })
  //   // }检查登录状态
  //   if (res.data.data && window.location.hash == '#/login') {
  //     setLocal('token', res.data.data)
  //     axios.defaults.headers['token'] = res.data.data //将token默认值设置为用户的token
  //   }
  //   return Promise.reject(res.data) //promise用于处理异步操作，等待后端的返回
  // }

  return res.data
}) //axios拦截器来对HTTP响应处理
// res是一个包含以下属性的对象：
// data: 服务器返回的数据，通常是一个JSON对象或者其他数据类型。
// status: 响应的HTTP状态码，例如200表示成功，404表示资源未找到等。
// statusText: HTTP状态码对应的文本描述，例如200对应"OK"。
// headers: 响应头信息，包含了服务器返回的头部信息。
// config: 发送请求时的配置信息，例如请求的URL、请求方法等。





export default axios;