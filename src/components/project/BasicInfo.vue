<template>
	<div class="basic-info-container">
		<div class="project-info">
			<h2>项目信息</h2>
			<p><strong>名称:</strong> {{ stata.project.project_name }}</p>
			<p><strong>状态:</strong> {{ stata.project.status }}</p>
			<p><strong>描述:</strong> {{ stata.project.description }}</p>
			<p><strong>创建时间:</strong> {{ stata.project.create_time }}</p>
			<p><strong>更改时间:</strong> {{ stata.project.update_time }}</p>
		</div>

		<div class="hyperparameters">
			<h2>更改超参</h2>
			<el-row
				v-for="(value, key) in stata.hyperparameters"
				:key="key"
				class="hyperparameter-item"
			>
				<el-col :span="8">
					<strong>{{ key }}</strong>
				</el-col>
				<el-col :span="16">
					<el-input
						v-model="stata.hyperparameters[key]"
						size="small"
						placeholder="请输入值"
					/>
				</el-col>
			</el-row>
			<div class="save-button">
				<el-button
					type="primary"
					@click="saveHyperparameters"
					style="margin-top: 10px"
					>保存</el-button
				>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { addHyparaOfProject } from '@/service/hypara';

const props = defineProps({
	stata: {
		type: Object,
		required: true,
	},
});

const saveHyperparameters = async () => {
	const newObject = {
		ProjectId: props.stata.project.projectId,
		...props.stata.hyperparameters,
	};
	const addHyparaOfProjectResponse = await addHyparaOfProject(newObject);
	if (addHyparaOfProjectResponse.resultCode == 200) {
		ElMessage.success('保存成功');
	} else {
		ElMessage.error('保存失败');
	}
};
</script>

<style scoped>
.basic-info-container {
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.project-info {
	padding: 10px;
	background-color: #f4f4f4;
	border-radius: 5px;
}

.hyperparameters {
	padding: 10px;
	background-color: #f4f4f4;
	border-radius: 5px;
}

.save-button {
	text-align: right;
}
</style>
