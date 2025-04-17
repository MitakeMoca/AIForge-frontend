<template>
	<el-container style="height: 100vh">
		<!-- 返回按钮 -->
		<el-button type="danger" @click="exitDocker()" class="elButtonGoBack">
			退出运行
		</el-button>

		<div class="action-buttons">
			<el-button type="success" @click="startDocker('train')">
				开始训练
			</el-button>
			<el-button type="info" @click="startDocker('test')">
				开始测试
			</el-button>
			<el-button type="danger" @click="deriveModel()">
				导出模型
			</el-button>
		</div>

		<el-aside width="22%">
			<div class="project-filter-container">
				<h2>项目文件</h2>

				<FolderTree
					:dataSource="fileData"
					@file-clicked="handleFileClicked"
				/>
			</div>
			<div class="download">
				<el-button type="primary" @click="downloadFile('trainData')"
					>下载训练数据</el-button
				>
				<el-button type="primary" @click="downloadFile('testData')"
					>下载测试数据</el-button
				>
			</div>
		</el-aside>

		<el-main>
			<el-tabs v-model="activeTab">
				<el-tab-pane label="基本信息" name="basic">
					<BasicInfo :stata="stata" />
				</el-tab-pane>
				<el-tab-pane label="文件界面" name="files">
					<div class="tab-content">
						<!-- 文件展示区域 -->
						<div v-if="fileContent">
							<!-- 根据文件类型判断展示方式 -->
							<div v-if="isTextFile" class="file-content">
								<highlightjs
									:language="language"
									:code="fileContent"
								/>
							</div>
							<div v-if="isImageFile" class="file-content">
								<img
									:src="fileContent"
									alt="image"
									class="file-image"
								/>
							</div>
						</div>
					</div>
				</el-tab-pane>

				<el-tab-pane label="训练日志" name="logs">
					<TrainingLog :logs="logs" />
				</el-tab-pane>

				<!-- 项目聊天界面 -->
				<el-tab-pane label="项目工作" name="chat">
					<div class="chat-container">
						<!-- Chat Area -->
						<el-main class="chat-main">
							<div
								v-for="msg in messages"
								:key="msg.id"
								class="message"
								:class="msg.from"
							>
								<span
									v-if="msg.type === 'text'"
									v-html="renderMarkdown(msg.content)"
									class="message-text"
								></span>
								<img
									v-if="msg.type === 'image'"
									:src="msg.content"
									alt="Project Response"
									class="message-image"
								/>
								<p
									v-if="msg.type === 'user'"
									class="message-user"
								>
									{{ msg.content }}
								</p>
							</div>
						</el-main>

						<!-- Input Area -->
						<el-footer class="chat-footer">
							<el-upload
								class="upload-demo"
								:auto-upload="false"
								:on-change="sendFile"
								:show-file-list="false"
							>
								<el-icon
									:size="30"
									color="#409EFF"
									style="margin-top: 5px; margin-left: -10px"
								>
									<Paperclip class="paperclip" />
								</el-icon>
							</el-upload>
							<el-input
								v-model="userInput"
								placeholder="聊点什么..."
								@keyup.enter="sendMessage"
								:rows="1"
								class="chat-input"
							/>
							<el-button
								@click="sendMessage"
								type="primary"
								style="height: 100%"
								>发送</el-button
							>
						</el-footer>
					</div>
				</el-tab-pane>
			</el-tabs>
		</el-main>
	</el-container>
</template>

<script setup>
import { ref, onMounted, reactive, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FolderTree from '@/components/FolderTree.vue';
import TrainingLog from '@/components/project/TrainingLog.vue';
import { getFolderTree, getProject } from '@/service/project';
import { downloadData } from '@/service/dataset';
import {
	runDocker,
	stopDocker,
	createDocker,
	project2model,
} from '@/service/project';
import { findHyparaByPath, getHyparasByProjectId } from '@/service/hypara';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getLocal } from '@/utils/local';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client/dist/sockjs.min.js';
import { downloadByPath } from '@/service/pic';
import { getFile } from '@/service/project';
import 'highlight.js/lib/common';
import hljsVuePlugin from '@highlightjs/vue-plugin';
import 'highlight.js/styles/github.css';
import Blob from 'blob-polyfill';
import axios from 'axios'; // 用于请求文件内容
import MarkdownIt from 'markdown-it';
import texmath from 'markdown-it-texmath';
import katex from 'katex';
import { Client } from '@stomp/stompjs';
import BasicInfo from '@/components/project/BasicInfo.vue';
import { MimeType } from '@/utils/MimeType.js'; // 引入 mimeTypeMap
import hljs from 'highlight.js/lib/core';
import { Paperclip } from '@element-plus/icons-vue';
import { addPicture } from '@/service/pic.js';

