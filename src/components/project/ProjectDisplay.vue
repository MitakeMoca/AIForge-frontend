<template>
	<div class="body">
		<el-scrollbar>
			<div class="project-list">
				<div
					class="project-item"
					v-for="(item, index) in projectList"
					:key="index"
					@click="showConfig(item['project_id'])"
				>
					<!-- 顶部标题栏 -->
					<div class="header">
						<span class="name">
							{{ item['project_name'] }}
						</span>
						<span class="id"
							>project-id: {{ item['project_id'] }}</span
						>
					</div>

					<!-- 项目图片 -->
					<div class="image-container">
						<img
							:src="projectImg"
							alt="项目图片"
							class="project-image"
						/>
						<!-- 黑色半透明状态条 -->
						<div class="status-bar">
							<span
								class="status"
								:class="getStatusClass(item.status)"
							>
								状态: {{ item.status }}
							</span>
						</div>
					</div>

					<!-- 操作按钮 -->
					<div class="actions">
						<run-icon
							class="run-icon"
							@click.stop="runProject(item)"
						></run-icon>
						<big-delete-icon
							class="delete-icon"
							@click.stop="openDeleteDialog(item)"
						></big-delete-icon>
					</div>
				</div>
			</div>
		</el-scrollbar>

		<!-- 删除项目确认弹窗 -->
		<el-dialog
			title="删除项目"
			width="20%"
			style="text-align: center; top: 10%"
			v-model="deleteDialog"
		>
			<p style="margin: 60px 0; font-size: 20px">确定删除项目吗？</p>
			<span slot="footer">
				<el-button @click="deleteDialog = false">取消</el-button>
				<el-button type="primary" @click="confirmDelete()"
					>确认</el-button
				>
			</span>
		</el-dialog>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElNotification } from 'element-plus';
import RunIcon from '@/assets/icon/RunIcon.vue';
import BigDeleteIcon from '@/assets/icon/BigDeleteIcon.vue';
import { deleteProject } from '@/service/project.js';
import projectImg from '@/assets/img/project.jpg';

// 获取 Vue Router 实例
const router = useRouter();

// 接收父组件传递的 `projectList` 数据
defineProps({
	projectList: Array,
});

// 响应式变量
const deleteDialog = ref(false);
const seleteProject = ref(null);

// 获取状态对应的 class
const getStatusClass = (status) => ({
	waiting: status === 'wait',
	finished: status === 'finished',
	init: status === 'init',
	stopped: status === 'stopped',
});

// 打开删除确认对话框
const openDeleteDialog = (item) => {
	seleteProject.value = item;
	deleteDialog.value = true;
};

// 确认删除
const confirmDelete = () => {
	if (seleteProject.value) {
		deleteProject({ ProjectId: seleteProject.value.projectId });
		seleteProject.value = null;
		deleteDialog.value = false;
		location.reload();
	}
};

// 进入项目配置页面
const showConfig = (id) => {
	console.log(`output->id`, id);
	router.push(`/project/projectConfig/${id}`);
};

// 运行项目
const runProject = (item) => {
	ElNotification.success({
		message: '正在启动, 请稍等',
	});
	setTimeout(() => {
		router.push(`/runProject/${item.project_id}`);
	}, 1000);
};
</script>

<style scoped>
.body {
	margin: 20px;
	height: 100%;
	overflow-y: auto;
}

.project-list {
	display: flex;
	gap: 50px;
	flex-wrap: wrap;
	justify-content: flex-start;
}

.project-item {
	width: calc(23% - 20px);
	display: flex;
	flex-direction: column;
	background: #ffffff;
	border-radius: 12px;
	border: 2px solid #ccc; /* 增加了显眼的边框 */
	box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
	overflow: hidden;
	transition: transform 0.3s ease, box-shadow 0.3s ease;
	cursor: pointer;
}

.project-item:hover {
	transform: translateY(-5px);
	box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.header {
	padding: 15px;
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	border-bottom: 1px solid #eee;
}

.name {
	font-size: 18px;
	font-weight: bold;
	color: #333;
	cursor: pointer;
}

.name:hover {
	color: #2563eb;
}

.id {
	font-size: 12px;
	color: #888;
	margin-left: 10px;
}

.image-container {
	width: 100%;
	height: 250px;
	position: relative;
	overflow: hidden;
}

.project-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.status-bar {
	position: absolute;
	bottom: 0;
	width: 100%;
	background-color: rgba(0, 0, 0, 0.7);
	padding: 8px;
}

.status {
	font-size: 16px;
	color: white;
	font-weight: bold;
}

.waiting {
	color: #f39c12;
}
.finished {
	color: #2ecc71;
}
.init {
	color: #9b59b6;
}
.stopped {
	color: #e74c3c;
}

.actions {
	display: flex;
	justify-content: space-between;
	padding: 5px;
	align-items: center;
}

.run-icon,
.delete-icon {
	cursor: pointer;
	transition: transform 0.2s ease;
}

.run-icon {
	width: 45px;
	height: 45px;
}

.delete-icon {
	width: 40px;
	height: 40px;
}

.run-icon:hover,
.delete-icon:hover {
	transform: scale(1.1);
}
</style>
