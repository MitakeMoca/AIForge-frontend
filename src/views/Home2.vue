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
				<!--        <div class="nav-links">-->
				<!--          <a v-for="item in menuItems" :key="item" href="#" class="nav-link">{{ item }}</a>-->
				<!--        </div>-->
			</div>
			<div class="nav-right">
				<div class="search-box">
					<el-input
						v-model="searchQuery"
						placeholder="搜索..."
						style="max-width: 300px"
						@keyup.enter="goSearch"
					>
					</el-input>
					<el-button @click="goSearch" type="primary"
						>搜索
					</el-button>
				</div>
				<button v-if="isLogin()" class="login-btn" @click="start">
					登录
				</button>
				<button v-else class="login-btn" @click="goSquare">
					前往广场
				</button>
			</div>
		</nav>
		<!-- Hero Section -->
		<main class="hero-container">
			<div class="hero-content">
				<h1 class="hero-title">
					学大模型 , 用大模型
					<br />
					用
					<span class="aistart-wrapper">
						<span class="aistart-text">AIStart</span>
					</span>
				</h1>
				<p class="hero-subtitle">
					汇集优秀开发者的AI学习与实训社区
					<br />
					为您提供集环境、算力、内容和交流的全方位服务
					<br />
					马上加入社区，共同成长探索，创造AI的火花
				</p>
				<button v-if="isLogin()" class="join-btn" @click="start">
					马上加入
					<span class="btn-icon">&#8599;</span>
				</button>
			</div>
			<div class="hero-graphics">
				<!--        <div class="geometric-shapes"></div>-->
				<img
					src="../static/Home_GIF.gif"
					alt="GIF"
					class="geometric-shapes"
				/>
			</div>
		</main>
	</div>
</template>

<script setup>
import { onBeforeMount, onMounted, ref } from 'vue';
import Log from '@/components/Log.vue';
import { ElMessage } from 'element-plus';
import router from '@/router/index.js';
import { getLocal, setLocal } from '@/utils/local.js';
import { isEmptyValue } from '@/utils/utils.js';

const isStart = ref(false);

const searchQuery = ref('');

const login = () => {
	// 登录逻辑
	console.log('Login clicked');
};

const register = () => {
	// 注册逻辑
	console.log('Register clicked');
};

const start = () => {
	isStart.value = !isStart.value;
};

const goSquare = async () => {
	router
		.push({
			path: '/square',
		})
		.catch((err) => {
			console.log(err);
		});
};

/**
 * // 判断是否登录,已登录返回false，否则返回true
 * */
const isLogin = () => {
	return isEmptyValue(getLocal('userId'));
};
const goSearch = () => {
	if (isLogin()) {
		ElMessage.error('请您先进行登录');
	} else {
		if (searchQuery.value === '') {
			ElMessage.error('请输入搜索关键词');
		} else {
			router.push({
				path: '/search',
				query: { key: searchQuery.value },
				target: '_blank',
			});
		}
	}
};

// 使用onMounted钩子
onBeforeMount(() => {
	// console.log(getLocal('userId'))
	// setLocal('userId', '');
});
</script>

<style lang="scss" scoped>
@use '../assets/css/home.scss';
</style>