const highlightjs = hljsVuePlugin.component;

const md = new MarkdownIt({
	html: true, // 启用 HTML 标签解析
	linkify: true, // 自动将 URL 转为链接
	typographer: true, // 启用智能排版
}).use(texmath, {
	engine: katex,
	delimiters: [
		'dollars',
		'brackets',
		'doxygen',
		'gitlab',
		'julia',
		'kramdown',
		'beg_end',
	],
	katexOptions: { macros: { '\\RR': '\\mathbb{R}' } },
});
const codeBlockRef = ref(null);
const route = useRoute();
const router = useRouter();
const stata = reactive({
	userId: '',
	project: {
		projectId: 0,
		projectName: 'NAME',
		status: 'init',
		description: 'This is a description of the AI model training project.',
		createTime: '',
		updateTime: '',
		visibility: '',
		storePath: '',
		modelId: 0,
		train_DatasetId: 0,
		test_DatasetId: 0,
	},
	hyperparameters: {},
});

const logs = ref([
	// { id: 1, message: "[12:00:00] - Training started..." },
	// { id: 2, message: "[12:05:00] - Epoch 1 completed." },
	// { id: 3, message: "[12:10:00] - Epoch 2 completed." },
]);
let isConnected = false;

const messages = ref([
	// { id: 1, type: 'text', content: '欢迎使用支持 LaTeX 的 Markdown 聊天！\n\n这里有一些数学公式示例：\n\n$E = mc^2$\n\n这是一个多行数学表达式：\n\n$$\n\\log_2(8) = x \\\\\n2^x = 8 \\\\\nx = \\log_2(8)\n$$\n\n因此，答案是 3。\n\n行内公式：$a \\times b = c$' },
	// { id: 2, type: 'user', content: '这是一条用户消息' },
	// { id: 3, type: 'text', content: 'Qwen: 在数学中，我们定义 \\( \\log_b(a) \\) 表示以 \\( b \\) 为底 \\( a \\) 的对数。对于 \\( a = 8 \\)，我们需要找到一个底数 \\( b \\)，使得 \\( b^a = 8 \\)。\n' +
	//       '\n' +
	//       '首先，我们知道 \\( 2^3 = 8 \\)，因为 \\( 2 \\times 2 \\times 2 = 8 \\)。\n' +
	//       '\n' +
	//       '因此，\\( \\log_2(8) = 3 \\)。\n' +
	//       '\n' +
	//       '所以，\\(\\log_2(8)\\) 等于 3。' },
	// { id: 4, type: 'text', content: '以下是一个表格：\n\n| 列1 | 列2 |\n|-----|-----|\n| 单元格1 | 单元格2 |\n\n这是一个 [链接](https://example.com) 和一些 `行内代码`。' },
]); // 用于存储聊天消息
const userInput = ref(''); // 用户输入的消息
const activeTab = ref('basic');

let stompClient = null;
const fileData = ref([]); // 文件树数据
const fileContent = ref(null); // 文件内容
const isTextFile = ref(false);
const isImageFile = ref(false);
let intervalId = null;
const language = ref('python'); // 默认语言为 Python

onMounted(async () => {
	stata.userId = getLocal('userId');
	// if (stata.userId == null || stata.userId == "") {
	//   router.push("/");
	// }
	await fetchData();
	const getFolderTreeResponse = await getFolderTree(
		Number(stata.project.project_id),
	);
	fileData.value = getFolderTreeResponse.data;
	const getHyparaByProjectIdResponse = await getHyparasByProjectId(
		Number(stata.project.project_id),
	);
	stata.hyperparameters = getHyparaByProjectIdResponse.data;
	console.log(stata.hyperparameters);

	// 定期重新调用 fetchData
	intervalId = setInterval(fetchData, 10000); // 修改间隔时间为需要的毫秒数

	// 在组件挂载后加载 KaTeX CSS
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.7/dist/katex.min.css';
	document.head.appendChild(link);
	connectWebSocket();
});

