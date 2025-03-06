<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h2>欢迎 ! ! !</h2>
        <p>登录或创建账号以继续</p>
      </div>

      <div class="auth-tabs">
        <button
            @click="activeTab = 'login'"
            :class="['tab', { active: activeTab === 'login' }]"
        >
          登录
        </button>
        <button
            @click="activeTab = 'register'"
            :class="['tab', { active: activeTab === 'register' }]"
        >
          注册
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div v-if="activeTab === 'register'" class="form-group">
          <label for="name">用户名</label>
          <input
              id="name"
              v-model="username"
              type="text"
              placeholder="4~16位的英文字母与数字"
              required
          >
        </div>

        <div v-if="activeTab === 'register' || useVerificationCode" class="form-group">
          <label for="email">邮箱</label>
          <input
              id="email"
              v-model="email"
              type="email"
              placeholder="email@example.com"
              required
          >
        </div>

        <div v-if="activeTab === 'login' && !useVerificationCode" class="form-group">
          <label for="loginInfo">邮箱 / 用户名</label>
          <input
              id="loginInfo"
              v-model="loginInfo"
              type="text"
              placeholder="邮箱或用户名"
              required
          >
        </div>

        <div v-if="activeTab === 'register' || !useVerificationCode" class="form-group">
          <label for="password">密码</label>
          <div class="password-input">
            <input v-if="activeTab === 'register'"
                id="password"
                :class="{ 'input-password': !showPassword }"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="8~20位的英文字母与数字"
                required
            >
            <input v-else
                   id="password"
                   :class="{ 'input-password': !showPassword }"
                   v-model="password"
                   :type="showPassword ? 'text' : 'password'"
                   placeholder="密码"
                   required
            >
            <button type="button" @click="togglePasswordVisibility" class="toggle-password">
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'register'" class="form-group">
          <label for="confirmPassword">确认密码</label>
          <div class="password-input">
            <input
                id="confirmPassword"
                :class="{ 'input-password': !showConfirmPassword }"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="8~20位的英文字母与数字"
                required
            >
            <button type="button" @click="toggleConfirmPasswordVisibility" class="toggle-password">
              {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'register' || useVerificationCode" class="form-group">
          <label for="verificationCode">验证码</label>
          <div class="verification-code-container">
            <input
                id="verificationCode"
                v-model="verificationCode"
                type="text"
                placeholder="输入验证码"
                :required="activeTab === 'register' || useVerificationCode"
            >
            <button
                type="button"
                @click="sendVC"
                :disabled="isCodeSending || countdown > 0"
                class="send-code-btn"
            >
              {{ buttonText }}
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'login'" class="toggle-container">
            <p @click="changeLoginStyle">使用{{ loginStyle }}</p>
            <p @click="gotoRegister">还没有账号？前往注册</p>
        </div>

        <button
            @click = "submit"
            type="submit"
            :disabled="isLoading"
            class="submit-btn"
        >
          {{ submitButtonText }}
        </button>
      </form>

      <div class="auth-footer">
        <p>
          继续即表示您同意我们的服务条款和隐私政策
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {login, loginByVerificationCode, register, sendVerificationCode} from "@/service/user.js";
import {ElMessage} from "element-plus";
import {getLocal, setLocal} from "@/utils/local.js";
import Home from "@/views/Home.vue";
import router from "@/router/index.js";

const activeTab = ref('login')
const isLoading = ref(false)
const isCodeSending = ref(false)
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loginStyle = ref('验证码')
const verificationCode = ref('')
const useVerificationCode = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loginInfo = ref('')
const countdown = ref(0)


const buttonText = computed(() => {
  if (isCodeSending.value) return '发送中...'
  if (countdown.value > 0) return `${countdown.value}s后重新发送`
  return '发送验证码'
})

const submitButtonText = computed(() => {
  if (isLoading.value) {
    return activeTab.value === 'login' ? '登录中...' : '注册中...'
  }
  return activeTab.value === 'login' ? '登录' : '注册'
})

const handleSubmit = async () => {
  isLoading.value = true
  isLoading.value = false
  // alert(`Form submitted! Action: ${activeTab.value}`)
  // Reset form
  loginInfo.value = ''
  username.value = ''
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
  verificationCode.value = ''
  // useVerificationCode.value = false
  // loginStyle.value = 'Verification Code'
}

// 前端的发送验证码方法
const sendVC = async () => {
  if (email.value.length === 0) {
    ElMessage.warning('请先输入邮箱！')
    return
  }
  isCodeSending.value = true
  const params = {
    Email: email.value
  }
  await sendVerificationCode(params).then(res => {
    ElMessage.success(`验证码已经发送到 ${email.value} ，请注意查收`)
  }).catch(err => {
    ElMessage.error('验证码发送失败，请稍后再试')
  })
  isCodeSending.value = false
  // Start the countdown
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value === 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 调整密码的可见性
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
  // console.log(showPassword.value)
}
// 调整确认密码的可见性
const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
  // console.log(showConfirmPassword.value)
}
// 检验合法性
const validateForm = (information, type) => {
  let isValid = true;
  if (type === 'email') {
    // 简单的邮箱校验规则：包含一个@符号，并且@不能是第一个或最后一个字符
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    isValid = emailRegex.test(information);
    if(!isValid){
      ElMessage.error('邮箱格式不正确， 请确认邮箱是否正确')
    }
  } else if (type === 'username') {
    // 用户名校验规则：只包含字母数字字符，长度在4到16之间
    const usernameRegex = /^[a-zA-Z0-9]{4,16}$/;
    isValid = usernameRegex.test(information);
    if(!isValid){
      ElMessage.error('用户名不符合平台要求， 请进行修改')
    }
  } else if (type === 'password') {
  // 密码校验规则：8~20位，包含英文字母和数字
    const passwordRegex = /^[a-zA-Z\d]{8,20}$/;
    isValid = passwordRegex.test(information);
    if(!isValid){
      ElMessage.error('密码格式不正确， 请检查密码是否符合要求')
    }
  }
  else if(type === 'VerificationCode'){
    // 验证码校验规则：6位数字
    const regex = /^\d{6}$/;
    isValid = regex.test(information);
    if(!isValid){
      ElMessage.error('验证码格式不正确， 请确认验证码是否正确')
    }
  }
  else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9]{4,16}$/;
    if(usernameRegex.test(information)){
      return 'username'
    }
    else if(emailRegex.test(information)){
      return 'email'
    }
    else{
      ElMessage.error('用户名或邮箱格式不正确， 请确认用户名或邮箱是否正确')
      return false
    }
  }
  return isValid;
};

