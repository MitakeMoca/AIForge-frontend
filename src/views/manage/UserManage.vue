<template>
	<el-table :data="users" stripe style="width: 100%">
		<el-table-column prop="user_id" label="用户ID" width="350px" />
		<el-table-column prop="username" label="账号" width="350px" />
		<el-table-column prop="password" label="密码" width="350px" />
		<el-table-column prop="email" label="电子邮箱" width="350px" />
		<el-table-column fixed="right" label="操作">
			<template #default="scope">
				<el-button type="danger" @click="deleteUser(scope.row.user_id)">
					<el-icon :size="14">
						<Delete />
					</el-icon>
					删除
				</el-button>
			</template>
		</el-table-column>
	</el-table>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { findAllUser, deleteUser as deleteUserService } from '@/service/user';
import { Delete } from '@element-plus/icons-vue';

// 用户列表数据
const users = ref([]);

// 加载用户数据
const loadUsers = async () => {
	try {
		const response = await findAllUser();
		if (response && response.data) {
			users.value = response.data;
		}
	} catch (error) {
		ElMessage.error('加载用户列表失败');
	}
};

// 删除用户
const deleteUser = async (userId) => {
	try {
		const response = await deleteUserService({ userId });
		if (response.resultCode === 200) {
			ElMessage.success('删除成功');
			loadUsers(); // 删除后重新加载用户列表
		} else {
			ElMessage.error('删除失败');
		}
	} catch (error) {
		ElMessage.error('删除用户失败');
	}
};

// 挂载时加载用户数据
onMounted(() => {
	loadUsers();
});
</script>
