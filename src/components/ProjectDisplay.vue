<template>
	<div class="body">
		<el-scrollbar>
			<div
				class="project-item"
				@click="showConfig(item.projectId)"
				v-for="(item, index) in projectList"
				:key="index"
			>
				<span class="name">{{ item.projectName }}</span>
				<div class="tags">
					<div class="tag">
						<span>{{ item.description }}</span>
					</div>
				</div>

				<span class="id">project-id : {{ item.projectId }}</span>
				<span class="time">{{ item.createTime }}</span>
				<span
					class="status"
					:class="{
						waiting: item.status === 'wait',
						finished: item.status === 'finished',
						init: item.status === 'init',
						stopped: item.status === 'stopped',
					}"
				>
					状态: {{ item.status }}
				</span>
				<run-icon
					class="run-icon"
					@click.stop="runProject(item)"
				></run-icon>
				<big-delete-icon
					class="delete-icon"
					@click.stop="
						deleteProject = item;
						deleteDialog = true;
					"
				></big-delete-icon>
			</div>
		</el-scrollbar>
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

<script>
import RunIcon from '@/assets/icon/RunIcon.vue';
import BigDeleteIcon from '@/assets/icon/BigDeleteIcon.vue';
import EditIcon from '@/assets/icon/EditIcon.vue';
import DeleteIcon from '@/assets/icon/DeleteIcon.vue';
import { deleteProject } from '@/service/project.js';

export default {
	name: 'ProjectDisplay',
	components: { DeleteIcon, EditIcon, BigDeleteIcon, RunIcon },
	props: ['projectList'],
	data() {
		return {
			deleteDialog: false,
			deleteProject: '',
		};
	},
	methods: {
		confirmDelete() {
			deleteProject({ ProjectId: this.deleteProject.projectId });
			this.deleteProject = '';
			this.deleteDialog = false;
			location.reload();
		},
		showConfig(id) {
			this.$router.push(`/project/projectConfig/${id}`);
		},
		runProject(item) {
			this.$notify({ message: '正在启动, 请稍等', type: 'success' });
			setTimeout(() => {
				this.$router.push(`/runProject/${item.projectId}`);
			}, 1000);
		},
	},
};
</script>

<style scoped>
@import '../assets/css/project/projectDisplay.scss';
</style>
