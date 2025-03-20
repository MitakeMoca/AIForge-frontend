<template>
	<div id="app">
		<RouterView />
	</div>
</template>

<script setup>
import { reactive, toRefs } from 'vue';
import { useRouter, RouterView } from 'vue-router';

const router = useRouter();
</script>

<style>
html,
body {
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
	overflow-x: hidden;
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
#app {
	display: flex; /*使用Flexbox布局*/
	height: 100%;
	width: 100%;
	padding: 0;
	margin: 0;
	justify-content: center; /* 水平居中 */
	min-height: 100vh; /* 至少为视口高度 */
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	text-align: center;
	color: #2c3e50;
}

.router-view {
	width: 100%;
	height: 100%;
	bottom: 0;
	margin: 0 auto;
}

.van-badge--fixed {
	z-index: 1000;
}
</style>
