<template>
	<aside class="sidebar" width="auto">
		<div v-if="isCollapse" @click="toggleCollapse" style="padding: 8px 0">
			<el-icon :size="20"><Expand /></el-icon>
		</div>
		<div v-else @click="toggleCollapse" style="padding: 8px 0">
			<el-icon :size="20"><Fold /></el-icon>
		</div>
		<el-menu
			:default-active="activeMenuIndex"
			class="el-menu-vertical-demo"
			:collapse="isCollapse"
			@select="handleSelect"
		>
			<el-menu-item index="/square">
				<el-icon :size="30"><Promotion /></el-icon>
				<template #title>探索</template>
			</el-menu-item>
			<el-menu-item index="/project">
				<el-icon :size="30"><Document /></el-icon>
				<template #title>项目</template>
			</el-menu-item>
			<el-menu-item index="/models">
				<el-icon :size="30"><DataLine /></el-icon>
				<template #title>模型</template>
			</el-menu-item>
			<el-menu-item index="/data">
				<el-icon :size="30"><Coin /></el-icon>
				<template #title>数据</template>
			</el-menu-item>
		</el-menu>
	</aside>
</template>

<script setup>
import { ref, computed } from 'vue';
import router from '@/router';
import {
	House,
	Promotion,
	Document,
	DataLine,
	Coin,
	Expand,
	Fold,
} from '@element-plus/icons-vue';

const isCollapse = ref(true);

const toggleCollapse = () => {
	isCollapse.value = !isCollapse.value;
};
// 计算属性，根据当前路由路径来确定default-active的值
const activeMenuIndex = computed(() => {
	console.log(router.currentRoute.value.path);
	return router.currentRoute.value.path;
});
const handleSelect = (key) => {
	router.push({
		path: key,
	});
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
	font-size: 16px;
	color: #666;
}

.el-menu-item:hover,
.el-menu-item.is-active {
	color: #409eff; /* Vue默认的主题色 */
	background: #f0f0f0;
}
</style>
