<template>
  <header class="upperbar">
    <upperbar-no-search />
  </header>
  <div class="search-container">
    <div class="search-header">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <div class="search-input-wrapper">
          <input
              type="text"
              v-model="searchQuery"
              :placeholder="placeholder"
              class="search-input"
              @keyup.enter="handleSearch"
          />
          <button
              v-if="searchQuery"
              @click="clearSearch"
              class="clear-button"
          >
            ×
          </button>
        </div>
        <button @click="handleSearch" class="search-button">
          搜索
        </button>
      </div>

      <!-- 分类导航 -->
      <div class="categories">
        <button
            v-for="category in categories"
            :key="category.id"
            :class="['category-button', { active: selectedCategory === category.id }]"
            @click="selectCategory(category.id)"
        >
          {{ category.name }}
        </button>
      </div>
    </div>

    <div class="results-container">
      <!-- 搜索结果 -->
      <div v-if="paginatedResults.length > 0" class="search-results">
        <div v-if="selectedCategory === 'models'">
          <div
              v-for="(result, index) in paginatedResults"
              :key="result.id"
              class="result-card"
              @click="goToDetail(result.modelId)"
          >
            <div class="result-type">模型</div>
            <h3 class="result-title" v-html="highlightText(result.modelName)"></h3>
            <div class="result-header">
              <div class="result-info-noMargin">
                模型框架：
              </div>
              <div class="result-info" v-html="highlightText(result.frame)"></div>
              <div class="result-info">
                创建于: {{ result.modelDate }}
              </div>
              <div class="result-info">
                运行次数: {{ result.modelRunCount }} 次
              </div>
              <div class="result-info">
                查看次数: {{ result.modelViewCount }} 次
              </div>
            </div>
            <div class="result-description" v-html="highlightText(result.modelDescription)"></div>
          </div>
        </div>
        <div v-else-if="selectedCategory === 'datasets'">
          <div
              v-for="(result, index) in paginatedResults"
              :key="result.id"
              class="result-card"
              @click="goToDetail(result.dataSetId)"
          >
            <div class="result-type">数据集</div>
            <h3 class="result-title" v-html="highlightText(result.dataSetName)"></h3>
            <div class="result-header">
              <div class="result-info">
                数据类型: {{ result.dataType }}
              </div>
              <div class="result-info">
                数据大小: {{ result.dataSize }} GB
              </div>
              <div class="result-info-noMargin">
                标签:
              </div>
              <div class="result-info" v-html="highlightText(result.label)"></div>
            </div>
            <div class="result-description" v-html="highlightText(result.introduction)"></div>
          </div>
        </div>
      </div>

      <!-- 分页控件 -->
      <div v-if="totalPages >= 1" class="pagination">
        <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="pagination-button"
        >
          上一页
        </button>
        <span class="page-info">第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
        <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="pagination-button"
        >
          下一页
        </button>
      </div>

      <!-- 空状态 -->
      <div v-else-if="hasSearched" class="empty-state">
        <h3 class="text-xl font-semibold text-gray-800 mb-2">没有找到结果</h3>
        <p class="text-gray-600 mb-4">
          抱歉,我们没有找到与 "{{ searchedQuery }}" 相关的{{ getSelectedCategoryName() }}。
          请尝试使用不同的关键词或浏览其他分类。
        </p>
      </div>

<!--      还未进行搜索-->
      <div v-else class="initial-search-state">
        <svg
            class="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            width="48"
            height="48"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">开始您的搜索</h3>
        <p class="text-gray-600 mb-4">
          在上方输入关键词并选择分类,开始探索您感兴趣的内容。
        </p>
        <ul class="custom-list">
          <li class="list-item">
            <span class="checkmark">&#10004;</span>
            输入关键词以查找相关内容
          </li>
          <li class="list-item">
            <span class="checkmark">&#10004;</span>
            选择特定分类以缩小搜索范围
          </li>
          <li class="list-item">
            <span class="checkmark">&#10004;</span>
            使用分页浏览更多结果
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {ElMessage} from "element-plus";
import {findModelByKeyword} from "@/service/model.js";
import {findDatasetByKeyword} from "@/service/dataset.js";
import router from "@/router/index.js";
import UpperbarNoSearch from "@/components/UpperbarNoSearch.vue";
import {getLocal} from "@/utils/local.js";
import {isEmptyValue} from "@/utils/utils.js";
import {useRoute, useRouter} from "vue-router";

const searchQuery = ref('')
const searchedQuery = ref('')
const selectedCategory = ref('models')
const hasSearched = ref(false)
const currentPage = ref(1)
const projectList = ref([])
const modelList = ref([])
const datasetList = ref([])
const userList = ref([])
const resultsPerPage = 10

// 分类数据
const categories = [
  { id: 'models', name: '模型' },
  { id: 'datasets', name: '数据集' },
]


