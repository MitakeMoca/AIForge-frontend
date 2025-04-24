<template>
	<aside class="sidebar">
		<div @click="toggleCollapse" style="padding: 8px 0; cursor: pointer">
			<el-icon :size="20">
				<component :is="isCollapse ? Expand : Fold" />
			</el-icon>
		</div>

		<el-menu
			:default-active="activeMenuIndex"
			class="el-menu-vertical-demo"
			:collapse="isCollapse"
			@select="handleSelect"
		>
			<el-menu-item index="/square">
				<el-icon :size="30"><Promotion /></el-icon>
				<template #title><span>探索</span></template>
			</el-menu-item>
			<el-menu-item index="/project">
				<el-icon :size="30"><Document /></el-icon>
				<template #title><span>项目</span></template>
			</el-menu-item>
			<el-menu-item index="/models">
				<el-icon :size="30"><DataLine /></el-icon>
				<template #title><span>模型</span></template>
			</el-menu-item>
			<el-menu-item index="/data">
				<el-icon :size="30"><Coin /></el-icon>
				<template #title><span>数据</span></template>
			</el-menu-item>
			<el-menu-item index="/ragnork">
				<el-icon :size="30"><Switch /></el-icon>
				<template #title
					><span style="margin-left: 20px">RAGnork</span></template
				>
			</el-menu-item>
		</el-menu>
	</aside>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import router from '@/router';
import {
	Promotion,
	Document,
	DataLine,
	Coin,
	Expand,
	Fold,
	Switch,
} from '@element-plus/icons-vue';

const isCollapse = ref(
	JSON.parse(sessionStorage.getItem('sidebarCollapse')) ?? true,
);

const toggleCollapse = () => {
	isCollapse.value = !isCollapse.value;
};

// 保证在路由切换时，sidebar 不会自动缩回去
watch(isCollapse, (newVal) => {
	sessionStorage.setItem('sidebarCollapse', JSON.stringify(newVal));
});

const activeMenuIndex = computed(() => {
	return router.currentRoute.value.path;
});

const handleSelect = (key) => {
	router.push({ path: key });
};
</script>

<style scoped>
.sidebar {
	position: relative;
	top: 0;
	left: 0;
	height: 100%;
	background: #ffffff;
	box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
	overflow-y: auto;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
	width: 150px;
}

.el-menu-item {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 20px;
	font-size: 16px;
	color: #666;
	position: relative;
}

.el-menu-item .el-icon {
	position: absolute;
	left: 20px;
}

.el-menu-item span {
	text-align: center;
}

.el-menu-item:hover,
.el-menu-item.is-active {
	color: #409eff;
	background: #f0f0f0;
}
</style>
