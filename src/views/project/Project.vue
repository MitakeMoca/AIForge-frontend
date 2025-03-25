<template>
	<header class="upperbar">
		<upperbar />
	</header>
	<aside class="sidebar" style="padding-top: 60px">
		<sidebar />
	</aside>
	<div class="project">
		<div class="project-top">
			<h1 style="margin: 30px; font-size: 40px">我的项目</h1>
			<create-icon
				class="create-project-button"
				@click="createDialog = true"
			></create-icon>
			<!--      <span >创建项目</span>-->
			<el-dialog v-model="createDialog">
				<div>
					<label>
						<span style="font-size: 20px">
							项目名称
							<span style="color: darkred">*</span>
						</span>
					</label>
					<input
						v-model="projectName"
						type="text"
						class="input"
						placeholder="项目名称请输入不超过15个字符"
						style="font-size: 20px"
					/>
					<br />
					<label>
						<span style="font-size: 20px"> 项目简介 </span>
					</label>
					<input
						v-model="projectDescription"
						type="text"
						class="input"
						style="font-size: 20px"
					/>
				</div>
				<br /><br />
				<span slot="footer">
					<el-button size="large" @click="createDialog = false"
						>取消</el-button
					>
					<el-button size="large" type="primary" @click="goCreate()"
						>确定</el-button
					>
				</span>
			</el-dialog>
		</div>
		<!--    <div class="project-middle">-->
		<!--      <span class="item" :class="{active: this.show === 'myCreate'}" @click="showMyProject()">-->
		<!--        我的项目-->
		<!--      </span>-->
		<!--      <span class="item" :class="{active: this.show === 'myCollect'}" @click="showMyCollect()">-->
		<!--        我的收藏-->
		<!--      </span>-->
		<!--    </div>-->
		<div class="separator"></div>
		<div class="project-body">
			<router-view></router-view>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Sidebar from '@/components/Sidebar.vue';
import Upperbar from '@/components/Upperbar.vue';
import { getLocal } from '@/utils/local.js';
import { createProject } from '@/service/project.js';
import CreateDialog from '@/components/CreateDialog.vue';
import CreateIcon from '@/assets/icon/CreateIcon.vue';
import { useRouter } from 'vue-router';

const userId = ref('');
const createDialog = ref(false);
const show = ref('myCreate');
const projectName = ref('');
const projectDescription = ref('');
const router = useRouter();

// 获取用户 ID
onMounted(() => {
	userId.value = getLocal('userId');
});

// 显示我的项目
function showMyProject() {
	show.value = 'myCreate';
	router.push('/project/myProject');
}

// 显示我的收藏
function showMyCollect() {
	show.value = 'myCollect';
	router.push('/project/myCollect');
}

// 格式化日期时间
function formatDateTime(date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 创建项目
function goCreate() {
	if (projectName.value !== '' && projectName.value.length <= 15) {
		let jsonData = {
			ProjectName: projectName.value,
			Description: projectDescription.value,
			UserId: userId.value,
			CreateTime: formatDateTime(new Date()),
			modelId: -1,
			Train_DatasetId: -1,
			Test_DatasetId: -1,
			ImageId: -1,
			ProjectType: '',
		};
		createProject(jsonData).then((res) => {
			router.push({
				path: `/project/projectConfig/${res.data.projectId}`,
			});
		});
		createDialog.value = false;
	} else {
		// 使用 Vue 3 的通知 API (假设您已使用适当的通知库)
		// 这只是一个假设的实现，具体取决于您使用的通知库
		this.$notify({
			message: '请输入合法项目名称',
			type: 'warning',
		});
	}
}
</script>

<style scoped>
@import '../../assets/css/project/project.scss';
@import '../../assets/css/components/Bar.scss';
</style>
