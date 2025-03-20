import axios from '../utils/axios'

// 返回所有的User列表
export function findAllUser() {
  return axios.get('/User')
}

//根据UserId删除对应user
export function deleteUser(params) {
  return axios.delete(`User/${params.UserId}`)
}

export function login(params) {
  return axios.get(`/User/${params.UserId}/${params.Password}`)
}

export function register(params) {
  return axios.put('/User', params)
}

//输入UserId，返回包括imageUrl在内的所有user信息(不需要密码)
export function getUser(params) {
  return axios.get(`/User/${UserId}`)
}

// 发送验证码
export function sendVerificationCode(params){
  print(params)
  return axios.post('/User/sendVerificationCode', params)
}

// 验证码登录
export function loginByVerificationCode(params) {
  return axios.post('/User/loginByVerificationCode', params)
}