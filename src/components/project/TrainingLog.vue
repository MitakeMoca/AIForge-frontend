<template>
	<div class="tab-content">
		<h2 class="log-title">训练日志</h2>
		<div
			class="log-entry"
			v-for="log in logs"
			:key="log.id"
			:class="['log-entry', log.entry]"
		>
			<span class="log-type">[{{ log.entry.toUpperCase() }}]</span>
			<span class="log-timestamp">{{ log.timestamp }}</span>
			<span class="log-message">{{ log.message }}</span>
		</div>
	</div>
</template>

<script setup>
defineProps({
	logs: {
		type: Array,
		required: true,
	},
});
</script>

<style scoped>
.tab-content {
	padding: 20px;
	background-color: #f9f9f9;
	border-radius: 5px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.log-title {
	font-size: 24px;
	font-weight: bold;
	margin-bottom: 15px;
}

.log-entry {
	padding: 10px;
	border-radius: 6px;
	margin-bottom: 10px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	display: flex;
	align-items: center;
	font-size: 18px;
	font-weight: bold;
}

.log-entry:hover {
	background-color: #f7f7f7;
}

.log-type {
	font-size: 18px;
	font-weight: bold;
	padding: 2px 8px;
	border-radius: 4px;
}

.log-timestamp {
	margin-right: 8px;
}

.log-message {
	font-size: 18px;
	line-height: 1.5;
}

.log-entry.system {
	color: #28a745; /* green */
}

.log-entry.info {
	color: #007bff; /* blue */
}

.log-entry.error {
	color: #dc3545; /* red */
}

.log-entry.warning {
	color: #fd7e14; /* orange */
}
</style>
