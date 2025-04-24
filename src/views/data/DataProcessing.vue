<template>
	<header class="upperbar">
		<upperbar />
	</header>
	<aside class="sidebar" style="padding-top: 60px">
		<sidebar />
	</aside>
	<div class="dataset-container">
		<div class="button-container">
			<el-dropdown
				v-model="selectedPreprocess"
				trigger="click"
				@command="handlePreprocess"
			>
				<el-button class="preprocess-button">
					数据集预处理操作
					<el-icon class="el-icon--right"><arrow-down /></el-icon>
				</el-button>
				<template #dropdown>
					<el-dropdown-menu>
						<!-- 图像预处理操作 -->
						<el-dropdown-item
							v-if="activeTab === 'image'"
							command="grayscale"
							>灰化</el-dropdown-item
						>
						<el-dropdown-item
							v-if="activeTab === 'image'"
							command="resize"
							>大小裁剪</el-dropdown-item
						>
						<el-dropdown-item
							v-if="activeTab === 'image'"
							command="rotate"
							>旋转</el-dropdown-item
						>
						<el-dropdown-item
							v-if="activeTab === 'image'"
							command="brightness"
							>亮度调整</el-dropdown-item
						>
						<el-dropdown-item
							v-if="activeTab === 'image'"
							command="contrast"
							>对比度调整</el-dropdown-item
						>
						<el-dropdown-item
							v-if="activeTab === 'image'"
							command="flip"
							>水平翻转</el-dropdown-item
						>
						<el-dropdown-item
							v-if="activeTab === 'image'"
							command="crop"
							>裁剪</el-dropdown-item
						>
						<el-dropdown-item
							v-if="activeTab === 'image'"
							command="blur"
							>模糊</el-dropdown-item
						>
						<el-dropdown-item
							v-if="activeTab === 'image'"
							command="sharpen"
							>锐化</el-dropdown-item
						>
						<el-dropdown-item
							v-if="activeTab === 'image'"
							command="edgeDetection"
							>边缘检测</el-dropdown-item
						>

						<!-- 文本预处理操作 -->
						<el-dropdown-item
							v-if="activeTab === 'text'"
							command="lowercase"
							>转换为小写</el-dropdown-item
						>
						<el-dropdown-item
							v-if="activeTab === 'text'"
							command="uppercase"
							>转换为大写</el-dropdown-item
						>
						<el-dropdown-item
							v-if="activeTab === 'text'"
							command="trim"
							>去除空格</el-dropdown-item
						>
						<el-dropdown-item
							v-if="activeTab === 'text'"
							command="removePunctuation"
							>去除标点符号</el-dropdown-item
						>
						<el-dropdown-item
							v-if="activeTab === 'text'"
							command="tokenize"
							>分词</el-dropdown-item
						>
						<el-dropdown-item
							v-if="activeTab === 'text'"
							command="stemming"
							>词干提取</el-dropdown-item
						>
						<el-dropdown-item
							v-if="activeTab === 'text'"
							command="lemmatization"
							>词形还原</el-dropdown-item
						>
						<el-dropdown-item
							v-if="activeTab === 'text'"
							command="removeStopWords"
							>去除停用词</el-dropdown-item
						>

						<!-- 音频预处理操作 -->
						<el-dropdown-item
							v-if="activeTab === 'audio'"
							command="normalize"
							>音频归一化</el-dropdown-item
						>
						<el-dropdown-item
							v-if="activeTab === 'audio'"
							command="resample"
							>音频重采样</el-dropdown-item
						>
						<el-dropdown-item
							v-if="activeTab === 'audio'"
							command="removeNoise"
							>降噪</el-dropdown-item
						>
						<el-dropdown-item
							v-if="activeTab === 'audio'"
							command="trimSilence"
							>去除静音部分</el-dropdown-item
						>
						<el-dropdown-item
							v-if="activeTab === 'audio'"
							command="changePitch"
							>改变音高</el-dropdown-item
						>
						<el-dropdown-item
							v-if="activeTab === 'audio'"
							command="changeSpeed"
							>改变速度</el-dropdown-item
						>
						<el-dropdown-item
							v-if="activeTab === 'audio'"
							command="equalize"
							>音频均衡化</el-dropdown-item
						>

						<!-- 视频预处理操作 -->
						<el-dropdown-item
							v-if="activeTab === 'video'"
							command="extractFrames"
							>提取帧</el-dropdown-item
						>
						<el-dropdown-item
							v-if="activeTab === 'video'"
							command="changeResolution"
							>改变分辨率</el-dropdown-item
						>
						<el-dropdown-item
							v-if="activeTab === 'video'"
							command="trimVideo"
							>裁剪视频</el-dropdown-item
						>
						<el-dropdown-item
							v-if="activeTab === 'video'"
							command="addWatermark"
							>添加水印</el-dropdown-item
						>
						<el-dropdown-item
							v-if="activeTab === 'video'"
							command="changeFramerate"
							>改变帧率</el-dropdown-item
						>
						<el-dropdown-item
							v-if="activeTab === 'video'"
							command="rotateVideo"
							>旋转视频</el-dropdown-item
						>
						<el-dropdown-item
							v-if="activeTab === 'video'"
							command="flipVideo"
							>翻转视频</el-dropdown-item
						>
						<el-dropdown-item
							v-if="activeTab === 'video'"
							command="adjustBrightness"
							>调整亮度</el-dropdown-item
						>
						<el-dropdown-item
							v-if="activeTab === 'video'"
							command="adjustContrast"
							>调整对比度</el-dropdown-item
						>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
			<button class="create-button" @click="download()">
				下载数据集
			</button>
		</div>
		<el-tabs v-model="activeTab" type="border-card">
			<el-tab-pane label="图像" name="image">
				<div class="card-list">
					<div
						class="card-item"
						v-for="(item, index) in imageList"
						:key="index"
					>
						<el-card class="box-card">
							<div class="card-content">
								<div class="card-thumbnail image-thumbnail">
									<img
										:src="item.url"
										alt="图像"
										style="
											width: 100%;
											height: 100%;
											object-fit: cover;
											cursor: pointer;
										"
									/>
								</div>
								<div class="card-type">{{ item.name }}</div>
							</div>
						</el-card>
					</div>
				</div>
			</el-tab-pane>
			<el-tab-pane label="文本" name="text">
				<div class="card-list">
					<div
						class="card-item"
						v-for="(item, index) in textList"
						:key="index"
					>
						<el-card class="box-card">
							<div class="card-content">
								<div class="card-thumbnail text-thumbnail">
									<span>{{
										item.text
											? item.text.substring(
													0,
													Math.min(
														item.text.length,
														200,
													),
											  )
											: '无文本内容'
									}}</span>
								</div>
								<div class="card-type">{{ item.name }}</div>
							</div>
						</el-card>
					</div>
				</div>
			</el-tab-pane>
			<el-tab-pane label="音频" name="audio">
				<div class="card-list">
					<div
						class="card-item"
						v-for="(item, index) in audioList"
						:key="index"
					>
						<el-card class="box-card">
							<div class="card-content">
								<div class="card-thumbnail audio-thumbnail">
									<img
										:src="musicCover"
										alt="图像"
										style="
											width: 100%;
											height: 100%;
											object-fit: cover;
											cursor: pointer;
										"
									/>
								</div>
								<div class="card-type">{{ item.name }}</div>
							</div>
						</el-card>
					</div>
				</div>
			</el-tab-pane>
			<el-tab-pane label="视频" name="video">
				<div class="card-list">
					<div
						class="card-item"
						v-for="(item, index) in videoList"
						:key="index"
					>
						<el-card class="box-card">
							<div class="card-content">
								<div class="card-thumbnail video-thumbnail">
									<img
										:src="item.thumbnail"
										alt="视频封面"
										style="
											width: 100%;
											height: 100%;
											object-fit: cover;
											cursor: pointer;
										"
									/>
								</div>
								<div class="card-type">{{ item.name }}</div>
							</div>
						</el-card>
					</div>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useFileStore } from '@/stores/filestore.ts';
