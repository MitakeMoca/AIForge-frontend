<template>
  <div>
    <a href="#" :class="{'nav-tab': true, 'active': activeTab === 'public'}" @click="setActiveTab('public')">公开数据集</a>
    <a href="#" :class="{'nav-tab': true, 'active': activeTab === 'myData'}" @click="handleMyDataClick()">我的数据集</a>
    <a href="#" :class="{'nav-tab': true, 'active': activeTab === 'favorites'}" @click="setActiveTab('favorites')">我喜欢的</a>

    <div v-if="activeTab === 'myData'">
      <h2>我的数据集</h2>
      <ul>
        <li v-for="dataset in myDatasets" :key="dataset.id">
          <h3>{{ dataset.title }}</h3>
          <p>{{ dataset.description }}</p>
          <p>作者: {{ dataset.author }}</p>
          <p>下载量: {{ dataset.downloads }}</p>
          <p>浏览量: {{ dataset.views }}</p>
          <p>评论数: {{ dataset.comments }}</p>
          <p>点赞数: {{ dataset.likes }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const activeTab = ref('public')
const myDatasets = ref([])
const router = useRouter()

const setActiveTab = (tab) => {
  activeTab.value = tab
}

const handleMyDataClick = async () => {
  setActiveTab('myData')
  try {
    // 检查用户是否登录
    const user = await axios.get('/api/check-auth')
    if (user.data.loggedIn) {
      fetchMyDatasets()
    } else {
      router.push('/login')
    }
  } catch (error) {
    console.error('Error checking authentication:', error)
  }
}

const fetchMyDatasets = async () => {
  try {
    const response = await axios.get('/api/my-datasets') // 替换成你的后端API端点
    myDatasets.value = response.data
  } catch (error) {
    console.error('Error fetching datasets:', error)
  }
}
</script>

<style>
.nav-tab {
  color: #666;
  text-decoration: none;
  padding: 8px 0;
}

.nav-tab.active {
  color: #4F46E5;
  border-bottom: 2px solid #4F46E5;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
  position: fixed; /* 添加这个属性使导航栏固定 */
  top: 0; /* 固定在页面顶部 */
  width: 100%; /* 确保导航栏宽度为100% */
  background-color: white; /* 设置背景颜色，避免内容遮挡 */
  z-index: 1000; /* 确保导航栏在其他元素之上 */
}

</style>