onUnmounted(async () => {
	if (intervalId) {
		clearInterval(intervalId);
		intervalId = null;
	}
});

const renderMarkdown = (content) => {
	return md.render(content);
};

const fetchData = async () => {
	try {
		const { id } = route.params;
		stata.project.projectId = id;
		const getProjectResponse = await getProject({
			ProjectId: Number(stata.project.projectId),
		});
		stata.project = getProjectResponse.data;
	} catch (error) {
		console.error('数据获取失败:', error);
	}
};

let isTrain = false;
const startDocker = async (command) => {
	if (isTrain) {
		ElMessage.error('正在运行中, 请等待运行结束');
		return;
	}
	isTrain = true;
	console.log('command: ' + command);
	console.log('id: ' + stata.project.status);

	activeTab.value = 'logs';
	if (
		stata.project.status == 'init' ||
		stata.project.status == 'stopped' ||
		stata.project.status == 'finished' ||
		stata.project.status == 'wait'
	) {
		const createDockerResponse = await createDocker(
			Number(stata.project.project_id),
		);
		if (
			createDockerResponse.resultCode != 200 &&
			['403'].includes(createDockerResponse.data)
		) {
			ElMessage.error('启动失败, 请重试');
			return;
		}
	} else if (stata.project.status == 'running') {
		// 一般情况下不会出现，出现的时候需要先暂停运行
		const stopDockerResponse = await stopDocker(
			Number(stata.project.projectId),
		);
		const createDockerResponse = await createDocker(
			Number(stata.project.project_id),
		);
		if (createDockerResponse.resultCode != 200) {
			ElMessage.error('启动失败, 请重试');
			return;
		}
	}

	const getHyparaByProjectIdResponse = await getHyparasByProjectId(
		Number(stata.project.project_id),
	);
	console.log(getHyparaByProjectIdResponse);
	if (
		getHyparaByProjectIdResponse.data == null ||
		getHyparaByProjectIdResponse.data.length == 0
	) {
		ElMessage.error('没有超参路径！');
		return;
	}

	const findHyparaByPathResponse = getHyparaByProjectIdResponse;
	if (
		findHyparaByPathResponse.data == null ||
		findHyparaByPathResponse.data == {}
	) {
		ElMessage.error('超参为空！');
		return;
	}

	console.log(`output->`, {
		project_id: Number(stata.project.project_id),
		command: command + '.py',
		hypara: findHyparaByPathResponse.data,
	});
	if (!isConnected) {
		console.log('WebSocket 未连接，正在尝试连接...');
		connectWebSocket();
	}
	const currentDate = new Date();
	const formattedTime = currentDate.toLocaleTimeString();
	handleLogMessage({
		message_id: 1,
		timestamp: formattedTime,
		message: '模型开始训练',
		entry: 'system',
	});
	const runDockerResponse = await runDocker({
		project_id: Number(stata.project.project_id),
		command: command,
		hypara: findHyparaByPathResponse.data,
	});
	handleLogMessage({
		message_id: 2,
		timestamp: formattedTime,
		message: '模型训练完成',
		entry: 'system',
	});
	console.log(runDockerResponse);
	if (runDockerResponse.resultCode == 200) {
		ElMessage.success(command == 'train' ? '训练完成' : '开始测试');
	} else {
		ElMessage.error('无法运行!');
		return;
	}
	await fetchData();

	isTrain = false;
};

const exitDocker = async () => {
	if (
		stata.project.status == 'wait' ||
		stata.project.status == 'finished' ||
		stata.project.status == 'running'
	) {
		ElMessage.success('正在关闭环境, 这可能需要一段时间...');
		const stopDockerResponse = await stopDocker(
			Number(stata.project.projectId),
		);
		if (stopDockerResponse.resultCode != 200) {
			ElMessage.error('停止失败');
		}
	}
	ElMessage.success('停止成功, 正在返回...');
	setTimeout(() => {
		router.go(-1);
	}, 500);
};

