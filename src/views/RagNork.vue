<template>
	<header class="upperbar">
		<upperbar />
	</header>
	<aside class="sidebar" style="padding-top: 60px">
		<sidebar />
	</aside>
	<div class="ragnork-container">
		<div class="flow-container">
			<VueFlow
				v-model:nodes="nodes"
				v-model:edges="edges"
				:fit-view="true"
				:zoom-on-scroll="false"
				:default-viewport="{ zoom: 0.8 }"
				:min-zoom="0.2"
			>
				<template #node-default="nodeProps">
					<div
						class="node"
						:class="'ragnork-' + nodeProps.data.norkType"
						@click="handleNodeClick(nodeProps)"
					>
						<div
							class="node-content"
							v-if="nodeProps.data.norkType == 'main'"
						>
							{{
								selectedMainModel
									? selectedMainModel.model_name
									: '请选择主模型'
							}}
						</div>
						<div v-else class="node-content">
							{{ nodeProps.data.label }}
						</div>
						<div
							class="node-handles"
							style="position: relative; top: -48px"
						>
							<!-- 左侧 Handle -->
							<Handle
								type="target"
								:position="Position.Left"
								:id="`in-${nodeProps.id}`"
								style="left: -10px"
							/>
							<!-- 右侧 Handle -->
							<Handle
								type="source"
								:position="Position.Right"
								:id="`out-${nodeProps.id}`"
								style="right: -10px"
							/>
							<!-- 上侧 Handle -->
							<Handle
								v-if="nodeProps.data.norkType == 'main'"
								type="source"
								:position="Position.Top"
								:id="`out-${nodeProps.id}`"
								style="top: -60px"
							/>
						</div>
					</div>
				</template>
			</VueFlow>
		</div>

		<div class="ragnork-sidebar">
			<h3>辅助模型列表</h3>
			<el-button
				v-for="(model, index) in availableModels"
				:key="index"
				@click="addAuxiliaryModel(model)"
			>
				{{ model.name }}
			</el-button>
		</div>

		<div class="auxiliary-models">
			<h3>已选辅助模型</h3>
			<div
				v-for="(model, index) in selectedModels"
				:key="index"
				class="auxiliary-model"
			>
				<el-button @click="removeAuxiliaryModel(index)">
					{{ model.name }} <i class="el-icon-close"></i>
				</el-button>
			</div>
		</div>
		<el-dialog
			v-model="inputDialogVisible"
			title="请输入 Prompt"
			width="30%"
			:before-close="handleClose"
		>
			<el-input
				v-model="inputValue"
				type="textarea"
				:rows="4"
				placeholder="请输入内容"
			></el-input>
			<span slot="footer" class="input-dialog-footer">
				<button @click="saveInput" style="background-color: #4caf50">
					保存输入
				</button>
				<button @click="runRagnork" style="background-color: #4f46e5">
					运行 RAGnork
				</button>
			</span>
		</el-dialog>

		<el-dialog
			v-model="mainModelDialogVisible"
			title="选择主模型"
			width="30%"
		>
			<el-select v-model="selectedMainModel" placeholder="请选择一个模型">
				<el-option
					v-for="model in mainModelList"
					:key="model.id"
					:label="model.model_name"
					:value="model"
				></el-option>
			</el-select>
			<span slot="footer" class="main-dialog-footer">
				<button
					@click="cancelMainModel"
					style="background-color: #4caf50"
				>
					保存
				</button>
			</span>
		</el-dialog>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { VueFlow, Handle, Position } from '@vue-flow/core';
import { ElButton, ElDialog } from 'element-plus';
import Sidebar from '@/components/Sidebar.vue';
import Upperbar from '@/components/Upperbar.vue';
import { findAllModel } from '@/service/model.js';

onMounted(async () => {
	await fetchModelList();
	console.log(`output->`, mainModelList.value);
});

const availableModels = ref([
	{ name: '模型A' },
	{ name: '模型B' },
	{ name: '模型C' },
]);
const selectedModels = ref([]);

const nodes = ref([
	{
		id: 'input',
		type: 'default',
		position: { x: 700, y: 350 },
		data: { label: '输入节点', norkType: 'input' },
	},
	{
		id: 'main',
		type: 'default',
		position: { x: 1000, y: 350 },
		data: { label: '主模型节点', norkType: 'main' },
	},
	{
		id: 'output',
		type: 'default',
		position: { x: 1300, y: 350 },
		data: { label: '输出节点', norkType: 'output' },
	},
]);

const edges = ref([
	{ id: 'e1-2', source: 'input', target: 'main' },
	{ id: 'e2-3', source: 'main', target: 'output' },
]);

const configureMainModel = () => {
	alert('配置主模型功能尚未实现');
};

const addAuxiliaryModel = (model) => {
	selectedModels.value.push(model);
	const newNode = {
		id: `aux-${model.name}`,
		type: 'default',
		position: { x: 250, y: 150 + selectedModels.value.length * 100 },
		data: { label: model.name },
	};
	nodes.value.push(newNode);
	edges.value.push({
		id: `e-aux-${model.name}`,
		source: `aux-${model.name}`,
		target: 'main',
	});
};

const removeAuxiliaryModel = (index) => {
	const model = selectedModels.value[index];
	selectedModels.value.splice(index, 1);
	nodes.value = nodes.value.filter((node) => node.id !== `aux-${model.name}`);
	edges.value = edges.value.filter(
		(edge) => edge.id !== `e-aux-${model.name}`,
	);
};

const handleNodeClick = (nodeProps) => {
	const { id, data } = nodeProps;
	switch (data.norkType) {
		case 'input':
			inputDialogVisible.value = true;
			break;
		case 'main':
			mainModelDialogVisible.value = true; // 显示主模型的弹窗
			break;
		case 'output':
			outputDialogVisible.value = true;
			break;
		default:
			alert(`节点 ${id} 被点击，但未定义具体功能`);
	}
};