import JSZip from 'jszip';
import Sidebar from '@/components/Sidebar.vue';
import Upperbar from '@/components/Upperbar.vue';
import {
	ElMessage,
	ElDropdown,
	ElDropdownMenu,
	ElDropdownItem,
	ElButton,
	ElIcon,
} from 'element-plus';
import { ArrowDown } from '@element-plus/icons-vue';
import musicCover from '@/assets/img/music-cover.png';

const fileStore = useFileStore();
const activeTab = ref('image');
const imageList = ref([]);
const textList = ref([]);
const audioList = ref([]);
const videoList = ref([]);
const selectedPreprocess = ref(null);

onMounted(async () => {
	try {
		const zipData = fileStore.files[0];
		const zip = await JSZip.loadAsync(zipData);

		// 清空列表
		imageList.value = [];
		textList.value = [];
		audioList.value = [];
		videoList.value = [];

		// 遍历 zip 文件中的每个文件
		for (const [fileName, file] of Object.entries(zip.files)) {
			if (!file.dir) {
				// 跳过目录
				const fileExtension = fileName.split('.').pop().toLowerCase();
				const item = { id: Date.now() + Math.random(), name: fileName };

				// 根据文件扩展名判断文件类型
				if (
					['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(
						fileExtension,
					)
				) {
					item.url = URL.createObjectURL(await file.async('blob'));
					imageList.value.push(item);
				} else if (
					['txt', 'md', 'doc', 'docx', 'pdf'].includes(fileExtension)
				) {
					// 将 JSZip 的文件对象转换为 Blob
					const blob = await file.async('blob');
					const fileReader = new FileReader();
					fileReader.readAsText(blob, 'UTF-8');
					fileReader.onload = (e) => {
						item.text = e.target.result;
					};
					textList.value.push(item);
				} else if (
					['mp3', 'wav', 'ogg', 'aac', 'flac'].includes(fileExtension)
				) {
					audioList.value.push(item);
				} else if (
					['mp4', 'avi', 'mov', 'mkv', 'flv', 'webm'].includes(
						fileExtension,
					)
				) {
					var canvas = document.createElement('canvas');
					const video = document.createElement('video');
					video.setAttribute('crossOrigin', 'anonymous');
					video.src = URL.createObjectURL(await file.async('blob'));
					video.currentTime = 1;

					// 设置 canvas 的宽度和高度
					canvas.width = video.clientWidth;
					canvas.height = video.clientHeight;

					// 监听视频加载完成事件
					video.onloadeddata = () => {
						if (video.videoWidth === 0 || video.videoHeight === 0) {
							console.error('视频尺寸无效，无法提取封面');
							return;
						}

						canvas.width = video.videoWidth;
						canvas.height = video.videoHeight;
						canvas
							.getContext('2d')
							.drawImage(
								video,
								0,
								0,
								canvas.width,
								canvas.height,
							);
						var dataURL = canvas.toDataURL('image/png');
						item.thumbnail = dataURL;
						videoList.value.push(item);
					};

					// 监听视频加载错误事件
					video.onerror = () => {
						console.error('视频加载失败，无法提取封面');
					};

					// 确保视频加载完成
					video.load();
				}
			}
		}

		console.log(`output->imageList`, imageList.value);
		console.log(`output->textList`, textList.value);
		console.log(`output->audioList`, audioList.value);
		console.log(`output->videoList`, videoList.value);

		ElMessage.success('文件加载成功');
	} catch (error) {
		console.log(`output->error.message`, error.message);
		ElMessage.error('文件加载失败: ' + error.message);
	}
});