const deriveModel = async () => {
	try {
		const confirm = await ElMessageBox.confirm(
			'确定要导出模型吗？此操作可能需要一段时间。',
			'确认操作',
			{
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			},
		);

		// 如果用户点击 "确定"
		if (confirm) {
			const project2modelResponse = await project2model(
				Number(stata.project.project_id),
			);

			if (project2modelResponse.resultCode === 200) {
				ElMessage.success('导出模型成功！');
			} else {
				ElMessage.error(
					`导出模型失败: ${project2modelResponse.message}`,
				);
			}
		}
	} catch (error) {
		// 用户点击 "取消" 或出现异常
		if (error !== 'cancel') {
			console.error('模型推导时出错:', error);
			ElMessage.error('发生错误，请稍后再试！');
		}
	}
};

const connectWebSocket = () => {
	const socketUrl = 'ws://localhost:8084/ws'; // 用 WebSocket 协议
	const socket = new WebSocket(socketUrl);

	// WebSocket 连接成功时的回调
	socket.onopen = () => {
		isConnected = true;
		console.log('Connected to WebSocket');
		socket.send(JSON.stringify({ message: 'Hello from frontend' }));
		// 发送订阅请求或初始化操作
		subscribeToLogs(socket);
		subscribeToChat(socket);
	};

	// WebSocket 收到消息时的回调
	socket.onmessage = (event) => {
		console.log('Message from server:', event.data);
		const message = JSON.parse(event.data);
		if (message.type === 'log') {
			handleLogMessage(message);
		} else if (message.type === 'chat') {
			handleChatMessage(message);
		}
	};

	// WebSocket 连接关闭时的回调
	socket.onclose = () => {
		console.log('WebSocket connection closed');
	};

	// WebSocket 发生错误时的回调
	socket.onerror = (error) => {
		console.log('WebSocket error occurred:', error);
		console.log('Error message:', error.message); // 查看详细错误消息
		console.log('Error stack:', error.stack); // 查看错误的调用栈
	};
};

// 订阅日志消息
const subscribeToLogs = (socket) => {
	const message = JSON.stringify({
		action: 'subscribe',
		channel: `/topic/logs/project_${stata.project.project_id}`,
	});
	socket.send(message); // 发送订阅请求
};

// 订阅聊天消息
const subscribeToChat = (socket) => {
	const message = JSON.stringify({
		action: 'subscribe',
		channel: `/topic/chat/project_${stata.project.project_id}`,
	});
	socket.send(message); // 发送订阅请求
};

let logsSet = new Set();
let messageSet = new Set();
// 处理日志消息
const handleLogMessage = (message) => {
	const newLog = message;
	if (logsSet.has(newLog.message_id)) return;
	const currentDate = new Date();
	const formattedTime = currentDate.toLocaleTimeString();
	logs.value.push({
		id: logs.value.length + 1,
		timestamp: formattedTime,
		message: newLog.message,
		entry: newLog.entry,
	});
	logsSet.add(newLog.message_id);
	console.log(`output->logs`, logs);
};

// 处理聊天消息
const handleChatMessage = (message) => {
	const newChat = message;
	if (messageSet.has(newChat.message_id)) return;
	messages.value.push({
		id: Date.now(),
		from: 'bot',
		type: 'text',
		content: newChat.message,
	});
	messageSet.add(newChat.message_id);
};

// 发送消息
const sendMessage = async () => {
	if (stata.project.status == 'init' || stata.project.status == 'stopped') {
		const createDockerResponse = await createDocker(
			Number(stata.project.project_id),
		);
		if (
			createDockerResponse.resultCode != 200 &&
			['403'].includes(createDockerResponse.data)
		) {
			ElMessage.error('启动失败, 请重试');
			return;
		}
	} else if (stata.project.status == 'running') {
		ElMessage.error('项目正在工作, 请稍后再试');
		return;
	}
	if (!isConnected) {
		console.log('WebSocket 未连接，正在尝试连接...');
		connectWebSocket(); // 尝试连接 WebSocket
	}
	if (userInput.value.trim()) {
		const runDockerResponse = await runDocker({
			Project_id: Number(stata.project.projectId),
			command: 'predict.py',
			hypara: { message: userInput.value },
		});
		console.log(runDockerResponse);

		// 将用户输入添加到聊天记录
		messages.value.push({
			id: Date.now(),
			from: 'user',
			type: 'text',
			content: userInput.value,
		});
		userInput.value = ''; // 清空输入框
	}
};

