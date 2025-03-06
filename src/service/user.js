import axios from '../utils/axios'

// 返回所有的User列表
export function findAllUser() {
  return axios.post('/User/findAll',{})
}

//根据UserId删除对应user
export function deleteUser(params) {
  return axios.post('/User/del', params)
}

export function login(params) {
  return axios.post('/User/login', params)
}

export function logout() {
  return axios.post('/user/logout')
}

export function register(params) {
  return axios.post('/User/registerbyemail', params)
}

//输入UserId，返回包括imageUrl在内的所有user信息(不需要密码)
export function getUser(params) {
  return axios.post('/User/findbyuserid', params)
}

// 发送验证码
export function sendVerificationCode(params){
  return axios.post('/User/sendVerificationCode', params)
}

// 验证码登录
export function loginByVerificationCode(params) {
  return axios.post('/User/loginByVerificationCode', params)
}