const handlePreprocess = (command) => {
	imageList.value.forEach((item) => {
		const img = new Image();
		img.src = item.url;
		img.onload = () => {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);

			switch (command) {
				case 'grayscale':
					const imageData = ctx.getImageData(
						0,
						0,
						canvas.width,
						canvas.height,
					);
					const data = imageData.data;
					for (let i = 0; i < data.length; i += 4) {
						const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
						data[i] = avg; // red
						data[i + 1] = avg; // green
						data[i + 2] = avg; // blue
					}
					ctx.putImageData(imageData, 0, 0);
					break;
				case 'resize':
					canvas.width = img.width / 2;
					canvas.height = img.height / 2;
					ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
					break;
				case 'rotate':
					canvas.width = img.height;
					canvas.height = img.width;
					ctx.rotate((90 * Math.PI) / 180);
					ctx.drawImage(img, 0, -img.height);
					break;
				case 'brightness':
					const brightness = 50; // 调整亮度值
					ctx.filter = `brightness(${brightness}%)`;
					ctx.drawImage(img, 0, 0);
					break;
				case 'contrast':
					const contrast = 200; // 调整对比度值
					ctx.filter = `contrast(${contrast}%)`;
					ctx.drawImage(img, 0, 0);
					break;
				case 'flip':
					ctx.translate(img.width, 0);
					ctx.scale(-1, 1);
					ctx.drawImage(img, 0, 0);
					break;
				default:
					break;
			}

			// 更新图片的 URL
			item.url = canvas.toDataURL('image/png');
		};
	});
};