const sendFile = async (file) => {
	console.log(`output->mooo`, file, file.status);
	if (file.status === 'ready') {
		// 先将文件存在后端
		const formData = new FormData();
		formData.append('file', file.raw);
		const filePath = await addPicture(formData);
		// const filePath = file.response.data.file_path;
		console.log(`output->filePath`, filePath);
		if (!isConnected) {
			console.log('WebSocket 未连接，正在尝试连接...');
			connectWebSocket(); // 尝试连接 WebSocket
		}
		file.status = 'success';
		messages.value.push({
			id: Date.now(),
			from: 'user',
			type: 'image',
			content: filePath,
		});

		// 启动 Docker
		if (
			stata.project.status == 'init' ||
			stata.project.status == 'stopped' ||
			stata.project.status == 'finished' ||
			stata.project.status == 'wait'
		) {
			const createDockerResponse = await createDocker(
				Number(stata.project.project_id),
			);
			if (
				createDockerResponse.resultCode != 200 &&
				['403'].includes(createDockerResponse.data)
			) {
				ElMessage.error('启动失败, 请重试');
				return;
			}
		} else if (stata.project.status == 'running') {
			// 一般情况下不会出现，出现的时候需要先暂停运行
			const stopDockerResponse = await stopDocker(
				Number(stata.project.projectId),
			);
			const createDockerResponse = await createDocker(
				Number(stata.project.project_id),
			);
			if (createDockerResponse.resultCode != 200) {
				ElMessage.error('启动失败, 请重试');
				return;
			}
		}

		const runDockerResponse = await runDocker({
			project_id: Number(stata.project.project_id),
			command: 'predict',
			hypara: { file_path: filePath },
		});
		console.log(runDockerResponse);
	}
};

// 文件点击事件
const handleFileClicked = async (fileInfo) => {
	activeTab.value = 'files';

	console.log(`output->fileInfo`, fileInfo);
	const filePath = fileInfo.path;
	// 比如 Dockerfile
	const fileExtension = filePath.includes('.')
		? filePath.split('.').pop()
		: filePath.split('\\').pop();
	console.log(`output->fileExtension`, fileExtension);
	try {
		console.log(filePath, fileExtension);
		if (MimeType(fileExtension).startsWith('text/')) {
			const response = await getFile(filePath);
			fileContent.value = response.data.file_content;
			isTextFile.value = true;
			isImageFile.value = false;
			language.value = MimeType(fileExtension).split('/')[1]; // 获取语言类型
		} else if (MimeType(fileExtension).startsWith('image/')) {
			const response = await downloadByPath(filePath);
			console.log(response);
			// 将响应内容作为 Blob 数据处理
			const blob = response; // 直接从 response 获取 Blob
			fileContent.value = URL.createObjectURL(blob); // 转为 URL 存入 ref
			isTextFile.value = false;
			isImageFile.value = true;
		} else {
			ElMessage.error('不支持的文件类型');
		}
	} catch (error) {
		console.log(`output->error`, error);
		ElMessage.error('无法加载文件内容');
	}
};

// 文件下载逻辑
const downloadFile = async (type) => {
	try {
		let downloadDataResponse;
		if (type == 'trainData') {
			downloadDataResponse = await downloadData({
				DatasetId: stata.project.train_DatasetId,
			});
		} else {
			downloadDataResponse = await downloadData({
				DatasetId: stata.project.test_DatasetId,
			});
		}

		const link = document.createElement('a');
		link.href = URL.createObjectURL(downloadDataResponse);
		link.download = `${
			type === 'trainData'
				? stata.project.train_DatasetId
				: stata.project.test_DatasetId
		}.zip`;
		link.click();

		// 释放 URL 对象
		URL.revokeObjectURL(link.href);
	} catch (error) {
		ElMessage.error('下载失败');
	}
};
</script>

