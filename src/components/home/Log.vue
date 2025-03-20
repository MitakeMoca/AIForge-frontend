<template>
	<div class="auth-overlay" v-if="isShowAuth">
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
					<!-- Register Form -->
					<div v-if="activeTab === 'register'" class="form-group">
						<label for="name">用户名</label>
						<el-input
							id="name"
							v-model="username"
							type="text"
							placeholder="4~16位的英文字母与数字"
							required
						/>
					</div>

					<!-- Email Form -->
					<div
						v-if="activeTab === 'register' || useVerificationCode"
						class="form-group"
					>
						<label for="email">邮箱</label>
						<el-input
							id="email"
							v-model="email"
							type="email"
							placeholder="email@example.com"
							required
						/>
					</div>

					<!-- Login Form -->
					<div
						v-if="activeTab === 'login' && !useVerificationCode"
						class="form-group"
					>
						<label for="loginInfo">邮箱 / 用户名</label>
						<el-input
							id="loginInfo"
							v-model="loginInfo"
							type="text"
							placeholder="邮箱或用户名"
							required
						/>
					</div>

					<div
						v-if="activeTab === 'register' || !useVerificationCode"
						class="form-group"
					>
						<label for="password">密码</label>
						<div class="password-input">
							<el-input
								v-if="activeTab === 'register'"
								id="password"
								:type="showPassword ? 'text' : 'password'"
								v-model="password"
								placeholder="8~20位的英文字母与数字"
								required
							>
								<template #suffix>
									<el-icon
										:class="{ 'is-visible': showPassword }"
										@click="togglePasswordVisibility"
									>
										<component
											:is="showPassword ? Close : View"
										/>
									</el-icon>
								</template>
							</el-input>

							<el-input
								v-else
								id="password"
								:type="showPassword ? 'text' : 'password'"
								v-model="password"
								placeholder="密码"
								required
							>
								<template #suffix>
									<el-icon
										:class="{ 'is-visible': showPassword }"
										@click="togglePasswordVisibility"
									>
										<component
											:is="showPassword ? Close : View"
										/>
									</el-icon>
								</template>
							</el-input>
						</div>
					</div>

					<div v-if="activeTab === 'register'" class="form-group">
						<label for="confirmPassword">确认密码</label>
						<div class="password-input">
							<el-input
								id="confirmPassword"
								:type="
									showConfirmPassword ? 'text' : 'password'
								"
								v-model="confirmPassword"
								placeholder="8~20位的英文字母与数字"
								required
							>
								<template #suffix>
									<el-icon
										:class="{
											'is-visible': showConfirmPassword,
										}"
										@click="toggleConfirmPasswordVisibility"
									>
										<component
											:is="
												showConfirmPassword
													? Close
													: View
											"
										/>
									</el-icon>
								</template>
							</el-input>
						</div>
					</div>

					<!-- Verification Code Form -->
					<div
						v-if="activeTab === 'register' || useVerificationCode"
						class="form-group"
					>
						<label for="verificationCode">验证码</label>
						<div class="verification-code-container">
							<el-input
								id="verificationCode"
								v-model="verificationCode"
								type="text"
								placeholder="输入验证码"
								:required="
									activeTab === 'register' ||
									useVerificationCode
								"
							/>
							<el-button
								type="primary"
								:loading="isCodeSending"
								:disabled="isCodeSending || countdown > 0"
								@click="sendVC"
							>
								{{ buttonText }}
							</el-button>
						</div>
					</div>

					<div v-if="activeTab === 'login'" class="toggle-container">
						<p @click="changeLoginStyle">使用{{ loginStyle }}</p>
						<p @click="gotoRegister">还没有账号？前往注册</p>
					</div>

					<el-button
						class="submit-btn"
						type="primary"
						@click="submit"
						:loading="isLoading"
						:disabled="isLoading"
					>
						{{ submitButtonText }}
					</el-button>
				</form>

				<div class="auth-footer">
					<p>继续即表示您同意我们的服务条款和隐私政策</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ElMessage, ElInput, ElButton } from 'element-plus';
import {
	login,
	register,
	sendVerificationCode,
	loginByVerificationCode,
} from '@/service/user.js';
import { View, Close } from '@element-plus/icons-vue';
import { getLocal, setLocal } from '@/utils/local.js';
import router from '@/router/index.js';

const activeTab = ref('login');
const isLoading = ref(false);
const isCodeSending = ref(false);
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const loginInfo = ref('');
const verificationCode = ref('');
const useVerificationCode = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loginStyle = ref('验证码');
const countdown = ref(0);
const isShowAuth = ref(true); // Control visibility of the login/register overlay

const buttonText = computed(() => {
	if (isCodeSending.value) return '发送中...';
	if (countdown.value > 0) return `${countdown.value}s后重新发送`;
	return '发送验证码';
});