const download = () => {
	const zip = new JSZip();

	// 添加图像文件到压缩包
	imageList.value.forEach((item) => {
		fetch(item.url)
			.then((response) => response.blob())
			.then((blob) => {
				zip.file(item.name, blob);
			});
	});

	// 添加文本文件到压缩包
	textList.value.forEach((item) => {
		zip.file(item.name, new Blob([item.text], { type: 'text/plain' }));
	});

	// 添加音频文件到压缩包
	audioList.value.forEach((item) => {
		fetch(item.url)
			.then((response) => response.blob())
			.then((blob) => {
				zip.file(item.name, blob);
			});
	});

	// 添加视频文件到压缩包
	videoList.value.forEach((item) => {
		fetch(item.url)
			.then((response) => response.blob())
			.then((blob) => {
				zip.file(item.name, blob);
			});
	});

	// 生成并下载压缩包
	zip.generateAsync({ type: 'blob' }).then((content) => {
		const url = URL.createObjectURL(content);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'dataset.zip';
		a.click();
		URL.revokeObjectURL(url);
	});
};
</script>

<style scoped>
@import '../../assets/css/components/Bar.scss';

.dataset-container {
	width: 100%;
	padding-left: 2%;
	padding-right: 2%;
	padding-top: 60px;
	margin-top: 5px;
	max-height: 70%;
	display: flex;
	flex-direction: column;
}

:deep(.el-tabs) {
	flex: 1;
}

.button-container {
	display: flex;
	justify-content: flex-end; /* 将按钮对齐到右侧 */
	gap: 10px; /* 按钮之间的间距 */
	padding: 10px; /* 添加一些内边距 */
}

.preprocess-button {
	background-color: #4caf50;
	color: white;
	padding: 0.5rem 1rem;
	border-radius: 0.375rem;
	border: none;
	cursor: pointer;
	margin-right: 20px;
}

.create-button {
	background-color: #4f46e5;
	color: white;
	padding: 0.5rem 1rem;
	border-radius: 0.375rem;
	border: none;
	cursor: pointer;
}

.preprocess-button {
	background-color: #4caf50;
	color: white;
	padding: 0.5rem 1rem;
	border-radius: 0.375rem;
	border: none;
	cursor: pointer;
	margin-right: 20px;
}

.create-button {
	background-color: #4f46e5;
	color: white;
	padding: 0.5rem 1rem;
	border-radius: 0.375rem;
	border: none;
	cursor: pointer;
}

.card-list {
	display: grid;
	grid-template-columns: 24% 24% 24% 24%;
	gap: 20px;
	margin-top: 20px;
}

.card-item {
	margin-bottom: 20px;
}

.box-card {
	display: flex;
	flex-direction: column;
}

.card-content {
	display: flex;
	flex-direction: column;
	flex: 1;
}

.card-thumbnail {
	height: 40vh;
	background-color: #f0f0f0;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 10px;
	font-size: 24px;
	font-weight: bold;
}

.card-thumbnail.image-thumbnail {
	background-color: #e1f5fe;
}

.card-thumbnail.text-thumbnail {
	background-color: #e8f5e9;
}

.card-thumbnail.audio-thumbnail {
	background-color: #fff8e1;
}

.card-thumbnail.video-thumbnail {
	background-color: #fbe9e7;
}

.card-type {
	padding: 10px;
	text-align: center;
	font-size: 14px;
	font-weight: bold;
}

.card-button {
	padding: 10px;
	display: flex;
	justify-content: center;
}

:deep(.el-tabs__item) {
	font-size: 18px;
}
</style>
