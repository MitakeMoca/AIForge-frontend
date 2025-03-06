<template>
  <el-tree
    style="max-width: 600px"
    empty-text="没有文件，快去上传吧!"
    :data="dataSource"
    default-expand-all
    node-key="id"
    highlight-current
  >
    <template #default="scope">
      <div
        style="width: 100%; display: flex; justify-content: space-between"
        @click="handleClick(scope.node.data)"  
      >
        <div style="display: flex; justify-content: left">
          <!-- 文件夹的显示 -->
          <div
            style="display: flex; flex-direction: column; justify-content: center"
            v-if="scope.node.data.type === 'folder'"
          >
            <el-icon>
              <Folder />
            </el-icon>
          </div>

          <!-- 文件的显示 -->
          <div v-else>
            <el-icon>
              <Document />
            </el-icon>
          </div>

          <!-- 文件夹和文件名 -->
          <div style="margin-left: 3px">
            {{ scope.node.label }}
          </div>
        </div>
      </div>
    </template>
  </el-tree>
</template>

<script setup>
// 引入Element UI组件
import { Folder, Document } from "@element-plus/icons-vue";
import { defineProps, defineEmits, onMounted } from "vue";

// 接收父组件传递的文件树数据
const props = defineProps({
  dataSource: {
    type: Array,
    required: true,
  },
});

// 定义事件
const emit = defineEmits();

// 处理点击事件，只有在文件节点时才触发事件
const handleClick = (nodeData) => {
  if (nodeData.type === 'file') {
    console.log(nodeData);  // 打印完整的文件信息
    console.log("文件名：" + nodeData.label);  // 显示文件名（包括扩展名）
    // 向父组件传递文件信息
    emit("file-clicked", nodeData);
  }
};
</script>

<style scoped>
</style>
