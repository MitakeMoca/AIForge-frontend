<template>
	<el-table :data="state.models" stripe style="width: 100%">
		<el-table-column prop="id" label="模型ID" width="160px" />
		<el-table-column prop="model_name" label="模型名" width="160px" />
		<el-table-column prop="frame" label="框架" width="160px" />
		<el-table-column prop="model_date" label="模型日期" width="160px" />
		<el-table-column label="模型描述" width="160px">
			<template #default="scope">
				<div
					class="text-clamp"
					v-tooltip="scope.row['model_description']"
				>
					{{ scope.row['model_description'] }}
				</div>
			</template>
		</el-table-column>
		<el-table-column
			prop="model_run_count"
			label="运行次数"
			width="160px"
		/>
		<el-table-column
			prop="model_view_count"
			label="观看次数"
			width="160px"
		/>
		<el-table-column prop="model_path" label="模型路径" width="160px" />
		<el-table-column prop="user_id" label="用户ID" width="160px" />
		<el-table-column fixed="right" label="删除">
			<template #default="scope">
				<el-button
					type="danger"
					:icon="Delete"
					@click="setprivate(scope.row.modelId)"
				/>
			</template>
		</el-table-column>
		<el-table-column fixed="right" label="开启">
			<template #default="scope">
				<el-button
					type="primary"
					:icon="Check"
					@click="setpublic(scope.row.modelId)"
				/>
			</template>
		</el-table-column>
	</el-table>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Check, Delete } from '@element-plus/icons-vue';
import { setPrivate, setPublic, findAllModelWaiting } from '@/service/model';

const state = reactive({
	models: [],
});

// 关闭模型（下架）
const setprivate = async (ModelId) => {
	const response = await setPrivate({ modelId: ModelId });
	const resultCode = response.resultCode || '';
	if (resultCode === 200) {
		ElMessage.success('下架成功');
	} else {
		ElMessage.error('下架失败');
	}
};

// 设置模型为公开
const setpublic = async (ModelId) => {
	const response = await setPublic({ modelId: ModelId });
	const resultCode = response.resultCode || '';
	if (resultCode === 200) {
		ElMessage.success('上架成功');
	} else {
		ElMessage.error('上架失败');
	}
};

onMounted(async () => {
	const response = await findAllModelWaiting();
	state.models = response.data;
});
</script>