// 输入节点的部分
const inputDialogVisible = ref(false); // 控制弹窗的显示
const inputValue = ref(''); // 用户输入的内容

const saveInput = () => {
	// 保存输入内容的逻辑
	console.log('保存输入内容:', inputValue.value);
	inputDialogVisible.value = false;
};

const runRagnork = () => {
	// 运行 RAGnork 的逻辑
	console.log('运行 RAGnork');
	inputDialogVisible.value = false;
};

// 主模型节点的部分
const mainModelDialogVisible = ref(false); // 控制主模型弹窗的显示
const mainModelList = ref([]); // 主模型列表
const selectedMainModel = ref(null); // 选中的主模型

const fetchModelList = async () => {
	try {
		// 模拟从后端获取模型列表
		const data = await findAllModel();
		mainModelList.value = data.data;
	} catch (error) {
		console.error('获取模型列表失败:', error);
		mainModelList.value = [];
	}
};

const saveMainModel = () => {
	mainModelDialogVisible.value = false;
};

const cancelMainModel = () => {
	mainModelDialogVisible.value = false;
};
</script>

<style>
@import '@/assets/css/components/Bar.scss';
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';
.ragnork-container {
	width: 100%;
	padding-left: 2%;
	padding-right: 2%;
	padding-top: 60px;
	margin-top: 5px;
	max-height: 70%;
}

.flow-container {
	width: 100%;
	height: 600px;
	border: 1px solid #ccc;
	margin-top: 20px;
}

.node {
	background-color: #666;
	color: white;
	padding: 10px;
	border-radius: 5px;
}

.ragnork-sidebar {
	margin-top: 20px;
}

.auxiliary-models {
	margin-top: 20px;
}

.auxiliary-model {
	margin-bottom: 10px;
}

.vue-flow__node {
	background-color: #f0f0f0;
	border-radius: 5px;
	padding: 10px;
	border-color: #666;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	width: 142px;
	height: 142px;
}

.vue-flow__node .node {
	width: 100px;
	height: 100px;
}

.vue-flow__node .node .node-content {
	height: 96px;
	vertical-align: middle;
	text-align: center;
	font-size: 18px;
	color: #fff;
}

/* 自定义输入节点样式 */
.node.ragnork-input {
	background-color: #f0f0f0; /* 背景颜色 */
	border: 1px solid #ccc; /* 边框颜色 */
	border-radius: 10px; /* 圆角 */
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 阴影 */
	padding: 10px; /* 内边距 */
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: relative;
	cursor: pointer;
	transition: transform 0.2s ease-in-out; /* 鼠标悬停时的缩放效果 */
}

.node.ragnork-input .node-content {
	font-weight: bold;
	color: #333;
	text-align: center;
	margin-bottom: 10px;
}

.node.ragnork-input .node-handles {
	display: flex;
	justify-content: space-between;
	width: 100%;
}

.node.ragnork-input .node-handles .vue-flow__handle {
	width: 10px;
	height: 10px;
	background-color: #4caf50; /* 手柄颜色 */
	position: absolute;
	top: 50%;
	cursor: pointer;
}

.node.ragnork-input .node-handles .vue-flow__handle--left {
	left: 0;
}

.node.ragnork-input .node-handles .vue-flow__handle--right {
	right: 0;
}

.node.ragnork-main {
	background-color: #e0e0e0; /* 背景颜色 */
	border: 1px solid #9e9e9e; /* 边框颜色 */
	border-radius: 15px; /* 圆角 */
	box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2); /* 阴影 */
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: relative;
	cursor: pointer;
}

.node.ragnork-main .node-content {
	font-weight: bold;
	color: #333;
	text-align: center;
	margin-bottom: 10px;
}

.node.ragnork-main .node-handles {
	display: flex;
	justify-content: space-between;
	width: 100%;
}

.node.ragnork-main .node-handles .vue-flow__handle {
	width: 10px;
	height: 10px;
	background-color: #2196f3; /* 手柄颜色 */
	border-radius: 50%;
	border: 2px solid #fff; /* 手柄边框 */
	position: absolute;
	cursor: pointer;
}

.node.ragnork-main .node-handles .vue-flow__handle--left {
	left: 0;
}

.node.ragnork-main .node-handles .vue-flow__handle--right {
	right: 0;
}

.node.ragnork-output {
	background-color: #f5f5f5; /* 背景颜色 */
	border: 1px solid #dcdcdc; /* 边框颜色 */
	border-radius: 15px; /* 圆角 */
	box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15); /* 阴影 */
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: relative;
	cursor: pointer;
}

.node.ragnork-output .node-content {
	font-weight: bold;
	color: #333;
	text-align: center;
	margin-bottom: 10px;
}

.node.ragnork-output .node-handles {
	display: flex;
	justify-content: space-between;
	width: 100%;
}

.node.ragnork-output .node-handles .vue-flow__handle {
	width: 10px;
	height: 10px;
	background-color: #ff9800; /* 手柄颜色 */
	border-radius: 50%;
	border: 2px solid #fff; /* 手柄边框 */
	position: absolute;
	cursor: pointer;
}

.node.ragnork-output .node-handles .vue-flow__handle--left {
	left: 0;
}

.node.ragnork-output .node-handles .vue-flow__handle--right {
	right: 0;
}

.input-dialog-footer,
.main-dialog-footer button {
	color: white;
	padding: 0.5rem 1rem;
	border-radius: 0.125rem;
	border: none;
	cursor: pointer;
	margin-right: 20px;
	margin-top: 15px;
}
</style>