const filteredResults = computed(() => {
  if(selectedCategory.value === 'models'){
    return modelList.value
  }
  else if(selectedCategory.value === 'datasets'){
    return datasetList.value
  }
  else{
    return []
  }
})

const placeholder = computed(() => {
  return selectedCategory.value === 'all'
      ? '搜索全站内容'
      : `在${categories.find(c => c.id === selectedCategory.value)?.name}中搜索`
})

// New function to highlight matched text
const highlightText = (text) => {
  if (!searchQuery.value || !text) return text;
  const regex = new RegExp(`(${searchQuery.value})`, 'gi');
  // console.log(regex)
  return text.replace(regex, '<span class="highlight">$1</span>');
}


const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * resultsPerPage
  const end = start + resultsPerPage
  if(isEmptyValue(filteredResults.value)){
    return []
  }
  return filteredResults.value.slice(start, end)
})

const totalPages = computed(() => {
  if(isEmptyValue(filteredResults.value)){
    return 0
  }
  return Math.ceil(filteredResults.value.length / resultsPerPage)
})

const selectCategory = (categoryId) => {
  // 如果点击的分类和当前分类相同，则不执行搜索
  if(selectedCategory.value === categoryId && searchQuery.value === searchedQuery.value){
    console.log('点击的分类和当前分类相同，不执行搜索')
    return
  }
  selectedCategory.value = categoryId
  currentPage.value = 1
  handleSearch()
}

const handleSearch = () => {
  if (queryIsEmpty()) {
    ElMessage.warning('当前搜索为空， 请输入搜索内容')
    hasSearched.value = false
    if(selectedCategory.value === 'models'){
      modelList.value = []
    }
    else if(selectedCategory.value === 'datasets'){
      datasetList.value = []
    }
    return
  }
  hasSearched.value = true
  currentPage.value = 1
  searchedQuery.value = searchQuery.value
  // 这里实现实际的搜索逻辑
  // ElMessage.info(`Searching for: ${searchQuery.value}, in category: ${selectedCategory.value}`)
  if(selectedCategory.value === 'models'){
    const params = {
      "message": searchQuery.value
    }
    findModelByKeyword(params).then(res => {
      modelList.value = res.data
    }).catch(err => {
      console.log(err)
    })
  }
  else if(selectedCategory.value === 'datasets'){
    findDatasetByKeyword(searchQuery.value).then(res => {
      // console.log(res.data)
      datasetList.value = res.data
    }).catch(err => {
      console.log(err)
    })
  }
  router.push({
    path: "/search",
    query: { key: searchQuery.value },
    target: "_blank",
  });
}

async function goToDetail(id) {
  // await new Promise(resolve => setTimeout(resolve, 500))
  if(selectedCategory.value === 'models') {
    router.push({name: 'ModelDetail', params: {"modelId":id}}).catch(err => {
      console.log(err)
    })
  }
  else if(selectedCategory.value === 'datasets'){
    router.push({name: 'Data-view', params: {"id":id}}).catch(err => {
      console.log(err)
    })
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  // hasSearched.value = false
  // currentPage.value = 1
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const queryIsEmpty = () => {
  const emptyRegex = /^\s*$/;
  return emptyRegex.test(searchQuery.value);
}

const getSelectedCategoryName = () => {
  for (let i = 0; i < categories.length; i++) {
    if (categories[i].id === selectedCategory.value) {
      // console.log(categories[i].name)
      return categories[i].name;
    }
  }
}
//检查用户是否已登录，未登录则跳转到home
function checkUserLogin() {
  const userId = getLocal("userId");
  // console.log(userId)
  if (isEmptyValue(userId)) {
    // 用户未登录，跳转到登录界面
    console.log("用户未登录"); // 替换为实际的登录页面路径
    window.location.href = "/home";
  }
}

function setSearchQuery() {
  const router = useRouter()
  // router /search?key=8585
  const url = router.currentRoute.value.fullPath;
// 使用URLSearchParams来解析URL中的查询参数
  const params = new URLSearchParams(url.split('?')[1]);
// 获取key的值
  const keyValue = params.get('key');
  if(!isEmptyValue(keyValue)){
    searchQuery.value = keyValue
    handleSearch()
  }
}
onMounted(() => {
  checkUserLogin()
  setSearchQuery()
})
</script>

<style lang="scss" scoped>
@use "../../assets/css/Search.scss";
</style>
<style lang="scss">
.highlight {
  background-color: #fff9b9; /* 使用更柔和的黄色 */
  color: #333; /* 增加颜色对比，使文本颜色更深 */
  font-weight: 600; /* 稍微减轻字体权重 */
  border-radius: 4px; /* 圆角边框 */
  font-family: 'Arial', sans-serif; /* 选择一个常见的字体 */
  max-width: 100%; /* 限制宽度 */
  word-break: break-word; /* 防止单词溢出 */
}
</style>