const changeLoginStyle = () => {
  if(loginStyle.value === '验证码'){
    loginStyle.value = '密码'
  }
  else{
    loginStyle.value = '验证码'
  }
  useVerificationCode.value = !useVerificationCode.value
}
const gotoRegister = () => {
  activeTab.value = 'register'
}

const submit = () => {
  let params;
  if (activeTab.value === 'login') {
    // 使用邮箱-验证码登录
    if(useVerificationCode.value){
      // 检验邮箱是否合法
      if(!validateForm(email.value, 'email')) {
        return;
      }
      params = {
        Email: email.value,
        VerificationCode: verificationCode.value,
      }
      loginByVerificationCode(params).then( async res => {
        if (res.resultCode === 200) {
          ElMessage.success("登录成功，欢迎回来！！！");
          await userSetLocal(res)
          if(res.data.admin === 0){
            router.push({
              path: "/square",
            }).catch(err => {
              console.log(err)
            })
          }
          else{
            router.push({
              path: "/manage",
            }).catch(err => {
              console.log(err)
            })
          }
        } else {
          ElMessage.error('登录失败， 请确认验证码是否正确')
        }
      }).catch(err => {
        ElMessage.error('登录失败， 请确认验证码是否正确')
      })
    }
    else{
      if(loginInfo.value === '' || password.value === ''){
        return;
      }
      const loginType = validateForm(loginInfo.value, "loginType")
      if(loginType !== false){
        params = {
          UserId: loginInfo.value,
          Password: password.value,
        }
        login(params).then(async res => {
          console.log(res)
          if(res.resultCode === 200) {
            ElMessage.success("登录成功 ， 欢迎回来！！！");
          }
          else{
            ElMessage.error("登录失败， 请检查信息是否正确")
            return
          }
          await userSetLocal(res)
          if(res.data.admin === 0){
            // 加一些延时，防止页面无法跳转
            // await new Promise(resolve => setTimeout(resolve, 500))
            router.push({
              path: "/square",
            }).catch(err => {
              console.log(err)
            })
          }
          else{
            // 加一些延时，防止页面无法跳转
            // await new Promise(resolve => setTimeout(resolve, 500))
            router.push({
              path: "/manage",
            }).catch(err => {
              console.log(err)
            })
          }
        }).catch(err => {
          ElMessage.error("登录失败， 请检查信息是否正确")
        })
      }
    }
  } else {// 注册的方法
    if (validateForm(username.value, 'username')
        && validateForm(email.value, 'email')
        && validateForm(password.value, 'password')
        && validateForm(verificationCode.value, 'VerificationCode')){
      if (password.value !== confirmPassword.value) {
        ElMessage.error('两次输入的密码不一致， 请确认密码是否正确');
        return
      }
      params = {
        "Email": email.value,
        "VerificationCode":verificationCode.value,
        "Password":password.value,
        "UserId":username.value
      }
      register(params).then(async res => {
        if(res.resultCode === 200){
          await setLocal(res)
          // 加一些延时，防止页面无法跳转
          // await new Promise(resolve => setTimeout(resolve, 500))
          ElMessage.success("注册成功 ， 欢迎加入！！！")
          router.push({
            path: "/square",
          }).catch(err => {
            console.log(err)
          })
        }
        else{
          ElMessage.error("注册失败， 请检查信息是否正确或是否已有账号")
        }
      }).catch(err => {
        ElMessage.error("注册失败， 请检查信息是否正确或是否已有账号")
      })
    }
  }
}

const userSetLocal = async (res) => {
  await setLocal("userId", res.data.userId)
  await setLocal("username", res.data.username)
}
</script>

<style lang="scss" scoped>
@use "../assets/css/Log.scss";
</style>