<template>
	<div class="app-container">
		<div v-if="isStart" class="log-overlay" @mousedown="start">
			<div @mousedown.stop>
				<Log @close="start" />
			</div>
		</div>

		<!-- Navigation Bar -->
		<nav class="nav-container">
			<div class="nav-left">
				<img src="../static/logo1.png" alt="Logo" class="logo" />
			</div>
			<div class="nav-right">
				<!-- Only show search box if not logged in -->
				<div v-if="!isLogin()" class="search-box">
					<el-input
						v-model="searchQuery"
						placeholder="搜索..."
						style="max-width: 300px"
						@keyup.enter="goSearch"
					></el-input>
					<el-button @click="goSearch" type="primary">搜索</el-button>
				</div>
				<button v-if="isLogin()" class="login-btn" @click="start">
					登录
				</button>
				<button v-else class="login-btn" @click="goSquare">
					前往广场
				</button>
			</div>
		</nav>

		<!-- Separator Line -->
		<div class="separator"></div>

		<!-- Hero Section -->
		<main class="hero-container">
			<div class="hero-content">
				<h1 class="hero-title">
					学 AI，用 AI，就来
					<span class="brand-highlight">AIForge</span>
				</h1>
				<p class="hero-subtitle">
					专注 AI 学习与实训，汇聚优秀开发者社区。<br />
					提供一站式环境、算力、教程与交流平台，<br />
					让每个人都能轻松开启 AI 之旅。
				</p>
				<div class="hero-buttons">
					<button class="register-btn" @click="goRegister">
						注册
					</button>
					<button class="login-btn" @click="start">登录</button>
				</div>
			</div>
		</main>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import Log from '@/components/home/Log.vue';
import { ElMessage } from 'element-plus';
import router from '@/router/index.js';
import { getLocal, isEmptyValue } from '@/utils/utils.js';

const isStart = ref(false);
const searchQuery = ref('');

const start = () => {
	isStart.value = !isStart.value;
};

const goRegister = () => {
	router.push({ path: '/register' }).catch((err) => console.log(err));
};

const goSquare = () => {
	router.push({ path: '/square' }).catch((err) => console.log(err));
};

const isLogin = () => {
	return isEmptyValue(getLocal('userId'));
};

const goSearch = () => {
	if (isLogin()) {
		ElMessage.error('请您先进行登录');
	} else if (!searchQuery.value) {
		ElMessage.error('请输入搜索关键词');
	} else {
		router.push({ path: '/search', query: { key: searchQuery.value } });
	}
};
</script>

<style lang="scss" scoped>
.app-container {
	position: relative;
	height: 100vh;
	width: 100vw;
	background: url('../static/heroes.png') no-repeat center center;
	background-size: cover;
	font-family: Arial, sans-serif;
	overflow: hidden;
	user-select: none;
}

.log-overlay :deep(.log-component) {
	background-color: white;
	border-radius: 8px;
	padding: 20px;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	max-width: 40vw;
	width: 90%;
}

.nav-container {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem 2rem;
	position: sticky;
	top: 0;
	z-index: 10;
	background: transparent;
	backdrop-filter: blur(4px);
}

.nav-left {
	display: flex;
	align-items: center;
	gap: 2rem;
}

.logo {
	height: 40px;
	width: auto;
}

.nav-right {
	display: flex;
	align-items: center;
	gap: 1.5rem;
}

.search-box {
	display: flex;
	position: relative;
	width: 360px;
}

.search-box input {
	padding: 0.5rem 2rem 0.5rem 1rem;
	border: 1px solid #e0e0e0;
	border-radius: 20px;
	font-size: 0.9rem;
	outline: none;
	transition: border-color 0.2s;
}

.search-box input:focus {
	border-color: #4318ff;
}

.search-btn {
	padding: 0.75rem 2rem;
	border-radius: 30px;
	font-size: 1rem;
	border: none;
	cursor: pointer;
	background-color: #1ea9ff;
	color: white;
}

.nav-text {
	color: #666;
	text-decoration: none;
	font-size: 0.9rem;
}

.separator {
	height: 1px;
	background-color: white;
	width: 100%;
}

.hero-container {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	padding: 4rem 2rem;
	min-height: calc(100vh - 80px);
	text-align: center;
	position: relative;
}

.hero-content {
	position: relative;
	bottom: 100px;
	z-index: 2;
	max-width: 800px;
}

.hero-title {
	font-size: 3rem;
	color: #fff;
	margin-bottom: 1.5rem;
	line-height: 1.3;
}

.brand-highlight {
	background: linear-gradient(45deg, #1ea9ff, #ffffff);
	-webkit-background-clip: text;
	color: transparent;
	font-weight: bold;
}

.hero-subtitle {
	color: #ddd;
	font-size: 1.25rem;
	margin-bottom: 2rem;
	line-height: 1.8;
}

.hero-buttons {
	display: flex;
	justify-content: center;
	gap: 1.5rem;
}

.register-btn,
.login-btn {
	padding: 0.75rem 2rem;
	border-radius: 30px;
	font-size: 1rem;
	border: 2px solid #1ea9ff;
	color: #1ea9ff;
	background: transparent;
	cursor: pointer;
	transition: all 0.3s ease;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
}

.login-btn:hover {
	background: #1ea9ff;
	color: white;
	border-color: #0d7fd3;
	box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15); /* Darker shadow on hover */
}

.login-btn:active {
	transform: scale(0.98); /* Slightly shrink the button when clicked */
}

.register-btn {
	background: #1ea9ff;
	color: white;
}

.register-btn:hover {
	background: #0d7fd3;
}

.login-btn {
	background: transparent;
	border: 2px solid #fff;
	color: #fff;
}

.login-btn:hover {
	background: rgba(255, 255, 255, 0.1);
}
</style>