const submitButtonText = computed(() => {
	if (isLoading.value) {
		return activeTab.value === 'login' ? '登录中...' : '注册中...';
	}
	return activeTab.value === 'login' ? '登录' : '注册';
});

const sendVC = async () => {
	if (email.value.length === 0) {
		ElMessage.warning('请先输入邮箱！');
		return;
	}
	isCodeSending.value = true;
	const params = { email: email.value };
	print(params);
	await sendVerificationCode(params)
		.then((res) => {
			ElMessage.success(`验证码已经发送到 ${email.value} ，请注意查收`);
		})
		.catch((err) => {
			ElMessage.error('验证码发送失败，请稍后再试');
		});
	isCodeSending.value = false;
	countdown.value = 10;
	const timer = setInterval(() => {
		countdown.value--;
		if (countdown.value === 0) clearInterval(timer);
	}, 1000);
};

const togglePasswordVisibility = () => {
	console.log(`output->toggle`);
	showPassword.value = !showPassword.value;
};

const toggleConfirmPasswordVisibility = () => {
	showConfirmPassword.value = !showConfirmPassword.value;
};

const changeLoginStyle = () => {
	loginStyle.value = loginStyle.value === '验证码' ? '密码' : '验证码';
	useVerificationCode.value = !useVerificationCode.value;
};

const gotoRegister = () => {
	activeTab.value = 'register';
};

const submit = async () => {
	let params;
	if (activeTab.value === 'login') {
		if (useVerificationCode.value) {
			params = {
				Email: email.value,
				VerificationCode: verificationCode.value,
			};
			loginByVerificationCode(params)
				.then(async (res) => {
					if (res.resultCode === 200) {
						ElMessage.success('登录成功');
						await setLocal('userId', res.data.userId);
						router.push({ path: '/square' });
					} else {
						ElMessage.error('登录失败');
					}
				})
				.catch((err) => {
					ElMessage.error('登录失败');
				});
		} else {
			params = { UserId: loginInfo.value, Password: password.value };
			login(params)
				.then(async (res) => {
					if (res.resultCode === 200) {
						ElMessage.success('登录成功');
						await setLocal('userId', res.data.userId);
						router.push({ path: '/square' });
					} else {
						ElMessage.error('登录失败');
					}
				})
				.catch((err) => {
					ElMessage.error('登录失败');
				});
		}
	} else {
		if (password.value !== confirmPassword.value) {
			ElMessage.error('两次密码输入不一致');
			return;
		}
		params = {
			Email: email.value,
			VerificationCode: verificationCode.value,
			Password: password.value,
			UserId: username.value,
		};
		register(params)
			.then(async (res) => {
				if (res.resultCode === 200) {
					ElMessage.success('注册成功');
					router.push({ path: '/square' });
				} else {
					ElMessage.error('注册失败');
				}
			})
			.catch((err) => {
				ElMessage.error('注册失败');
			});
	}
};
</script>

<style lang="scss" scoped>
.auth-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
}

.auth-container {
	width: 40vw;
	background-color: #ffffff;
	border-radius: 8px;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	overflow: hidden;
}

.auth-header {
	padding: 24px;
	text-align: center;
}

.auth-header h2 {
	font-size: 24px;
	font-weight: bold;
	color: #374151;
	margin-bottom: 8px;
}

.auth-header p {
	color: #6b7280;
}

.auth-tabs {
	display: flex;
	border-bottom: 1px solid #e5e7eb;
}

.tab {
	flex: 1;
	padding: 12px;
	text-align: center;
	background: none;
	border: none;
	cursor: pointer;
	color: #6b7280;
	font-weight: 500;
	transition: all 0.3s;
}

.tab.active {
	color: #3b82f6;
	border-bottom: 2px solid #3b82f6;
}

form {
	padding: 24px;
}

.form-group {
	margin-bottom: 16px;
	display: flex;
	align-items: center;
}

.form-group label {
	flex: 0 0 100px;
	font-size: 14px;
	font-weight: 500;
	color: #374151;
}

.submit-btn {
	width: 100%;
	padding: 12px;
	background-color: #3b82f6;
	color: #ffffff;
	border: none;
	border-radius: 4px;
	font-size: 16px;
	font-weight: 500;
	cursor: pointer;
	transition: background-color 0.3s;
}

.submit-btn:hover {
	background-color: #2563eb;
}

.submit-btn:disabled {
	background-color: #9ca3af;
	cursor: not-allowed;
}

.auth-footer {
	padding: 16px 24px;
	background-color: #f9fafb;
	border-top: 1px solid #e5e7eb;
	letter-spacing: 0.5px;
}

.auth-footer p {
	font-size: 12px;
	color: #6b7280;
	text-align: center;
}

.verification-code-container {
	display: flex;
	gap: 8px;
}

input::placeholder {
	color: #ccc;
	font-size: 12px;
}

.password-input,
.verification-code-container {
	width: 100%;
}

:deep(.el-input__suffix) {
	pointer-events: auto;
	cursor: pointer;
}
</style>