<style scoped>
.elButtonGoBack {
	position: fixed;
	left: 15px;
	top: 10px;
	z-index: 10;
	/* 确保按钮在最上层 */
}

.action-buttons {
	position: fixed;
	top: 10px;
	right: 10px;
	display: flex;
	gap: 10px;
	z-index: 10;
}

.el-aside {
	display: flex;
	flex-direction: column;
	background-color: #f4f4f4;
	padding: 20px;
	overflow-y: auto;
	justify-content: space-between;
}

.action-button {
	padding: 10px;
}

.el-main {
	background-color: #fff;
	padding: 20px;
	overflow-y: auto;
}

.project-filter-container {
	margin-bottom: 20px;
}

.hyperparameters {
	padding: 10px;
}

.download {
	justify-content: flex-end;
}
.tab-content {
	padding: 20px;
	background-color: #f9f9f9;
	border-radius: 5px;
}

.action-button {
	padding: 10px;
}

.file-content {
	white-space: pre-wrap;
	/* 保持空白符，自动换行 */
	word-wrap: break-word;
	/* 长单词或URL自动换行 */
	background-color: #f5f5f5;
	/* 背景色 */
	padding: 20px;
	/* 内边距 */
	border: 1px solid #ddd;
	/* 边框 */
	border-radius: 4px;
	/* 边框圆角 */
	overflow: auto;
	/* 超出部分显示滚动条 */
	max-height: 80vh;
	/* 最大高度 */
	line-height: 1.6;
	/* 行高 */
	font-size: 14px;
	/* 字体大小 */
	text-align: left;
	/* 文本左对齐 */
}

.file-image {
	max-width: 100%;
	height: auto;
	display: block;
	margin: 0 auto;
	border-radius: 4px;
	border: 1px solid #ddd;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	transition: all 0.3s ease;
	cursor: pointer;
}

.file-image:hover {
	transform: scale(1.05);
	/* 鼠标悬停时图片放大 */
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	/* 鼠标悬停时阴影加深 */
}

.chat-container {
	display: flex;
	flex-direction: column;
	height: 100%;
	margin-bottom: 48px;
}

.chat-main {
	flex-grow: 1;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	/* Ensure space for footer */
}

.chat-footer {
	padding: 10px;
	width: 67%;
	background: #fff;
	border-top: 1px solid #ddd;
	position: fixed;
	bottom: 0;
	display: flex;
}

.message {
	padding: 3px 13px;
	border-radius: 10px;
	max-width: 45%;
	word-wrap: break-word;
	white-space: pre-wrap;
}

.message-image {
	max-width: 100%;
}

.chat-input {
	margin-left: 10px;
}

.message.bot {
	background-color: #e0e0e0;
	color: #333;
	text-align: left;
	align-self: flex-start;
	margin: 6px 0px 12px;
	border-radius: 10px;
	max-width: 60%;
	word-wrap: break-word;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.message.image img {
	max-width: 100%;
	height: auto;
	text-align: left;
	align-self: flex-start;
	margin: 6px 0px 12px;
	/* 回答消息靠左 */
}

.message.user {
	background-color: #007bff;
	color: white;
	text-align: left;
	align-self: flex-end;
	margin-bottom: 12px;
	/* 用户消息靠右 */
}

.el-button {
	margin-left: 10px;
}

:deep(.file-content) {
	pre code.hljs {
		font-size: 20px;
	}
}

/* 添加一些基本的 Markdown 样式 */
:deep(.message-text) {
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		margin-top: 1em;
		margin-bottom: 0.5em;
	}

	code {
		background-color: #f0f0f0;
		padding: 2px 4px;
		border-radius: 4px;
	}

	p {
		margin: 0 !important;
		margin-top: 15px !important;
	}

	pre {
		background-color: #f0f0f0;
		padding: 10px;
		border-radius: 4px;
		overflow-x: auto;
	}

	table {
		border-collapse: collapse;
		width: 100%;
	}

	th,
	td {
		border: 1px solid #ddd;
		padding: 8px;
	}

	th {
		background-color: #f2f2f2;
	}

	/* 添加数学公式样式 */
	.katex-display {
		margin: 1em 0;
		overflow-x: auto;
		overflow-y: hidden;
	}
}
</style>
